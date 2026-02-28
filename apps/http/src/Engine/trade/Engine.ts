import {
  CANCEL_ORDER,
  CREATE_ORDER,
  GET_DEPTH,
  GET_KLINE,
  GET_TICKER,
} from "../../types/orders";
import { RedisManager } from "../RedisManager";
import {
  DepthData,
  MarketStats,
  ResponseFromHTTP,
  TickerData,
  TradeData,
  TradeHistoryEntry,
} from "../types/responses";
import {
  BASE_CURRENCY,
  Fill,
  Order,
  UserBalance,
  userId,
} from "../types/trading";
import { randomUUID } from "node:crypto";
import { BASE_ASSETS, MARKETS } from "../config/markets";
import { KlineManager } from "./KlineManager";
import { OrderBook } from "./OrderBook";
import { logger } from "../../utils/logger.js";

export class Engine {
  private orderBooks: OrderBook[] = [];
  private balances: Map<userId, UserBalance> = new Map();
  private tradeHistory: Map<string, TradeHistoryEntry[]> = new Map();
  private marketStats: Map<string, MarketStats> = new Map();
  private klineManager: KlineManager;
  private latestTickers: Record<string, any> = {};
  constructor() {
    logger.info("engine.initializing");
    this.orderBooks = MARKETS.map(
      (m) => new OrderBook(m.symbol, [], [], 0, m.initialPrice),
    );
    this.initializeMarketStats();
    this.klineManager = new KlineManager();
    logger.info("engine.initialized", {
      markets: this.orderBooks.map((ob) => ob.getMarketPair()),
    });
  }

  private initializeMarketStats() {
    logger.info("engine.initializing_market_stats");
    const markets = this.orderBooks.map((ob) => ob.getMarketPair());

    markets.forEach((market) => {
      this.tradeHistory.set(market, []);
      this.marketStats.set(market, {
        open24h: 0,
        high24h: 0,
        low24h: 0,
        volume24h: 0,
        quoteVolume24h: 0,
        lastPrice: 0,
      });
    });
  }

  private cleanOldTrades(market: string): void {
    const history = this.tradeHistory.get(market);
    if (!history) return;

    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    const filteredHistory = history.filter(
      (trade) => trade.timestamp > twentyFourHoursAgo,
    );

    this.tradeHistory.set(market, filteredHistory);
    logger.info("engine.old_trades_cleaned", {
      market,
      remaining: filteredHistory.length,
    });
  }

  private calculate24hStats(market: string): MarketStats {
    const history = this.tradeHistory.get(market) || [];
    const currentStats = this.marketStats.get(market);

    if (history.length === 0) {
      return (
        currentStats || {
          open24h: 0,
          high24h: 0,
          low24h: 0,
          volume24h: 0,
          quoteVolume24h: 0,
          lastPrice: 0,
        }
      );
    }

    const open24h =
      currentStats?.open24h && currentStats.open24h !== 0
        ? currentStats.open24h
        : 0;

    const high24h = Math.max(...history.map((t) => t.price));
    const low24h = Math.min(...history.map((t) => t.price));
    const volume24h = history.reduce((sum, t) => sum + t.quantity, 0);
    const quoteVolume24h = history.reduce(
      (sum, t) => sum + t.price * t.quantity,
      0,
    );
    const lastPrice = history[history.length - 1]?.price || 0;

    const updatedStats = {
      open24h,
      high24h,
      low24h,
      volume24h,
      quoteVolume24h,
      lastPrice,
    };

    this.marketStats.set(market, updatedStats);

    return updatedStats;
  }

  private updateMarketStats(market: string, fills: Fill[]): void {
    const history = this.tradeHistory.get(market) || [];

    fills.forEach((fill) => {
      const price = Number(fill.price);
      const quantity = fill.qty;

      history.push({
        price,
        quantity,
        timestamp: Date.now(),
      });
    });

    this.tradeHistory.set(market, history);
    if (history.length % 100 === 0) {
      this.cleanOldTrades(market);
    }

    const stats = this.calculate24hStats(market);
    this.marketStats.set(market, stats);

    logger.info("engine.stats_updated", {
      market,
      lastPrice: stats.lastPrice,
      high24h: stats.high24h,
      low24h: stats.low24h,
    });
  }

