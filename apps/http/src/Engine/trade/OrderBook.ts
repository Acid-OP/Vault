import { BASE_CURRENCY, Fill, Order } from "../types/trading";
import { logger } from "../../utils/logger.js";

export class OrderBook {
  bids: Order[];
  asks: Order[];
  baseAsset: string;
  quoteAsset: string = BASE_CURRENCY;
  lastTradeId: number;
  currentPrice: number;
  constructor(
    baseAsset: string,
    bids: Order[],
    asks: Order[],
    lastTradeId: number,
    currentPrice: number,
  ) {
    logger.info("orderbook.initializing", { baseAsset });
    const parts = baseAsset.split("_");
    this.baseAsset = parts[0] || baseAsset;
    this.quoteAsset = parts[1] || "USD";
    this.bids = bids;
    this.asks = asks;
    this.lastTradeId = lastTradeId || 0;
    this.currentPrice = currentPrice || 0;
    logger.info("orderbook.initialized", {
      market: this.getMarketPair(),
      lastTradeId: this.lastTradeId,
      currentPrice: this.currentPrice,
    });
  }

  getMarketPair() {
    return `${this.baseAsset}_${this.quoteAsset}`;
  }
  // Binary search insert: O(log n) find + O(n) splice, vs O(n log n) full sort
  private insertSorted(
    arr: Order[],
    order: Order,
    comparator: (a: Order, b: Order) => number,
  ) {
    let low = 0;
    let high = arr.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (comparator(arr[mid]!, order) < 0) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    arr.splice(low, 0, order);
  }

  private insertBid(order: Order) {
    // Bids: highest price first (descending)
    this.insertSorted(this.bids, order, (a, b) => b.price - a.price);
  }

  private insertAsk(order: Order) {
    // Asks: lowest price first (ascending)
    this.insertSorted(this.asks, order, (a, b) => a.price - b.price);
  }
  private matchBid(order: Order) {
    logger.info("orderbook.matching_bid", {
      orderId: order.orderId,
      price: order.price,
      quantity: order.quantity,
    });
    // Asks are already sorted ascending (lowest first)
    const fills: Fill[] = [];
    let executedQty = 0;

    for (let i = 0; i < this.asks.length; i++) {
      const ask = this.asks[i];
      if (!ask) continue;
      if (ask.userId === order.userId) {
        logger.info("orderbook.skipping_self_match", { orderId: ask.orderId });
        continue;
      }
      if (ask.price <= order.price && executedQty < order.quantity) {
        const filledQty = Math.min(
          order.quantity - executedQty,
          ask.quantity - ask.filled,
        );
        executedQty += filledQty;
        ask.filled += filledQty;
        fills.push({
          price: ask.price.toString(),
          qty: filledQty,
          tradeId: this.lastTradeId++,
          otherUserId: ask.userId,
          makerOrderId: ask.orderId,
        });
        logger.info("orderbook.fill", {
          quantity: filledQty,
          price: ask.price,
          tradeId: this.lastTradeId - 1,
        });
      }
      if (ask.filled === ask.quantity) {
        this.asks.splice(i, 1);
        i--;
      }
    }
    logger.info("orderbook.bid_match_complete", {
      executedQty,
      fillCount: fills.length,
    });
    return { fills, executedQty };
  }

  matchAsk(order: Order) {
    logger.info("orderbook.matching_ask", {
      orderId: order.orderId,
      price: order.price,
      quantity: order.quantity,
    });
    // Bids are already sorted descending (highest first)
    const fills: Fill[] = [];
    let executedQty = 0;

    for (let i = 0; i < this.bids.length; i++) {
      const bid = this.bids[i];
      if (!bid) continue;
      if (bid.userId === order.userId) {
        logger.info("orderbook.skipping_self_match", { orderId: bid.orderId });
        continue;
      }
      if (bid.price >= order.price && executedQty < order.quantity) {
        const amountRemaining = Math.min(
          order.quantity - executedQty,
          bid.quantity - bid.filled,
        );
        executedQty += amountRemaining;
        bid.filled += amountRemaining;

        fills.push({
          price: bid.price.toString(),
          qty: amountRemaining,
          tradeId: this.lastTradeId++,
          otherUserId: bid.userId,
          makerOrderId: bid.orderId,
        });
        logger.info("orderbook.fill", {
          quantity: amountRemaining,
          price: bid.price,
          tradeId: this.lastTradeId - 1,
        });
      }
      if (bid && bid.filled === bid.quantity) {
        this.bids.splice(i, 1);
        i--;
      }
    }
    logger.info("orderbook.ask_match_complete", {
      executedQty,
      fillCount: fills.length,
    });
    return { executedQty, fills };
  }

