import { createClient, RedisClientType } from "redis";
import { ResponseToHTTP } from "./types/responses";
import { logger } from "../utils/logger.js";

export class RedisManager {
  private client: RedisClientType;
  private static instance: RedisManager;

  private constructor() {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

    this.client = createClient({ url: redisUrl });
    this.client
      .connect()
      .then(() => logger.info("redis_manager.connected"))
      .catch((err) =>
        logger.error("redis_manager.connection_failed", { error: err }),
      );
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }
    return this.instance;
  }

  public async Publish(channel: string, message: any) {
    try {
      logger.info("redis_manager.publishing", { channel });
      await this.client.publish(channel, JSON.stringify(message));
      logger.info("redis_manager.published", { channel });
    } catch (err) {
      logger.error("redis_manager.publish_failed", { channel, error: err });
      throw err;
    }
  }

  public async ResponseToHTTP(clientId: string, message: ResponseToHTTP) {
    try {
      logger.info("redis_manager.response_to_http", { clientId });
      await this.client.publish(clientId, JSON.stringify(message));
      logger.info("redis_manager.response_sent", { clientId });
    } catch (err) {
      logger.error("redis_manager.response_failed", { clientId, error: err });
      throw err;
    }
  }

  public async cleanup() {
    await this.client.quit();
  }
}
