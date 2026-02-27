interface MarketConfig {
  symbol: string;
  basePrice: number;
  /** How much the fair price can drift per tick (e.g. 0.3 means ±0.3) */
  volatility: number;
  /** Number of price levels on each side of the book */
  levels: number;
  /** Spacing between each level in USD */
  spread: number;
  /** Base quantity per order (randomized ±50%) */
  baseQty: number;
}

interface ActiveOrder {
  orderId: string;
  side: "buy" | "sell";
  price: number;
}

const API_URL = process.env.API_URL || "http://localhost:3001";
const MM_USER_PREFIX = "mm-";

export class MarketMaker {
  private config: MarketConfig;
  private fairPrice: number;
  private activeOrders: ActiveOrder[] = [];
  private userId: string;
  private tickCount = 0;

  constructor(config: MarketConfig) {
    this.config = config;
    this.fairPrice = config.basePrice;
    this.userId = `${MM_USER_PREFIX}${config.symbol.toLowerCase()}`;
    console.log(
      `[MM:${config.symbol}] Initialized at fair price $${config.basePrice}`,
    );
  }

  /** Random walk: drift the fair price up or down */
  private updateFairPrice() {
    const { volatility } = this.config;
    const drift = (Math.random() - 0.48) * volatility * 2;
    this.fairPrice = Math.max(1, +(this.fairPrice + drift).toFixed(2));
  }

  private randomQty(): number {
    const base = this.config.baseQty;
    const variance = base * 0.5;
    return Math.max(1, Math.round(base + (Math.random() - 0.5) * 2 * variance));
  }

  private async placeOrder(
    side: "buy" | "sell",
    price: number,
    quantity: number,
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
          userId: this.userId,
        }),
      });
      const data = (await res.json()) as any;
      return data?.orderId || null;
    } catch {
      return null;
    }
  }

  private async cancelOrder(orderId: string): Promise<void> {
    try {
      await fetch(`${API_URL}/order`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          market: this.config.symbol,
        }),
      });
    } catch {
      /* ignore */
    }
  }

  /** Cancel all outstanding orders */
  private async cancelAll(): Promise<void> {
    const cancels = this.activeOrders.map((o) => this.cancelOrder(o.orderId));
    await Promise.allSettled(cancels);
    this.activeOrders = [];
  }

  /** Place layered bids and asks around the fair price */
  private async placeQuotes(): Promise<void> {
    const { levels, spread } = this.config;
    const halfSpread = spread / 2;

    const orders: Promise<void>[] = [];

    for (let i = 0; i < levels; i++) {
      const bidPrice = +(this.fairPrice - halfSpread - i * spread).toFixed(2);
      const askPrice = +(this.fairPrice + halfSpread + i * spread).toFixed(2);
      const bidQty = this.randomQty();
      const askQty = this.randomQty();

      if (bidPrice > 0) {
        orders.push(
          this.placeOrder("buy", bidPrice, bidQty).then((id) => {
            if (id)
              this.activeOrders.push({
                orderId: id,
                side: "buy",
                price: bidPrice,
              });
          }),
        );
      }
      orders.push(
        this.placeOrder("sell", askPrice, askQty).then((id) => {
          if (id)
            this.activeOrders.push({
              orderId: id,
              side: "sell",
              price: askPrice,
            });
        }),
      );
    }

    await Promise.allSettled(orders);
  }

  /** Occasionally cross the spread to generate a real trade */
  private async generateTrade(): Promise<void> {
    const side = Math.random() > 0.5 ? "buy" : "sell";
    const qty = Math.max(
      1,
      Math.round(
        this.config.baseQty * 0.3 + Math.random() * this.config.baseQty * 0.4,
      ),
    );
    const aggressivePrice =
      side === "buy"
        ? +(this.fairPrice + this.config.spread * 2).toFixed(2)
        : +Math.max(1, this.fairPrice - this.config.spread * 2).toFixed(2);

    const traderUser = `trader-${Date.now() % 10000}`;

    try {
      await fetch(`${API_URL}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          market: this.config.symbol,
          price: aggressivePrice.toFixed(2),
          quantity: qty.toString(),
          side,
          userId: traderUser,
        }),
      });
    } catch {
      /* ignore */
    }
  }

  /** Main tick: called every interval */
  async tick(): Promise<void> {
    this.tickCount++;
    this.updateFairPrice();

    // Every 3rd tick, cancel and requote
    if (this.tickCount % 3 === 0) {
      await this.cancelAll();
      await this.placeQuotes();
    }

    // Generate a trade on most ticks to keep candles flowing
    if (Math.random() < 0.7) {
      await this.generateTrade();
    }

    if (this.tickCount % 10 === 0) {
      console.log(
        `[MM:${this.config.symbol}] tick=${this.tickCount} fair=$${this.fairPrice.toFixed(2)} orders=${this.activeOrders.length}`,
      );
    }
  }

  /** Initial seeding: place first batch of quotes */
  async seed(): Promise<void> {
    console.log(`[MM:${this.config.symbol}] Seeding orderbook...`);
    await this.placeQuotes();
    console.log(
      `[MM:${this.config.symbol}] Seeded ${this.activeOrders.length} orders`,
    );
  }

  getSymbol(): string {
    return this.config.symbol;
  }

  getFairPrice(): number {
    return this.fairPrice;
  }
}
