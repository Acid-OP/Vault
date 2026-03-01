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
const MM_USER = "mm-liquidity";
const ORDER_DELAY_MS = Number(process.env.MM_ORDER_DELAY_MS) || 150;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class MarketMaker {
  private config: MarketConfig;
  private fairPrice: number;
  private activeOrders: ActiveOrder[] = [];
  private tickCount = 0;
  private lastDrift = 0;
  private momentum = 0;

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

    // Mean reversion: gentle pull back if price drifts too far from base (±30%)
    const deviation =
      (this.fairPrice - this.config.basePrice) / this.config.basePrice;
    if (Math.abs(deviation) > 0.3) {
      drift -= deviation * volatility * 0.5;
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
  ): Promise<string | null> {
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
      return data?.orderId || null;
    } catch (err) {
      logger.error("mm.place_order_failed", {
        symbol: this.config.symbol,
        side,
        price,
        error: err instanceof Error ? err.message : err,
      });
      return null;
    }
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

  private async cancelAll(): Promise<void> {
    for (const o of this.activeOrders) {
      await this.cancelOrder(o.orderId);
      await sleep(ORDER_DELAY_MS);
    }
    this.activeOrders = [];
  }

  private async placeQuotes(): Promise<void> {
    const { levels, spread } = this.config;
    const half = spread / 2;

    for (let i = 0; i < levels; i++) {
      const bidPrice = +(this.fairPrice - half - i * spread).toFixed(2);
      const askPrice = +(this.fairPrice + half + i * spread).toFixed(2);

      const sizeMultiplier = 1 + i * 0.3;
      const bidQty = Math.round(this.randomQty() * sizeMultiplier);
      const askQty = Math.round(this.randomQty() * sizeMultiplier);

      if (bidPrice > 0) {
        const id = await this.placeOrder("buy", bidPrice, bidQty, MM_USER);
        if (id)
          this.activeOrders.push({ orderId: id, side: "buy", price: bidPrice });
        await sleep(ORDER_DELAY_MS);
      }

      const id = await this.placeOrder("sell", askPrice, askQty, MM_USER);
      if (id)
        this.activeOrders.push({ orderId: id, side: "sell", price: askPrice });
      await sleep(ORDER_DELAY_MS);
    }
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

    await this.placeOrder(side, aggressivePrice, qty, traderId);
  }

  async tick(): Promise<void> {
    this.tickCount++;
    this.updateFairPrice();

    // Requote every 3 ticks
    if (this.tickCount % 3 === 0) {
      await this.cancelAll();
      await this.placeQuotes();
    }

    // Generate 1-2 trades per tick
    if (Math.random() < 0.75) {
      await this.generateTrade();
    }
    // Sometimes a second trade in the same tick for volume
    if (Math.random() < 0.2) {
      await this.generateTrade();
    }

    if (this.tickCount % 15 === 0) {
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
