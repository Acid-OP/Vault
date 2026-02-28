import { createClient, RedisClientType } from "redis";
import { prismaClient } from "@repo/db/client";
import { createLogger } from "@repo/logger";
import {
  DbEvent,
  OrderNewEvent,
  OrderCancelEvent,
  TradeEvent,
  KlineUpdateEvent,
  DepthSnapshotEvent,
} from "./types.js";

const logger = createLogger("db-writer");

const FLUSH_INTERVAL_MS = 2000;
const MAX_BATCH_SIZE = 100;

export class DbBatcher {
  private client: RedisClientType;
  private running = false;
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  private orderNewBatch: OrderNewEvent[] = [];
  private orderCancelBatch: OrderCancelEvent[] = [];
  private tradeBatch: TradeEvent[] = [];
  private klineBatch: KlineUpdateEvent[] = [];
  private depthBatch: DepthSnapshotEvent[] = [];

  constructor() {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    this.client = createClient({ url: redisUrl });
  }

  async start(): Promise<void> {
    await this.client.connect();
    logger.info("db_batcher.connected");
    this.running = true;

    this.flushTimer = setInterval(() => {
      this.flushAll().catch((err) =>
        logger.error("db_batcher.flush_timer_error", { error: err }),
      );
    }, FLUSH_INTERVAL_MS);

    this.consumeLoop();
  }

  async stop(): Promise<void> {
    this.running = false;

    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    await this.flushAll();
    logger.info("db_batcher.final_flush_complete");

    await this.client.quit();
    logger.info("db_batcher.stopped");
  }

  private async consumeLoop(): Promise<void> {
    while (this.running) {
      try {
        const result = await this.client.brPop("db_events", 1);
        if (!result) continue;

        const event: DbEvent = JSON.parse(result.element);
        this.dispatch(event);

        if (this.totalBatchSize() >= MAX_BATCH_SIZE) {
          await this.flushAll();
        }
      } catch (err) {
        if (this.running) {
          logger.error("db_batcher.consume_error", { error: err });
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }
  }

  private dispatch(event: DbEvent): void {
    switch (event.type) {
      case "ORDER_NEW":
        this.orderNewBatch.push(event);
        break;
      case "ORDER_CANCEL":
        this.orderCancelBatch.push(event);
        break;
      case "TRADE":
        this.tradeBatch.push(event);
        break;
      case "KLINE_UPDATE":
        this.klineBatch.push(event);
        break;
      case "DEPTH_SNAPSHOT":
        this.depthBatch.push(event);
        break;
    }
  }

  private totalBatchSize(): number {
    return (
      this.orderNewBatch.length +
      this.orderCancelBatch.length +
      this.tradeBatch.length +
      this.klineBatch.length +
      this.depthBatch.length
    );
  }

  async flushAll(): Promise<void> {
    // Flush orders first so trades can reference them
    await this.flushOrderNew();
    await this.flushOrderCancel();

    // Rest in parallel
    await Promise.allSettled([
      this.flushTrades(),
      this.flushKlines(),
      this.flushDepth(),
    ]);
  }

  private async flushOrderNew(): Promise<void> {
    if (this.orderNewBatch.length === 0) return;
    const batch = this.orderNewBatch.splice(0);
    try {
      await prismaClient.order.createMany({
        data: batch.map((e) => ({
          id: e.orderId,
          userId: e.userId,
          market: e.market,
          side: e.side,
          price: e.price,
          quantity: e.quantity,
          filled: e.filled,
          status: e.status,
        })),
        skipDuplicates: true,
      });
      logger.info("db_batcher.orders_flushed", { count: batch.length });
    } catch (err) {
      logger.error("db_batcher.orders_flush_failed", { error: err });
      this.orderNewBatch.unshift(...batch);
    }
  }

  private async flushOrderCancel(): Promise<void> {
    if (this.orderCancelBatch.length === 0) return;
    const batch = this.orderCancelBatch.splice(0);
    const ids = batch.map((e) => e.orderId);
    try {
      await prismaClient.order.updateMany({
        where: { id: { in: ids } },
        data: { status: "cancelled" },
      });
      logger.info("db_batcher.cancels_flushed", { count: batch.length });
    } catch (err) {
      logger.error("db_batcher.cancels_flush_failed", { error: err });
      this.orderCancelBatch.unshift(...batch);
    }
  }

  private async flushTrades(): Promise<void> {
    if (this.tradeBatch.length === 0) return;
    const batch = this.tradeBatch.splice(0);
    try {
      await prismaClient.trade.createMany({
        data: batch.map((e) => ({
          tradeId: e.tradeId,
          orderId: e.orderId,
          symbol: e.symbol,
          price: Number(e.price),
          quantity: e.quantity,
          side: e.side,
          takerUserId: e.takerUserId,
          makerUserId: e.makerUserId,
          makerOrderId: e.makerOrderId,
        })),
        skipDuplicates: true,
      });
      logger.info("db_batcher.trades_flushed", { count: batch.length });
    } catch (err) {
      logger.error("db_batcher.trades_flush_failed", { error: err });
      this.tradeBatch.unshift(...batch);
    }
  }

  private async flushKlines(): Promise<void> {
    if (this.klineBatch.length === 0) return;
    const batch = this.klineBatch.splice(0);

    // Dedupe: keep latest per (symbol, interval, openTime)
    const deduped = new Map<string, KlineUpdateEvent>();
    for (const e of batch) {
      deduped.set(`${e.symbol}:${e.interval}:${e.openTime}`, e);
    }

    try {
      await prismaClient.$transaction(
        [...deduped.values()].map((e) =>
          prismaClient.ohlcvCandle.upsert({
            where: {
              symbol_interval_openTime: {
                symbol: e.symbol,
                interval: e.interval,
                openTime: e.openTime,
              },
            },
            create: {
              symbol: e.symbol,
              interval: e.interval,
              openTime: e.openTime,
              closeTime: e.closeTime,
              open: e.open,
              high: e.high,
              low: e.low,
              close: e.close,
              volume: e.volume,
              trades: e.trades,
            },
            update: {
              closeTime: e.closeTime,
              high: e.high,
              low: e.low,
              close: e.close,
              volume: e.volume,
              trades: e.trades,
            },
          }),
        ),
      );
      logger.info("db_batcher.klines_flushed", { count: deduped.size });
    } catch (err) {
      logger.error("db_batcher.klines_flush_failed", { error: err });
      this.klineBatch.unshift(...batch);
    }
  }

  private async flushDepth(): Promise<void> {
    if (this.depthBatch.length === 0) return;
    const batch = this.depthBatch.splice(0);
    try {
      await prismaClient.depthSnapshot.createMany({
        data: batch.map((e) => ({
          symbol: e.symbol,
          bids: e.bids,
          asks: e.asks,
          timestamp: e.timestamp,
        })),
      });
      logger.info("db_batcher.depth_flushed", { count: batch.length });
    } catch (err) {
      logger.error("db_batcher.depth_flush_failed", { error: err });
      this.depthBatch.unshift(...batch);
    }
  }
}