  private getEnhancedTicker(market: string, side: "buy" | "sell"): any {
    const stats = this.marketStats.get(market);

    if (!stats || stats.lastPrice === 0) {
      return {
        event: "ticker",
        symbol: market,
        price: "0",
        quantity: "0",
        side: side,
        priceChange: "0",
        priceChangePercent: "0.00",
        high24h: "0",
        low24h: "0",
        volume24h: "0",
        quoteVolume24h: "0",
        timestamp: Date.now(),
      };
    }

    const priceChange = stats.lastPrice - stats.open24h;
    const priceChangePercent =
      stats.open24h && stats.open24h !== 0
        ? ((priceChange / stats.open24h) * 100).toFixed(2)
        : "0.00";

    return {
      event: "ticker",
      symbol: market,
      price: stats.lastPrice.toString(),
      quantity: "0",
      side: side,
      priceChange: priceChange.toString(),
      priceChangePercent: priceChangePercent,
      high24h: stats.high24h.toString(),
      low24h: stats.low24h.toString(),
      volume24h: stats.volume24h.toString(),
      quoteVolume24h: stats.quoteVolume24h.toString(),
      timestamp: Date.now(),
    };
  }

  private updateBalancesAfterTrade(
    userId: string,
    fills: Fill[],
    side: "buy" | "sell",
    baseAsset: string,
    quoteAsset: string,
  ) {
    logger.info("engine.updating_balances", {
      userId,
      fillCount: fills.length,
      side,
    });
    const userBalance = this.balances.get(userId);

    if (!userBalance) {
      logger.error("engine.user_balance_not_found", { userId });
      return;
    }

    fills.forEach((fill) => {
      const tradeValue = fill.qty * Number(fill.price);
      const otherUserId = fill.otherUserId;
      const otherUserBalance = this.balances.get(otherUserId);

      if (!otherUserBalance) {
        logger.error("engine.other_user_balance_not_found", { otherUserId });
        return;
      }

      if (
        !userBalance[baseAsset] ||
        !userBalance[quoteAsset] ||
        !otherUserBalance[baseAsset] ||
        !otherUserBalance[quoteAsset]
      ) {
        logger.error("engine.missing_asset_balances");
        return;
      }

      if (side === "buy") {
        // Buyer (taker) receives base asset, releases locked quote asset
        userBalance[baseAsset].available += fill.qty;
        userBalance[quoteAsset].locked -= tradeValue;

        // Seller (maker) receives quote asset, releases locked base asset
        otherUserBalance[quoteAsset].available += tradeValue;
        otherUserBalance[baseAsset].locked -= fill.qty;
      } else {
        // Seller (taker) receives quote asset, releases locked base asset
        userBalance[quoteAsset].available += tradeValue;
        userBalance[baseAsset].locked -= fill.qty;

        // Buyer (maker) receives base asset, releases locked quote asset
        otherUserBalance[baseAsset].available += fill.qty;
        otherUserBalance[quoteAsset].locked -= tradeValue;
      }
    });
    logger.info("engine.balance_update_complete", { userId });
  }

  private createOrder(
    market: string,
    price: number,
    quantity: number,
    side: "buy" | "sell",
    userId: string,
  ) {
    logger.info("engine.creating_order", {
      side,
      quantity,
      price,
      market,
      userId,
    });
    const orderbook = this.orderBooks.find((x) => x.getMarketPair() === market);
    if (!orderbook) {
      logger.error("engine.orderbook_not_found", { market });
      return;
    }

    const order: Order = {
      price: price,
      quantity: quantity,
      orderId: randomUUID(),
      filled: 0,
      side,
      userId,
    };
    logger.info("engine.order_created", { orderId: order.orderId });
    const orderListed = orderbook.addOrder(order);
    const { executedQty, fills } = orderListed;
    logger.info("engine.order_executed", {
      executedQty,
      fillCount: fills.length,
    });

    const baseAsset = market.split("_")[0];
    const quoteAsset = market.split("_")[1];

    if (baseAsset && quoteAsset) {
      this.updateBalancesAfterTrade(userId, fills, side, baseAsset, quoteAsset);
    }

    const affectedPrices = new Set(fills.map((f) => f.price));
    affectedPrices.forEach((price) => {
      this.UpdatedDepth(price, market);
    });

    if (executedQty < order.quantity) {
      this.UpdatedDepth(order.price.toString(), market);
    }
    if (fills.length > 0) {
      this.publishTrades(fills, market, side);
    }

    return { executedQty, fills, orderId: order.orderId };
  }

