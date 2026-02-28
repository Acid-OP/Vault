export interface OrderNewEvent {
  type: "ORDER_NEW";
  orderId: string;
  userId: string;
  market: string;
  side: "buy" | "sell";
  price: number;
  quantity: number;
  filled: number;
  status: string;
}

export interface OrderCancelEvent {
  type: "ORDER_CANCEL";
  orderId: string;
}

export interface TradeEvent {
  type: "TRADE";
  tradeId: number;
  orderId: string;
  symbol: string;
  price: string;
  quantity: number;
  side: "buy" | "sell";
  takerUserId: string;
  makerUserId: string;
  makerOrderId: string;
}

export interface KlineUpdateEvent {
  type: "KLINE_UPDATE";
  symbol: string;
  interval: string;
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trades: number;
}

export interface DepthSnapshotEvent {
  type: "DEPTH_SNAPSHOT";
  symbol: string;
  bids: [string, string][];
  asks: [string, string][];
  timestamp: number;
}

export type DbEvent =
  | OrderNewEvent
  | OrderCancelEvent
  | TradeEvent
  | KlineUpdateEvent
  | DepthSnapshotEvent;
