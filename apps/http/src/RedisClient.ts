import { randomUUID } from "node:crypto";
import { createClient, RedisClientType } from "redis";
import { ResponseFromOrderbook } from "./types/responses";
import { logger } from "./utils/logger.js";

export class Manager {
  private client: RedisClientType;
  private pubSubClient: RedisClientType;
  private static instance: Manager;

  private ready: Promise<void>;

  private constructor() {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

    this.client = createClient({ url: redisUrl });
    this.pubSubClient = createClient({ url: redisUrl });

    this.ready = this.init();
  }

  private async init() {
    await this.client.connect();
    logger.info("redis.client_connected");
    await this.pubSubClient.connect();
    logger.info("redis.pubsub_connected");
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Manager();
    }
    return this.instance;
  }

  static async waitForReady() {
    const instance = this.getInstance();
    await instance.ready;
  }

  getRandomClientId() {
    const id = randomUUID();
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