  private publishTrades(fills: Fill[], market: string, side: "buy" | "sell") {
    logger.info("engine.publishing_trades", {
      market,
      fillCount: fills.length,
    });
    fills.forEach((fill) => {
      const tradeData: TradeData = {
        event: "trade",
        tradeId: fill.tradeId,
        price: fill.price,
        quantity: fill.qty.toString(),
        symbol: market,
        side: side,
        timestamp: Date.now(),
      };

      RedisManager.getInstance().Publish(`trade@${market}`, {
        stream: `trade@${market}`,
        data: tradeData,
      });
    });

    fills.forEach((fill) => {
      const price = Number(fill.price);
      const quantity = fill.qty;
      const timestamp = Date.now();

      const intervals = ["1m", "5m", "15m", "1h", "4h", "1d"];

      intervals.forEach((interval) => {
        try {
          const { kline, newCandleInitiated } = this.klineManager.updateKline(
            market,
            interval,
            price,
            quantity,
            timestamp,
          );

          const klineData = {
            event: "kline",
            symbol: market,
            interval: interval,
            kline: {
              timestamp: kline.openTime,
              open: kline.open,
              high: kline.high,
              low: kline.low,
              close: kline.close,
              volume: kline.volume,
              trades: kline.trades,
              isClosed: kline.isClosed,
              newCandleInitiated: newCandleInitiated,
            },
          };

          RedisManager.getInstance().Publish(`kline@${market}@${interval}`, {
            stream: `kline@${market}@${interval}`,
            data: klineData,
          });

          if (newCandleInitiated) {
            logger.info("engine.new_candle", { market, interval });
          }
        } catch (error) {
          logger.error("engine.kline_update_failed", {
            market,
            interval,
            error,
          });
        }
      });
    });

    this.updateMarketStats(market, fills);

    const stats = this.marketStats.get(market);
    if (!stats) return;

    const priceGroups = new Map<string, number>();
    fills.forEach((fill) => {
      const currentQty = priceGroups.get(fill.price) || 0;
      priceGroups.set(fill.price, currentQty + fill.qty);
    });

    priceGroups.forEach((totalQty, price) => {
      const priceChange = Number(price) - stats.open24h;
      const priceChangePercent =
        stats.open24h && stats.open24h !== 0
          ? ((priceChange / stats.open24h) * 100).toFixed(2)
          : "0.00";

      const enhancedTickerData = {
        event: "ticker",
        symbol: market,
        price: price,
        quantity: totalQty.toString(),
        side: side,
        priceChange: priceChange.toString(),
        priceChangePercent: priceChangePercent,
        high24h: stats.high24h.toString(),
        low24h: stats.low24h.toString(),
        volume24h: stats.volume24h.toString(),
        quoteVolume24h: stats.quoteVolume24h.toString(),
        timestamp: Date.now(),
      };

      RedisManager.getInstance().Publish(`ticker@${market}`, {
        stream: `ticker@${market}`,
        data: enhancedTickerData,
      });
    });

    if (fills.length > 0) {
      const lastFill = fills[fills.length - 1];
      if (!lastFill) return;

      const priceChange = Number(lastFill.price) - stats.open24h;
      const priceChangePercent =
        stats.open24h && stats.open24h !== 0
          ? ((priceChange / stats.open24h) * 100).toFixed(2)
          : "0.00";

      this.latestTickers[market] = {
        event: "ticker",
        symbol: market,
        price: lastFill.price,
        quantity: lastFill.qty.toString(),
        side: side,
        priceChange: priceChange.toString(),
        priceChangePercent: priceChangePercent,
        high24h: stats.high24h.toString(),
        low24h: stats.low24h.toString(),
        volume24h: stats.volume24h.toString(),
        quoteVolume24h: stats.quoteVolume24h.toString(),
        timestamp: Date.now(),
      };
      logger.info("engine.ticker_updated", {
        market,
        price: lastFill.price,
        priceChange,
      });
    }
  }

  private defaultBalances(userId: string) {
    if (!userId) {
      return;
    }
    if (!this.balances.has(userId)) {
      logger.info("engine.default_balance_init", { userId });
      const defaultBalance: UserBalance = {
        [BASE_CURRENCY]: { available: 100000, locked: 0 },
      };
      BASE_ASSETS.forEach((asset) => {
        defaultBalance[asset] = { available: 1000, locked: 0 };
      });
      this.balances.set(userId, defaultBalance);
      logger.info("engine.default_balance_set", {
        userId,
        baseCurrency: BASE_CURRENCY,
        amount: 100000,
      });
    }
  }