  getDepth(limit: number = 20) {
    const aggregatedBids: [string, string][] = [];
    const aggregatedAsks: [string, string][] = [];

    const bidLevels: Record<string, number> = {};
    const askLevels: Record<string, number> = {};

    for (let i = 0; i < this.bids.length; i++) {
      const order = this.bids[i];
      if (order && typeof order.price === "number") {
        const pricekey = order.price.toString();
        const availableQty = order.quantity - (order.filled || 0);
        bidLevels[pricekey] = (bidLevels[pricekey] ?? 0) + availableQty;
      }
    }

    for (let i = 0; i < this.asks.length; i++) {
      const order = this.asks[i];
      if (order && typeof order.price === "number") {
        const pricekey = order.price.toString();
        const availableQty = order.quantity - (order.filled || 0);
        askLevels[pricekey] = (askLevels[pricekey] ?? 0) + availableQty;
      }
    }

    for (const price in bidLevels) {
      if (bidLevels[price]) {
        aggregatedBids.push([price, bidLevels[price].toString()]);
      }
    }

    for (const price in askLevels) {
      if (askLevels[price]) {
        aggregatedAsks.push([price, askLevels[price].toString()]);
      }
    }

    aggregatedBids.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
    aggregatedAsks.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));

    logger.info("orderbook.depth_calculated", {
      bidLevels: aggregatedBids.length,
      askLevels: aggregatedAsks.length,
    });

    return {
      aggregatedBids: aggregatedBids.slice(0, limit),
      aggregatedAsks: aggregatedAsks.slice(0, limit),
    };
  }
  cancelBid(order: Order) {
    logger.info("orderbook.cancelling_bid", { orderId: order.orderId });
    const index = this.bids.findIndex((g) => g.orderId === order.orderId);
    if (index !== -1) {
      if (this.bids && this.bids[index]) {
        const price = this.bids[index].price;
        this.bids.splice(index, 1);
        logger.info("orderbook.bid_cancelled", { price });
        return price;
      }
    }
    logger.info("orderbook.bid_not_found", { orderId: order.orderId });
    return null;
  }

  cancelAsk(order: Order) {
    logger.info("orderbook.cancelling_ask", { orderId: order.orderId });
    const index = this.asks.findIndex((g) => g.orderId === order.orderId);
    if (index !== -1) {
      if (this.asks && this.asks[index]) {
        const price = this.asks[index].price;
        this.asks.splice(index, 1);
        logger.info("orderbook.ask_cancelled", { price });
        return price;
      }
    }
    logger.info("orderbook.ask_not_found", { orderId: order.orderId });
    return null;
  }

  addOrder(order: Order) {
    logger.info("orderbook.adding_order", {
      side: order.side,
      orderId: order.orderId,
      price: order.price,
      quantity: order.quantity,
    });
    if (order.side === "buy") {
      const { executedQty, fills } = this.matchBid(order);
      order.filled = executedQty;

      if (executedQty === order.quantity) {
        logger.info("orderbook.buy_order_fully_filled");
        return {
          executedQty,
          fills,
        };
      }

      const remainingQty = order.quantity - executedQty;
      if (remainingQty > 0) {
        this.insertBid(order);
        logger.info("orderbook.buy_order_added", { remainingQty });
      }
      return {
        executedQty,
        fills,
      };
    } else {
      const { executedQty, fills } = this.matchAsk(order);
      order.filled = executedQty;
      if (executedQty === order.quantity) {
        logger.info("orderbook.sell_order_fully_filled");
        return {
          executedQty,
          fills,
        };
      }
      const remainingQty = order.quantity - executedQty;
      if (remainingQty > 0) {
        this.insertAsk(order);
        logger.info("orderbook.sell_order_added", { remainingQty });
      }
      return {
        executedQty,
        fills,
      };
    }
  }
}
