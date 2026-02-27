import { createClient, RedisClientType } from "redis";
import { ResponseFromOrderbook } from "./types/responses";
import { logger } from "./utils/logger.js";

export class Manager {
  private client: RedisClientType;
  private pubSubClient: RedisClientType;
  private static instance: Manager;

  private constructor() {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

    this.client = createClient({ url: redisUrl });
    this.client
      .connect()
      .then(() => logger.info("redis.client_connected"))
      .catch((err) =>
        logger.error("redis.client_connection_failed", { error: err }),
      );

    this.pubSubClient = createClient({ url: redisUrl });
    this.pubSubClient
      .connect()
      .then(() => logger.info("redis.pubsub_connected"))
      .catch((err) =>
        logger.error("redis.pubsub_connection_failed", { error: err }),
      );
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Manager();
    }
    return this.instance;
  }

  getRandomClientId() {
    const id =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    logger.info("redis.client_id_generated", { clientId: id });
    return id;
  }

  public async Enqueue(message: any) {
    logger.info("redis.enqueue", { message });
    return new Promise<ResponseFromOrderbook>((resolve, reject) => {
      const id = this.getRandomClientId();
      const dataToQueue = { clientId: id, message };

      this.pubSubClient.subscribe(id, (msg) => {
        logger.info("redis.message_received", { channel: id, message: msg });
        this.pubSubClient.unsubscribe(id);
        try {
          resolve(JSON.parse(msg));
        } catch (err) {
          logger.error("redis.parse_failed", { error: err });
          reject(err);
        }
      });

      this.client
        .lPush("body", JSON.stringify(dataToQueue))
        .then(() => logger.info("redis.message_pushed", { data: dataToQueue }))
        .catch((err) => {
          logger.error("redis.push_failed", { error: err });
          reject(err);
        });
    });
  }

  public async cleanup() {
    await this.client.quit();
    await this.pubSubClient.quit();
  }
}
