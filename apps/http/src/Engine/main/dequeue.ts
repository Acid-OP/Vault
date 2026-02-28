import { createClient } from "redis";
import { Engine } from "../trade/Engine";
import { logger } from "../../utils/logger.js";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const client = createClient({ url: redisUrl });

let engineInstance: Engine | null = null;
let running = true;

export function getEngine(): Engine | null {
  return engineInstance;
}

export function stopDequeue() {
  running = false;
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
