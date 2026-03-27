import { logger } from "./utils/logger.js";

interface MarketConfig {
  symbol: string;
  basePrice: number;
  /** Max price drift per tick */
  volatility: number;
  /** 0.0 = strong downtrend, 0.5 = sideways, 1.0 = strong uptrend */
  trend: number;
  /** Number of price levels on each side */
  levels: number;
  /** Spacing between levels in USD */
  spread: number;
  /** Average order size */
  baseQty: number;
}

interface ActiveOrder {
  orderId: string;
  side: "buy" | "sell";
  price: number;
}

const API_URL = process.env.API_URL || "http://localhost:3001";
const MM_USER = process.env.MM_USER || "mm-liquidity";

export class MarketMaker {
  private config: MarketConfig;
  private fairPrice: number;
  private activeOrders: ActiveOrder[] = [];
  private tickCount = 0;
  private lastDrift = 0;
  private momentum = 0;
  private netPosition = 0;

  constructor(config: MarketConfig) {
    this.config = config;
    this.fairPrice = config.basePrice;
    logger.info("mm.init", {
      symbol: config.symbol,
      fairPrice: config.basePrice,
      trend:
        config.trend > 0.5 ? "BULL" : config.trend < 0.5 ? "BEAR" : "NEUTRAL",
    });
  }

  private updateFairPrice() {
    const { volatility, trend } = this.config;

    // Base drift: trend controls the bias direction
    // trend=0.7 → (random - 0.3) → mostly positive
    // trend=0.3 → (random - 0.7) → mostly negative
    let drift = (Math.random() - (1 - trend)) * volatility * 2;

    // Momentum: 30% carry from last drift (trends tend to continue)
    drift += this.lastDrift * 0.3;

    // Occasional breakout: 8% chance of a 2-3x move
    if (Math.random() < 0.08) {
      drift *= 2 + Math.random();
    }

    // Mean reversion: pull back toward base price, stronger as deviation grows
    const deviation =
      (this.fairPrice - this.config.basePrice) / this.config.basePrice;
    if (Math.abs(deviation) > 0.15) {
      drift -= deviation * volatility * 0.8;
    }

    this.lastDrift = drift;
    this.momentum = drift > 0 ? 1 : -1;
    this.fairPrice = Math.max(0.01, +(this.fairPrice + drift).toFixed(2));
  }

  private randomQty(): number {
    const base = this.config.baseQty;
    return Math.max(1, Math.round(base * (0.5 + Math.random())));
  }

  private async placeOrder(
    side: "buy" | "sell",
    price: number,
    quantity: number,
    userId: string,
    retries = 1,
  ): Promise<{ orderId: string; fullyFilled: boolean } | null> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch(`${API_URL}/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            market: this.config.symbol,
            price: price.toFixed(2),
            quantity: quantity.toString(),
            side,
            userId,
          }),
        });
        const data = (await res.json()) as any;
        if (!res.ok) {
          logger.error("mm.place_order_rejected", {
            symbol: this.config.symbol,
            side,
            price,
            status: res.status,
            response: data,
          });
          return null;
        }
        const orderId = data?.orderId;
        if (!orderId) return null;
        const fullyFilled = Number(data.executedQty) >= quantity;
        return { orderId, fullyFilled };
      } catch (err) {
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 500));
          continue;
        }
        logger.error("mm.place_order_failed", {
          symbol: this.config.symbol,
          side,
          price,
          error: err instanceof Error ? err.message : err,
        });
        return null;
      }
    }
    return null;
  }

  private async cancelOrder(orderId: string): Promise<void> {
    try {
      const res = await fetch(`${API_URL}/order`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, market: this.config.symbol }),
      });
      if (!res.ok) {
        logger.error("mm.cancel_order_rejected", {
          symbol: this.config.symbol,
          orderId,
          status: res.status,
        });
      }
    } catch (err) {
      logger.error("mm.cancel_order_failed", {
        symbol: this.config.symbol,
        orderId,
        error: err instanceof Error ? err.message : err,
      });
    }
  }

  async cancelAllOrders(): Promise<void> {
    await Promise.all(
      this.activeOrders.map((o) => this.cancelOrder(o.orderId)),
    );
    this.activeOrders = [];
  }

  private async placeQuotes(): Promise<void> {
    const { levels, spread } = this.config;
    const half = spread / 2;

    // Skew quotes to shed inventory: if long, lower bids & asks to encourage sells
    const inventorySkew = -this.netPosition * spread * 0.1;

    const promises: Promise<void>[] = [];

    for (let i = 0; i < levels; i++) {
      const bidPrice = +(
        this.fairPrice -
        half -
        i * spread +
        inventorySkew
      ).toFixed(2);
      const askPrice = +(
        this.fairPrice +
        half +
        i * spread +
        inventorySkew
      ).toFixed(2);

      const sizeMultiplier = 1 + i * 0.3;
      const bidQty = Math.round(this.randomQty() * sizeMultiplier);
      const askQty = Math.round(this.randomQty() * sizeMultiplier);

      if (bidPrice > 0) {
        promises.push(
          this.placeOrder("buy", bidPrice, bidQty, MM_USER).then((result) => {
            if (result && !result.fullyFilled)
              this.activeOrders.push({
                orderId: result.orderId,
                side: "buy",
                price: bidPrice,
              });
          }),
        );
      }

      promises.push(
        this.placeOrder("sell", askPrice, askQty, MM_USER).then((result) => {
          if (result && !result.fullyFilled)
            this.activeOrders.push({
              orderId: result.orderId,
              side: "sell",
              price: askPrice,
            });
        }),
      );
    }

    await Promise.all(promises);
  }

  private async generateTrade(): Promise<void> {
    // Trade direction follows momentum + randomness
    const buyProb =
      this.config.trend * 0.6 +
      (this.momentum > 0 ? 0.15 : -0.15) +
      Math.random() * 0.25;
    const side: "buy" | "sell" = buyProb > 0.5 ? "buy" : "sell";

    const qty = this.randomQty();
    const aggressivePrice =
      side === "buy"
        ? +(this.fairPrice + this.config.spread * 3).toFixed(2)
        : +Math.max(0.01, this.fairPrice - this.config.spread * 3).toFixed(2);

    // Use rotating trader IDs so it looks like different people trading
    const traderId = `trader-${String.fromCharCode(65 + (this.tickCount % 26))}${this.tickCount % 100}`;

    const result = await this.placeOrder(side, aggressivePrice, qty, traderId);
    if (result) {
      // Track net position from MM-generated trades
      this.netPosition += side === "buy" ? qty : -qty;
    }
  }

  async tick(): Promise<void> {
    this.tickCount++;
    this.updateFairPrice();

    if (this.tickCount % 2 === 0) {
      await this.cancelAllOrders();
      await this.placeQuotes();
    }

    if (Math.random() < 0.9) {
      await this.generateTrade();
    }
    if (Math.random() < 0.4) {
      await this.generateTrade();
    }

    if (this.tickCount % 20 === 0) {
      logger.info("mm.tick", {
        symbol: this.config.symbol,
        tick: this.tickCount,
        fairPrice: this.fairPrice.toFixed(2),
        drift: this.lastDrift.toFixed(2),
        orders: this.activeOrders.length,
      });
    }
  }

  async seed(): Promise<void> {
    await this.placeQuotes();
    logger.info("mm.seed", {
      symbol: this.config.symbol,
      orders: this.activeOrders.length,
      fairPrice: this.fairPrice,
    });
  }

  getSymbol(): string {
    return this.config.symbol;
  }
}
