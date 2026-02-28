import { describe, it, expect, vi, beforeEach } from "vitest";

const {
  mockCreateMany,
  mockUpdateMany,
  mockTradeCreateMany,
  mockDepthCreateMany,
  mockUpsert,
  mockTransaction,
  mockConnect,
  mockBrPop,
  mockLPush,
  mockQuit,
} = vi.hoisted(() => ({
  mockCreateMany: vi.fn().mockResolvedValue({ count: 0 }),
  mockUpdateMany: vi.fn().mockResolvedValue({ count: 0 }),
  mockTradeCreateMany: vi.fn().mockResolvedValue({ count: 0 }),
  mockDepthCreateMany: vi.fn().mockResolvedValue({ count: 0 }),
  mockUpsert: vi.fn().mockResolvedValue({}),
  mockTransaction: vi.fn().mockImplementation((ops: any[]) => Promise.all(ops)),
  mockConnect: vi.fn().mockResolvedValue(undefined),
  mockBrPop: vi.fn().mockResolvedValue(null),
  mockLPush: vi.fn().mockResolvedValue(undefined),
  mockQuit: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@repo/logger", () => ({
  createLogger: () => ({ info: vi.fn(), error: vi.fn(), warn: vi.fn() }),
}));

vi.mock("@repo/db/client", () => ({
  prismaClient: {
    order: { createMany: mockCreateMany, updateMany: mockUpdateMany },
    trade: { createMany: mockTradeCreateMany },
    ohlcvCandle: { upsert: mockUpsert },
    depthSnapshot: { createMany: mockDepthCreateMany },
    $transaction: mockTransaction,
  },
}));

vi.mock("redis", () => ({
  createClient: () => ({
    connect: mockConnect,
    brPop: mockBrPop,
    lPush: mockLPush,
    quit: mockQuit,
    on: vi.fn(),
  }),
}));

import { DbBatcher } from "../DbBatcher";
import type {
  OrderNewEvent,
  OrderCancelEvent,
  TradeEvent,
  KlineUpdateEvent,
  DepthSnapshotEvent,
} from "../types";

function makeOrderNew(overrides: Partial<OrderNewEvent> = {}): OrderNewEvent {
  return {
    type: "ORDER_NEW",
    orderId: "ord-1",
    userId: "user-1",
    market: "CR7_USD",
    side: "buy",
    price: 100,
    quantity: 5,
    filled: 0,
    status: "open",
    ...overrides,
  };
}

function makeOrderCancel(
  overrides: Partial<OrderCancelEvent> = {},
): OrderCancelEvent {
  return { type: "ORDER_CANCEL", orderId: "ord-1", ...overrides };
}

function makeTrade(overrides: Partial<TradeEvent> = {}): TradeEvent {
  return {
    type: "TRADE",
    tradeId: 1,
    orderId: "ord-1",
    symbol: "CR7_USD",
    price: "100",
    quantity: 5,
    side: "buy",
    takerUserId: "user-1",
    makerUserId: "user-2",
    makerOrderId: "ord-2",
    ...overrides,
  };
}

function makeKline(
  overrides: Partial<KlineUpdateEvent> = {},
): KlineUpdateEvent {
  return {
    type: "KLINE_UPDATE",
    symbol: "CR7_USD",
    interval: "1m",
    openTime: 1000,
    closeTime: 2000,
    open: 100,
    high: 110,
    low: 90,
    close: 105,
    volume: 50,
    trades: 10,
    ...overrides,
  };
}

function makeDepth(
  overrides: Partial<DepthSnapshotEvent> = {},
): DepthSnapshotEvent {
  return {
    type: "DEPTH_SNAPSHOT",
    symbol: "CR7_USD",
    bids: [["100", "5"]],
    asks: [["101", "3"]],
    timestamp: Date.now(),
    ...overrides,
  };
}