  private checkAndLockFunds(
    userId: string,
    side: "buy" | "sell",
    quoteAsset: string,
    baseAsset: string,
    price: number,
    quantity: number,
  ) {
    logger.info("engine.checking_funds", { side, quantity, price });
    const userBalance = this.balances.get(userId);

    if (!userBalance) {
      logger.error("engine.no_balance_initialized", { userId });
      throw new Error(`User ${userId} has no balance initialized`);
    }

    if (side === "buy") {
      if (!userBalance[quoteAsset]) {
        logger.error("engine.no_asset_balance", { userId, asset: quoteAsset });
        throw new Error(
          `User ${userId} has no ${quoteAsset} balance. Cannot buy.`,
        );
      }
      const required = price * quantity;
      if (userBalance[quoteAsset].available < required) {
        logger.error("engine.insufficient_funds", {
          asset: quoteAsset,
          required,
          available: userBalance[quoteAsset].available,
        });
        throw new Error(
          `Insufficient ${quoteAsset}. Required: ${required}, Available: ${userBalance[quoteAsset].available}`,
        );
      }
      userBalance[quoteAsset].available -= required;
      userBalance[quoteAsset].locked += required;
      logger.info("engine.funds_locked", {
        amount: required,
        asset: quoteAsset,
        side: "buy",
      });
      return;
    }
    if (side === "sell") {
      const available = userBalance[baseAsset]?.available || 0;
      if (available < quantity) {
        logger.error("engine.insufficient_funds", {
          asset: baseAsset,
          required: quantity,
          available,
        });
        throw new Error("Insufficient base asset");
      }
      if (userBalance[baseAsset]) {
        userBalance[baseAsset].available -= quantity;
        userBalance[baseAsset].locked += quantity;
        logger.info("engine.funds_locked", {
          amount: quantity,
          asset: baseAsset,
          side: "sell",
        });
      }
    }
  }

  private UpdatedDepth(price: string, market: string) {
    logger.info("engine.updating_depth", { market, price });
    const orderbook = this.orderBooks.find((x) => x.getMarketPair() === market);
    if (!orderbook) {
      logger.error("engine.orderbook_not_found", { market });
      return;
    }

    const depth = orderbook.getDepth();
    if (!depth) {
      logger.error("engine.depth_not_available", { market });
      return;
    }

    const depthData: DepthData = {
      event: "depth",
      symbol: market,
      bids: depth.aggregatedBids,
      asks: depth.aggregatedAsks,
      timestamp: Date.now(),
    };

    RedisManager.getInstance().Publish(`depth@${market}`, {
      stream: `depth@${market}`,
      data: depthData,
    });

    logger.info("engine.depth_published", {
      market,
      bidLevels: depth.aggregatedBids.length,
      askLevels: depth.aggregatedAsks.length,
    });
  }

