// utils/SignalingManager.ts

export interface Ticker {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  high24h: string;
  low24h: string;
  volume24h: string;
  quoteVolume24h: string;
  lastQuantity: string;
  lastSide: "buy" | "sell";
  timestamp: number;
}

export interface DepthUpdate {
  symbol: string;
  bids: [string, string][];
  asks: [string, string][];
  buyPercentage?: number;
  timestamp: number;
}
export interface Trade {
  tradeId: number;
  symbol: string;
  price: string;
  quantity: string;
  side: "buy" | "sell";
  timestamp: number;
}

type MessageType = "ticker" | "depth" | "trade" | "kline";

interface Callback {
  id: string;
  callback: (data: any) => void;
}

export class SignalingManager {
  private ws!: WebSocket;
  private static instance: SignalingManager;
  private initialized: boolean = false;
  private callbacks: Record<MessageType, Callback[]> = {
    ticker: [],
    depth: [],
    trade: [],
    kline: [],
  };

  private depthCache: Record<string, DepthUpdate> = {};
  private tradeCache: Record<string, Trade[]> = {};
  private subscribedSymbols: Map<string, number> = new Map();
  private pendingSubscriptions: string[] = [];
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 20;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  private constructor() {
    this.connect();
  }

  private connect() {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3002";
    this.ws = new WebSocket(wsUrl);
    this.init();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new SignalingManager();
    }
    return this.instance;
  }

  private init() {
    this.ws.onopen = () => {
      console.log("WebSocket Connected");
      this.initialized = true;
      this.reconnectAttempts = 0;

      this.pendingSubscriptions.forEach((symbol) => {
        this.sendSubscribe(symbol);
      });
      this.pendingSubscriptions = [];

      this.pendingMessages.forEach((msg) => {
        this.ws.send(JSON.stringify(msg));
      });
      this.pendingMessages = [];
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("📩 Message received:", message);

      const type = message.type as MessageType;
      const data = message.data;

      if (!type || !data) {
        console.warn("⚠️ Invalid message format:", message);
        return;
      }

      const symbol = data.symbol;

      if (!symbol) {
        console.warn("⚠️ No symbol in message:", message);
        return;
      }
      console.log(`🎯 Processing ${type} for ${symbol}`);

      switch (type) {
        case "ticker":
          this.handleTickerUpdate(symbol, data);
          break;
        case "depth":
          this.handleDepthUpdate(symbol, data);
          break;
        case "trade":
          this.handleTradeUpdate(symbol, data);
          break;
        case "kline":
          this.handleKlineUpdate(data);
          break;
        default:
          console.warn("⚠️ Unknown message type:", type);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket Disconnected");
      this.initialized = false;
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("WebSocket max reconnect attempts reached");
      return;
    }
    if (this.reconnectTimer) return;

    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
    console.log(
      `WebSocket reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1})`,
    );

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectAttempts++;
      this.connect();

      // Re-subscribe to all active symbols once connected
      this.subscribedSymbols.forEach((_count, symbol) => {
        if (this.initialized) {
          this.sendSubscribe(symbol);
        } else {
          this.pendingSubscriptions.push(symbol);
        }
      });
    }, delay);
  }

  public subscribe(symbol: string) {
    const count = this.subscribedSymbols.get(symbol) || 0;
    this.subscribedSymbols.set(symbol, count + 1);

    // Only send the WS subscribe on the first consumer
    if (count > 0) return;

    if (this.initialized) {
      this.sendSubscribe(symbol);
    } else {
      this.pendingSubscriptions.push(symbol);
    }
  }

  private sendSubscribe(symbol: string) {
    const subscribeMessage = {
      method: "SUBSCRIBE",
      params: [`depth@${symbol}`, `trade@${symbol}`, `ticker@${symbol}`],
    };

    this.ws.send(JSON.stringify(subscribeMessage));
    console.log("📤 Subscription sent:", subscribeMessage);
  }

  public unsubscribe(symbol: string) {
    const count = this.subscribedSymbols.get(symbol) || 0;
    if (count <= 0) return;

    if (count === 1) {
      // Last consumer — actually unsubscribe from WS
      this.subscribedSymbols.delete(symbol);

      if (this.initialized) {
        const unsubscribeMessage = {
          method: "UNSUBSCRIBE",
          params: [`depth@${symbol}`, `trade@${symbol}`, `ticker@${symbol}`],
        };
        this.ws.send(JSON.stringify(unsubscribeMessage));
      }
    } else {
      this.subscribedSymbols.set(symbol, count - 1);
    }
  }

  private handleTickerUpdate(symbol: string, data: any) {
    const ticker: Ticker = {
      symbol: data.symbol,
      lastPrice: data.price,
      priceChange: data.priceChange,
      priceChangePercent: data.priceChangePercent,
      high24h: data.high24h,
      low24h: data.low24h,
      volume24h: data.volume24h,
      quoteVolume24h: data.quoteVolume24h,
      lastQuantity: data.quantity,
      lastSide: data.side,
      timestamp: data.timestamp,
    };

    this.callbacks.ticker.forEach(({ callback }) => {
      callback(ticker);
    });
  }

  private handleDepthUpdate(symbol: string, data: any) {
    const depthUpdate: DepthUpdate = {
      symbol: symbol,
      bids: data.bids || [],
      asks: data.asks || [],
      timestamp: data.timestamp || Date.now(),
    };

    this.depthCache[symbol] = depthUpdate;

    this.callbacks.depth.forEach(({ callback }) => {
      callback(depthUpdate);
    });
  }

  private handleTradeUpdate(symbol: string, data: any) {
    const trade: Trade = {
      tradeId: data.tradeId || 0,
      symbol: symbol,
      price: data.price || "0",
      quantity: data.quantity || "0",
      side: data.side || "buy",
      timestamp: data.timestamp || Date.now(),
    };

    if (!this.tradeCache[symbol]) {
      this.tradeCache[symbol] = [];
    }
    this.tradeCache[symbol] = [trade, ...this.tradeCache[symbol]].slice(0, 100);

    this.callbacks.trade.forEach(({ callback }) => {
      callback(trade);
    });
  }

  private handleKlineUpdate(data: any) {
    this.callbacks.kline.forEach(({ callback }) => {
      callback(data);
    });
  }

  public registerCallback(
    type: MessageType,
    callback: (data: any) => void,
    id: string,
  ) {
    this.callbacks[type].push({ callback, id });
  }

  public deRegisterCallback(type: MessageType, id: string) {
    const index = this.callbacks[type].findIndex((cb) => cb.id === id);
    if (index !== -1) {
      this.callbacks[type].splice(index, 1);
    }
  }

  public getCachedDepth(symbol: string): DepthUpdate | null {
    return this.depthCache[symbol] || null;
  }

  public getCachedTrades(symbol: string): Trade[] {
    return this.tradeCache[symbol] || [];
  }

  private pendingMessages: any[] = [];

  public sendRaw(message: any) {
    if (this.initialized && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.pendingMessages.push(message);
    }
  }

  public isConnected(): boolean {
    return this.initialized && this.ws.readyState === WebSocket.OPEN;
  }
}
