import { Engine } from "../trade/Engine";
import { logger } from "../../utils/logger.js";
const { createClient } = require("redis");

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const client = createClient({ url: redisUrl });

async function main() {
  logger.info("dequeue.starting");
  await client
    .connect()
    .then(() => logger.info("dequeue.redis_connected"))
    .catch((err: any) =>
      logger.error("dequeue.redis_connection_failed", { error: err }),
    );

  const engine = new Engine();
  logger.info("dequeue.engine_initialized");

  while (true) {
    const obj = await client.rPop("body");
    if (obj) {
      logger.info("dequeue.message_received", { message: obj });
      try {
        engine.process(JSON.parse(obj));
        logger.info("dequeue.message_processed");
      } catch (err) {
        logger.error("dequeue.processing_failed", { error: err });
      }
    }
  }
}

main();
