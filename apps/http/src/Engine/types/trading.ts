export const BASE_CURRENCY = "USD";
export type userId = string;

export interface UserBalance {
  [key: string]: {
    available: number;
    locked: number;
  };
}

export interface Order {
  price: number;
  quantity: number;
  orderId: string;
  filled: number;
  side: "buy" | "sell";
  userId: string;
  lockedQuote?: number;
}

export interface Fill {
  price: string;
  qty: number;
  tradeId: number;
  otherUserId: string;
  makerOrderId: string;
}