describe("DbBatcher", () => {
  let batcher: DbBatcher;

  beforeEach(() => {
    vi.clearAllMocks();
    batcher = new DbBatcher();
  });

  describe("dispatch", () => {
    it("routes ORDER_NEW to correct batch", () => {
      (batcher as any).dispatch(makeOrderNew());
      expect((batcher as any).orderNewBatch).toHaveLength(1);
    });

    it("routes ORDER_CANCEL to correct batch", () => {
      (batcher as any).dispatch(makeOrderCancel());
      expect((batcher as any).orderCancelBatch).toHaveLength(1);
    });

    it("routes TRADE to correct batch", () => {
      (batcher as any).dispatch(makeTrade());
      expect((batcher as any).tradeBatch).toHaveLength(1);
    });

    it("routes KLINE_UPDATE to correct batch", () => {
      (batcher as any).dispatch(makeKline());
      expect((batcher as any).klineBatch).toHaveLength(1);
    });

    it("routes DEPTH_SNAPSHOT to correct batch", () => {
      (batcher as any).dispatch(makeDepth());
      expect((batcher as any).depthBatch).toHaveLength(1);
    });
  });

  describe("totalBatchSize", () => {
    it("sums all batches", () => {
      (batcher as any).dispatch(makeOrderNew());
      (batcher as any).dispatch(makeTrade());
      (batcher as any).dispatch(makeKline());
      expect((batcher as any).totalBatchSize()).toBe(3);
    });
  });

  describe("flushAll", () => {
    it("flushes orders before trades (order of Prisma calls)", async () => {
      const callOrder: string[] = [];
      mockCreateMany.mockImplementation(async () => {
        callOrder.push("order.createMany");
        return { count: 1 };
      });
      mockUpdateMany.mockImplementation(async () => {
        callOrder.push("order.updateMany");
        return { count: 1 };
      });
      mockTradeCreateMany.mockImplementation(async () => {
        callOrder.push("trade.createMany");
        return { count: 1 };
      });

      (batcher as any).dispatch(makeOrderNew());
      (batcher as any).dispatch(makeOrderCancel());
      (batcher as any).dispatch(makeTrade());

      await batcher.flushAll();

      const orderIdx = callOrder.indexOf("order.createMany");
      const cancelIdx = callOrder.indexOf("order.updateMany");
      const tradeIdx = callOrder.indexOf("trade.createMany");
      expect(orderIdx).toBeLessThan(tradeIdx);
      expect(cancelIdx).toBeLessThan(tradeIdx);
    });
  });

  describe("flushOrderNew", () => {
    it("calls prisma.order.createMany with correct data shape", async () => {
      (batcher as any).dispatch(
        makeOrderNew({
          orderId: "abc",
          userId: "u1",
          market: "CR7_USD",
          side: "sell",
          price: 50,
          quantity: 10,
          filled: 2,
          status: "partially_filled",
        }),
      );
      await (batcher as any).flushOrderNew();

      expect(mockCreateMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({
            id: "abc",
            userId: "u1",
            market: "CR7_USD",
            side: "sell",
            type: "limit",
            price: 50,
            quantity: 10,
            filled: 2,
            status: "partially_filled",
          }),
        ],
        skipDuplicates: true,
      });
    });
  });

  describe("flushOrderCancel", () => {
    it("calls prisma.order.updateMany with correct where/data", async () => {
      (batcher as any).dispatch(makeOrderCancel({ orderId: "cancel-1" }));
      (batcher as any).dispatch(makeOrderCancel({ orderId: "cancel-2" }));
      await (batcher as any).flushOrderCancel();

      expect(mockUpdateMany).toHaveBeenCalledWith({
        where: { id: { in: ["cancel-1", "cancel-2"] } },
        data: { status: "cancelled" },
      });
    });
  });

  describe("flushTrades", () => {
    it("calls prisma.trade.createMany with correct data shape", async () => {
      (batcher as any).dispatch(
        makeTrade({
          tradeId: 42,
          orderId: "o1",
          symbol: "CR7_USD",
          price: "99",
          quantity: 3,
          side: "sell",
          takerUserId: "t1",
          makerUserId: "m1",
          makerOrderId: "mo1",
        }),
      );
      await (batcher as any).flushTrades();

      expect(mockTradeCreateMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({
            tradeId: 42,
            orderId: "o1",
            symbol: "CR7_USD",
            price: 99,
            quantity: 3,
            side: "sell",
            takerUserId: "t1",
            makerUserId: "m1",
            makerOrderId: "mo1",
          }),
        ],
        skipDuplicates: true,
      });
    });
  });

  describe("flushKlines", () => {
    it("deduplicates by symbol:interval:openTime", async () => {
      (batcher as any).dispatch(
        makeKline({
          symbol: "CR7_USD",
          interval: "1m",
          openTime: 1000,
          close: 100,
        }),
      );
      (batcher as any).dispatch(
        makeKline({
          symbol: "CR7_USD",
          interval: "1m",
          openTime: 1000,
          close: 110,
        }),
      );
      (batcher as any).dispatch(
        makeKline({
          symbol: "CR7_USD",
          interval: "1m",
          openTime: 2000,
          close: 120,
        }),
      );

      await (batcher as any).flushKlines();

      // $transaction called with 2 upserts (deduplicated from 3 events)
      expect(mockTransaction).toHaveBeenCalledTimes(1);
      const transactionArg = mockTransaction.mock.calls[0]![0];
      expect(transactionArg).toHaveLength(2);
    });

    it("calls prisma.$transaction with upsert args", async () => {
      (batcher as any).dispatch(makeKline());
      await (batcher as any).flushKlines();

      expect(mockTransaction).toHaveBeenCalled();
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            symbol_interval_openTime: expect.objectContaining({
              symbol: "CR7_USD",
              interval: "1m",
              openTime: 1000,
            }),
          }),
          create: expect.objectContaining({ symbol: "CR7_USD" }),
          update: expect.objectContaining({ close: 105 }),
        }),
      );
    });
  });

  describe("flushDepth", () => {
    it("calls prisma.depthSnapshot.createMany with correct data shape", async () => {
      (batcher as any).dispatch(
        makeDepth({
          symbol: "CR7_USD",
          bids: [["100", "5"]],
          asks: [["101", "3"]],
          timestamp: 12345,
        }),
      );
      await (batcher as any).flushDepth();

      expect(mockDepthCreateMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({
            symbol: "CR7_USD",
            bids: [["100", "5"]],
            asks: [["101", "3"]],
            timestamp: 12345,
          }),
        ],
      });
    });
  });

  describe("flush failure — batch re-queued via unshift", () => {
    it("re-queues batch on Prisma error", async () => {
      mockCreateMany.mockRejectedValueOnce(new Error("DB down"));

      (batcher as any).dispatch(makeOrderNew());
      expect((batcher as any).orderNewBatch).toHaveLength(1);

      await (batcher as any).flushOrderNew();

      // Batch should be re-queued
      expect((batcher as any).orderNewBatch).toHaveLength(1);
    });
  });

  describe("stop", () => {
    it("does final flush then quits Redis", async () => {
      (batcher as any).dispatch(makeOrderNew());
      await batcher.stop();

      // flushAll was called (order.createMany) then quit
      expect(mockCreateMany).toHaveBeenCalled();
      expect(mockQuit).toHaveBeenCalled();
    });
  });
});