  async process({
    message,
    clientId,
  }: {
    message: ResponseFromHTTP;
    clientId: string;
  }) {
    logger.info("engine.processing", { type: message.type, clientId });
    switch (message.type) {
      case CREATE_ORDER:
        logger.info("engine.create_order_received", { data: message.data });
        let lockedAmount = 0;
        let lockedAsset = "";
        try {
          this.defaultBalances(message.data.userId);
          const baseAsset = message.data.market.split("_")[0];
          const quoteAsset = message.data.market.split("_")[1];
          const numprice = Number(message.data.price);
          const numquantity = Number(message.data.quantity);

          if (isNaN(numprice) || numprice <= 0)
            throw new Error("Invalid price");
          if (isNaN(numquantity) || numquantity <= 0)
            throw new Error("Invalid quantity");
          if (!baseAsset || !quoteAsset) {
            throw new Error("Invalid market format");
          }

          if (message.data.side === "buy") {
            lockedAmount = numprice * numquantity;
            lockedAsset = quoteAsset;
          } else {
            lockedAmount = numquantity;
            lockedAsset = baseAsset;
          }

          this.checkAndLockFunds(
            message.data.userId,
            message.data.side,
            quoteAsset,
            baseAsset,
            numprice,
            numquantity,
          );

          const createorder = this.createOrder(
            message.data.market,
            numprice,
            numquantity,
            message.data.side,
            message.data.userId,
          );

          if (!createorder) {
            throw new Error("Order creation failed — market not found");
          }
          const { executedQty, fills, orderId } = createorder;
          logger.info("engine.order_placed", {
            orderId,
            executedQty,
            fillCount: fills.length,
          });
          RedisManager.getInstance().ResponseToHTTP(clientId, {
            type: "ORDER_PLACED",
            payload: { orderId, executedQty, fills },
          });
        } catch (e) {
          logger.error("engine.create_order_failed", { error: e });
          if (lockedAsset && message.data) {
            const userBalance = this.balances.get(message.data.userId);
            const assetBalance = userBalance?.[lockedAsset];

            if (assetBalance) {
              assetBalance.available += lockedAmount;
              assetBalance.locked -= lockedAmount;
              logger.info("engine.funds_rolled_back", {
                amount: lockedAmount,
                asset: lockedAsset,
              });
            } else {
              logger.error("engine.rollback_failed", {
                reason: "balance not found",
              });
            }
          }
          RedisManager.getInstance().ResponseToHTTP(clientId, {
            type: "ORDER_CANCELLED",
            payload: {
              orderId: "",
              executedQty: 0,
              remainingQty: 0,
            },
          });
        }
        break;
      case CANCEL_ORDER:
        logger.info("engine.cancel_order_received", { data: message.data });
        try {
          const orderId = message.data.orderId;
          const cancelMarket = message.data.market;
          const baseAsset = cancelMarket.split("_")[0];
          const quoteAsset = cancelMarket.split("_")[1];
          const cancelOrderbook = this.orderBooks.find(
            (x) => x.getMarketPair() === cancelMarket,
          );

          if (!cancelOrderbook) {
            throw new Error("No orderbook found");
          }

          if (!baseAsset || !quoteAsset) {
            throw new Error("Invalid market format");
          }
          const order =
            cancelOrderbook.asks.find((x) => x.orderId === orderId) ||
            cancelOrderbook.bids.find((x) => x.orderId === orderId);
          if (!order) {
            throw new Error("No order found");
          }

          const userBalance = this.balances.get(order.userId);
          if (!userBalance) {
            throw new Error("User balance not found");
          }

          if (order.side === "buy") {
            if (!userBalance[quoteAsset]) {
              throw new Error(`User balance for ${quoteAsset} not found`);
            }
            const price = cancelOrderbook.cancelBid(order);
            const leftQuantity = (order.quantity - order.filled) * order.price;

            userBalance[quoteAsset].available += leftQuantity;
            userBalance[quoteAsset].locked -= leftQuantity;
            logger.info("engine.funds_unlocked", {
              amount: leftQuantity,
              asset: quoteAsset,
              side: "buy",
            });

            if (price) {
              this.UpdatedDepth(price.toString(), cancelMarket);
            }
          } else {
            if (!userBalance[baseAsset]) {
              throw new Error(`User balance for ${baseAsset} not found`);
            }

            const price = cancelOrderbook.cancelAsk(order);
            const leftQuantity = order.quantity - order.filled;

            userBalance[baseAsset].available += leftQuantity;
            userBalance[baseAsset].locked -= leftQuantity;
            logger.info("engine.funds_unlocked", {
              amount: leftQuantity,
              asset: baseAsset,
              side: "sell",
            });

            if (price) {
              this.UpdatedDepth(price.toString(), cancelMarket);
            }
          }
          logger.info("engine.order_cancelled", { orderId });
          RedisManager.getInstance().ResponseToHTTP(clientId, {
            type: "ORDER_CANCELLED",
            payload: {
              orderId,
              executedQty: 0,
              remainingQty: 0,
            },
          });
        } catch (e) {
          logger.error("engine.cancel_order_failed", { error: e });
          RedisManager.getInstance().ResponseToHTTP(clientId, {
            type: "ORDER_CANCELLED",
            payload: {
              orderId: message.data.orderId,
              executedQty: 0,
              remainingQty: 0,
            },
          });
        }
        break;
      case GET_DEPTH:
        logger.info("engine.get_depth_received", {
          market: message.data.market,
        });
        try {
          const market = message.data.market;
          const orderbook = this.orderBooks.find(
            (x) => x.getMarketPair() === market,
          );
          if (!orderbook) {
            throw new Error("No orderbook found");
          }
          const depth = orderbook.getDepth();

          const depthResponse: DepthData = {
            event: "depth",
            symbol: market,
            bids: depth.aggregatedBids,
            asks: depth.aggregatedAsks,
            timestamp: Date.now(),
          };

          logger.info("engine.depth_response", {
            market,
            bidCount: depth?.aggregatedBids?.length,
            askCount: depth?.aggregatedAsks?.length,
          });
          RedisManager.getInstance().ResponseToHTTP(clientId, {
            type: "DEPTH",
            payload: depthResponse,
          });
        } catch (e) {
          logger.error("engine.get_depth_failed", { error: e });
          RedisManager.getInstance().ResponseToHTTP(clientId, {
            type: "DEPTH",
            payload: {
              event: "depth" as const,
              symbol: message.data.market,
              bids: [],
              asks: [],
              timestamp: Date.now(),
            },
          });
        }
        break;
      case GET_TICKER:
        logger.info("engine.get_ticker_received", {
          market: message.data.market,
        });
        try {
          const market = message.data.market;
          const lastTicker = this.latestTickers?.[market];

          if (!lastTicker) {
            const enhancedTicker = this.getEnhancedTicker(market, "buy");
            logger.info("engine.ticker_generated", { market });
            RedisManager.getInstance().ResponseToHTTP(clientId, {
              type: "TICKER",
              payload: enhancedTicker,
            });
          } else {
            logger.info("engine.ticker_response", {
              market,
              price: lastTicker.price,
              priceChange: lastTicker.priceChange,
            });
            RedisManager.getInstance().ResponseToHTTP(clientId, {
              type: "TICKER",
              payload: lastTicker,
            });
          }
        } catch (e) {
          logger.error("engine.get_ticker_failed", { error: e });
          const fallbackTicker = this.getEnhancedTicker(
            message.data.market,
            "buy",
          );
          RedisManager.getInstance().ResponseToHTTP(clientId, {
            type: "TICKER",
            payload: fallbackTicker,
          });
        }
        break;
      case GET_KLINE:
        logger.info("engine.get_kline_received", {
          market: message.data.market,
        });
        try {
          const market = message.data.market;
          const interval = message.data.interval || "1m";
          const limit = message.data.limit || 500;

          const candles = this.klineManager.getKlineHistory(
            market,
            interval,
            limit,
          );

          const klineResponse = {
            symbol: market,
            interval: interval,
            candles: candles.map((k) => ({
              timestamp: k.openTime,
              closeTime: k.closeTime,
              open: k.open,
              high: k.high,
              low: k.low,
              close: k.close,
              volume: k.volume,
              trades: k.trades,
              isClosed: k.isClosed,
            })),
          };

          logger.info("engine.kline_response", {
            market,
            interval,
            candleCount: candles.length,
          });
          RedisManager.getInstance().ResponseToHTTP(clientId, {
            type: "KLINE",
            payload: klineResponse,
          });
        } catch (e) {
          logger.error("engine.get_kline_failed", { error: e });
          RedisManager.getInstance().ResponseToHTTP(clientId, {
            type: "KLINE",
            payload: {
              symbol: message.data.market,
              interval: message.data.interval || "1m",
              candles: [],
            },
          });
        }
        break;

      default:
        logger.warn("engine.unknown_message_type", {
          type: (message as any).type,
        });
    }
  }

  public getDepthDirect(market: string): DepthData {
    const orderbook = this.orderBooks.find((x) => x.getMarketPair() === market);
    if (!orderbook) {
      return {
        event: "depth",
        symbol: market,
        bids: [],
        asks: [],
        timestamp: Date.now(),
      };
    }
    const depth = orderbook.getDepth();
    return {
      event: "depth",
      symbol: market,
      bids: depth.aggregatedBids,
      asks: depth.aggregatedAsks,
      timestamp: Date.now(),
    };
  }

  public getTickerDirect(market: string): TickerData {
    const lastTicker = this.latestTickers?.[market];
    if (lastTicker) return lastTicker;
    return this.getEnhancedTicker(market, "buy");
  }

  public getKlineDirect(
    market: string,
    interval: string = "1m",
    limit: number = 500,
  ) {
    const candles = this.klineManager.getKlineHistory(market, interval, limit);
    return {
      symbol: market,
      interval,
      candles: candles.map((k) => ({
        timestamp: k.openTime,
        closeTime: k.closeTime,
        open: k.open,
        high: k.high,
        low: k.low,
        close: k.close,
        volume: k.volume,
        trades: k.trades,
        isClosed: k.isClosed,
      })),
    };
  }
}
