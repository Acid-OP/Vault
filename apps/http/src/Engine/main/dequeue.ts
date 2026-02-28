import { createClient } from "redis";
import { Engine } from "../trade/Engine";
import { RedisManager } from "../RedisManager";
import { MARKETS } from "../config/markets";
import { logger } from "../../utils/logger.js";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const client = createClient({ url: redisUrl });

let engineInstance: Engine | null = null;
let running = true;
let depthTimer: ReturnType<typeof setInterval> | null = null;

export function getEngine(): Engine | null {
  return engineInstance;
}

export function stopDequeue() {
  running = false;
}

const lastDepthHash = new Map<string, string>();

function depthHash(bids: [string, string][], asks: [string, string][]): string {
  return JSON.stringify(bids) + "|" + JSON.stringify(asks);
}

export function startDepthSnapshotTimer() {
  if (!engineInstance) return;
  const engine = engineInstance;

  depthTimer = setInterval(() => {
    let pushed = 0;
    MARKETS.forEach((m) => {
      const depth = engine.getDepthDirect(m.symbol);
      const hash = depthHash(depth.bids, depth.asks);
      if (lastDepthHash.get(m.symbol) === hash) return;
      lastDepthHash.set(m.symbol, hash);
      pushed++;
      RedisManager.getInstance().pushDbEvent({
        type: "DEPTH_SNAPSHOT",
        symbol: m.symbol,
        bids: depth.bids,
        asks: depth.asks,
        timestamp: depth.timestamp,
      });
    });
    if (pushed > 0) {
      logger.info("dequeue.depth_snapshots_pushed", { count: pushed });
    }
  }, 30_000);
}

export function stopDepthSnapshotTimer() {
  if (depthTimer) {
    clearInterval(depthTimer);
    depthTimer = null;
  }
}

async function main() {
  logger.info("dequeue.starting");
  await client
    .connect()
    .then(() => logger.info("dequeue.redis_connected"))
    .catch((err: any) =>
      logger.error("dequeue.redis_connection_failed", { error: err }),
    );

  engineInstance = new Engine();
  logger.info("dequeue.engine_initialized");

  while (running) {
    try {
      const result = await client.brPop("body", 5);
      if (result) {
        logger.info("dequeue.message_received", { message: result.element });
        try {
          engineInstance.process(JSON.parse(result.element));
          logger.info("dequeue.message_processed");
        } catch (err) {
          logger.error("dequeue.processing_failed", { error: err });
        }
      }
    } catch (err) {
      logger.error("dequeue.brpop_failed", { error: err });
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  await client.quit();
  logger.info("dequeue.shutdown_complete");
}

main();
