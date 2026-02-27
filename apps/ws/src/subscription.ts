import { createClient, RedisClientType } from "redis";
import { UserManager } from "./UserManager.js";
import { logger } from "./utils/logger.js";

export class Subscription {
  private static instance: Subscription;
  private userSubscriptions: Map<string, string[]> = new Map();
  private topicSubscribers: Map<string, string[]> = new Map();
  private redisClient: RedisClientType;
  private isReady: boolean = false;
  private readyPromise: Promise<void>;

  constructor() {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    this.redisClient = createClient({ url: redisUrl });
    this.readyPromise = this.initRedis();
  }

  private async initRedis(): Promise<void> {
    try {
      await this.redisClient.connect();
      this.isReady = true;
      logger.info("redis.connected", {
        message: "Redis connected successfully",
      });
    } catch (error) {
      logger.error("redis.connection.failed", { error });
      throw error;
    }

    this.redisClient.on("error", (err) => {
      logger.error("redis.client.error", { error: err });
      this.isReady = false;
    });

    this.redisClient.on("ready", () => {
      this.isReady = true;
      logger.info("redis.ready", { message: "Redis ready" });
    });
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Subscription();
    }
    return this.instance;
  }

  private async ensureReady() {
    if (!this.isReady) {
      await this.readyPromise;
    }
  }

  public async subscribe(userId: string, subscription: string) {
    await this.ensureReady();

    if (!this.isValidSubscription(subscription)) {
      logger.warn("subscription.invalid", { subscription });
      return;
    }

    if (this.userSubscriptions.get(userId)?.includes(subscription)) {
      logger.info("subscription.duplicate", { userId, subscription });
      return;
    }

    this.userSubscriptions.set(
      userId,
      (this.userSubscriptions.get(userId) || []).concat(subscription),
    );

    this.topicSubscribers.set(
      subscription,
      (this.topicSubscribers.get(subscription) || []).concat(userId),
    );

    if (this.topicSubscribers.get(subscription)?.length === 1) {
      await this.redisClient.subscribe(subscription, this.Callback);
      logger.info("redis.channel.subscribed", { channel: subscription });
    } else {
      logger.info("subscription.added", { userId, subscription });
    }
  }

  private Callback = (message: string, channel: string) => {
    try {
      const parsedMessage = JSON.parse(message);
      const subscribers = this.topicSubscribers.get(channel);

      if (!subscribers) {
        logger.warn("subscription.no_subscribers", { channel });
        return;
      }

      logger.info("subscription.broadcast", {
        channel,
        subscriberCount: subscribers.length,
      });

      subscribers.forEach((userId) => {
        const user = UserManager.getInstance().getUser(userId);
        if (user) {
          const transformedMessage = this.transformMessage(
            parsedMessage,
            channel,
          );
          user.emit(transformedMessage);
          logger.info("subscription.message.sent", { userId, channel });
        } else {
          logger.warn("subscription.user.not_found", { userId });
        }
      });
    } catch (error) {
      logger.error("redis.message.error", { error });
    }
  };

  private transformMessage(parsedMessage: any, channel: string): any {
    const { stream, data } = parsedMessage;

    if (stream && stream.startsWith("ticker@")) {
      return {
        type: "ticker",
        stream: stream,
        data: {
          event: data.event || "ticker",
          symbol: data.symbol,
          price: data.price,
          quantity: data.quantity,
          side: data.side,
          priceChange: data.priceChange,
          priceChangePercent: data.priceChangePercent,
          high24h: data.high24h,
          low24h: data.low24h,
          volume24h: data.volume24h,
          quoteVolume24h: data.quoteVolume24h,
          timestamp: data.timestamp || Date.now(),
        },
      };
    }

    if (stream && stream.startsWith("depth@")) {
      return {
        type: "depth",
        stream: stream,
        data: {
          event: data.event || "depth",
          symbol: data.symbol,
          bids: data.bids,
          asks: data.asks,
          timestamp: data.timestamp || Date.now(),
        },
      };
    }

    if (stream && stream.startsWith("trade@")) {
      return {
        type: "trade",
        stream: stream,
        data: {
          event: data.event || "trade",
          tradeId: data.tradeId,
          symbol: data.symbol,
          price: data.price,
          quantity: data.quantity,
          side: data.side,
          timestamp: data.timestamp || Date.now(),
        },
      };
    }

    if (stream && stream.startsWith("kline@")) {
      return {
        type: "kline",
        stream: stream,
        data: {
          event: data.event || "kline",
          symbol: data.symbol,
          interval: data.interval,
          kline: {
            timestamp: data.kline.timestamp,
            open: data.kline.open,
            high: data.kline.high,
            low: data.kline.low,
            close: data.kline.close,
            volume: data.kline.volume,
            trades: data.kline.trades,
            isClosed: data.kline.isClosed,
            newCandleInitiated: data.kline.newCandleInitiated,
          },
        },
      };
    }

    logger.warn("subscription.unknown_format", { channel });
    return parsedMessage;
  }

  public async unsubscribe(userId: string, subscription: string) {
    await this.ensureReady();

    const userSubs = this.userSubscriptions.get(userId);
    if (userSubs) {
      const filtered = userSubs.filter((s) => s !== subscription);
      if (filtered.length === 0) {
        this.userSubscriptions.delete(userId);
      } else {
        this.userSubscriptions.set(userId, filtered);
      }
    }

    const subscribers = this.topicSubscribers.get(subscription);
    if (subscribers) {
      const newSubscribers = subscribers.filter((s) => s !== userId);

      if (newSubscribers.length === 0) {
        await this.redisClient.unsubscribe(subscription);
        this.topicSubscribers.delete(subscription);
        logger.info("redis.channel.unsubscribed", { channel: subscription });
      } else {
        this.topicSubscribers.set(subscription, newSubscribers);
      }
    }
  }

  public async userLeft(userId: string) {
    const subscriptions = this.userSubscriptions.get(userId);
    if (subscriptions) {
      for (const sub of subscriptions) {
        await this.unsubscribe(userId, sub);
      }
      logger.info("user.left", { userId });
    }
  }

  private isValidSubscription(sub: string): boolean {
    const pattern =
      /^(ticker|depth|trade|kline)@[A-Z0-9_]+(@(1m|5m|15m|1h|4h|1d))?$/;
    return pattern.test(sub) && sub.length < 50;
  }

  public getStats() {
    return {
      totalUsers: this.userSubscriptions.size,
      totalTopics: this.topicSubscribers.size,
      isRedisReady: this.isReady,
    };
  }

  public async cleanup() {
    try {
      await this.redisClient.quit();
      logger.info("redis.connection.closed", {
        message: "Redis connection closed",
      });
    } catch (error) {
      logger.error("redis.cleanup.error", { error });
    }
  }
}
