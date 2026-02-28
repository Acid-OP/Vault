import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../utils/logger.js", () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

import { OrderBook } from "../OrderBook";
import { Order } from "../../types/trading";

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    price: 100,
    quantity: 10,
    orderId: `order-${Math.random().toString(36).slice(2, 8)}`,
    filled: 0,
    side: "buy",
    userId: "user-1",
    ...overrides,
  };
}

describe("OrderBook", () => {
  let ob: OrderBook;

  beforeEach(() => {
    ob = new OrderBook("CR7_USD", [], [], 0, 0);
  });

  describe("constructor", () => {
    it("sets baseAsset and quoteAsset from market pair", () => {
      expect(ob.baseAsset).toBe("CR7");
      expect(ob.quoteAsset).toBe("USD");
    });

    it("getMarketPair() reconstructs the pair", () => {
      expect(ob.getMarketPair()).toBe("CR7_USD");
    });
  });

  describe("addOrder — buy, no matching asks", () => {
    it("places the order on bids with no fills", () => {
      const order = makeOrder({ side: "buy", price: 100, quantity: 5 });
      const result = ob.addOrder(order);
      expect(result.fills).toHaveLength(0);
      expect(result.executedQty).toBe(0);
      expect(ob.bids).toHaveLength(1);
    });
  });

  describe("addOrder — sell, no matching bids", () => {
    it("places the order on asks with no fills", () => {
      const order = makeOrder({
        side: "sell",
        price: 100,
        quantity: 5,
        userId: "seller",
      });
      const result = ob.addOrder(order);
      expect(result.fills).toHaveLength(0);
      expect(result.executedQty).toBe(0);
      expect(ob.asks).toHaveLength(1);
    });
  });

  describe("addOrder — buy fully matches an ask", () => {
    it("removes ask, returns fills with correct price/qty/tradeId", () => {
      const ask = makeOrder({
        side: "sell",
        price: 95,
        quantity: 5,
        userId: "seller",
      });
      ob.addOrder(ask);

      const buy = makeOrder({
        side: "buy",
        price: 100,
        quantity: 5,
        userId: "buyer",
      });
      const result = ob.addOrder(buy);

      expect(result.fills).toHaveLength(1);
      expect(result.fills[0]!.price).toBe("95");
      expect(result.fills[0]!.qty).toBe(5);
      expect(typeof result.fills[0]!.tradeId).toBe("number");
      expect(ob.asks).toHaveLength(0);
      expect(ob.bids).toHaveLength(0);
    });
  });

  describe("addOrder — buy partial match", () => {
    it("partially fills the ask, remainder added to bids", () => {
      const ask = makeOrder({
        side: "sell",
        price: 95,
        quantity: 3,
        userId: "seller",
      });
      ob.addOrder(ask);

      const buy = makeOrder({
        side: "buy",
        price: 100,
        quantity: 5,
        userId: "buyer",
      });
      const result = ob.addOrder(buy);

      expect(result.executedQty).toBe(3);
      expect(result.fills).toHaveLength(1);
      expect(result.fills[0]!.qty).toBe(3);
      expect(ob.asks).toHaveLength(0);
      expect(ob.bids).toHaveLength(1);
      expect(ob.bids[0]!.filled).toBe(3);
    });
  });

  describe("addOrder — self-match prevention", () => {
    it("skips matching when both sides have the same userId", () => {
      const ask = makeOrder({
        side: "sell",
        price: 95,
        quantity: 5,
        userId: "same-user",
      });
      ob.addOrder(ask);

      const buy = makeOrder({
        side: "buy",
        price: 100,
        quantity: 5,
        userId: "same-user",
      });
      const result = ob.addOrder(buy);

      expect(result.fills).toHaveLength(0);
      expect(ob.asks).toHaveLength(1);
      expect(ob.bids).toHaveLength(1);
    });
  });

  describe("addOrder — price priority (buy matches cheapest ask first)", () => {
    it("fills from the lowest-priced ask first", () => {
      ob.addOrder(
        makeOrder({
          side: "sell",
          price: 110,
          quantity: 5,
          userId: "s1",
          orderId: "ask-high",
        }),
      );
      ob.addOrder(
        makeOrder({
          side: "sell",
          price: 90,
          quantity: 5,
          userId: "s2",
          orderId: "ask-low",
        }),
      );

      const buy = makeOrder({
        side: "buy",
        price: 110,
        quantity: 5,
        userId: "buyer",
      });
      const result = ob.addOrder(buy);

      expect(result.fills).toHaveLength(1);
      expect(result.fills[0]!.price).toBe("90");
    });
  });

  describe("matchAsk — sell matches highest bid first", () => {
    it("fills from the highest-priced bid first", () => {
      ob.addOrder(
        makeOrder({
          side: "buy",
          price: 90,
          quantity: 5,
          userId: "b1",
          orderId: "bid-low",
        }),
      );
      ob.addOrder(
        makeOrder({
          side: "buy",
          price: 110,
          quantity: 5,
          userId: "b2",
          orderId: "bid-high",
        }),
      );

      const sell = makeOrder({
        side: "sell",
        price: 90,
        quantity: 5,
        userId: "seller",
      });
      const result = ob.addOrder(sell);

      expect(result.fills).toHaveLength(1);
      expect(result.fills[0]!.price).toBe("110");
    });
  });

  describe("cancelBid", () => {
    it("returns the price and removes the bid when it exists", () => {
      const order = makeOrder({ side: "buy", price: 100, quantity: 5 });
      ob.addOrder(order);
      const price = ob.cancelBid(order);
      expect(price).toBe(100);
      expect(ob.bids).toHaveLength(0);
    });

    it("returns null for a nonexistent order", () => {
      const price = ob.cancelBid(makeOrder({ orderId: "nonexistent" }));
      expect(price).toBeNull();
    });
  });

  describe("cancelAsk", () => {
    it("returns the price and removes the ask when it exists", () => {
      const order = makeOrder({
        side: "sell",
        price: 100,
        quantity: 5,
        userId: "seller",
      });
      ob.addOrder(order);
      const price = ob.cancelAsk(order);
      expect(price).toBe(100);
      expect(ob.asks).toHaveLength(0);
    });

    it("returns null for a nonexistent order", () => {
      const price = ob.cancelAsk(makeOrder({ orderId: "nonexistent" }));
      expect(price).toBeNull();
    });
  });

  describe("getDepth", () => {
    it("aggregates multiple orders at the same price", () => {
      ob.addOrder(
        makeOrder({
          side: "buy",
          price: 100,
          quantity: 5,
          userId: "u1",
          orderId: "a",
        }),
      );
      ob.addOrder(
        makeOrder({
          side: "buy",
          price: 100,
          quantity: 3,
          userId: "u2",
          orderId: "b",
        }),
      );

      const depth = ob.getDepth();
      expect(depth.aggregatedBids).toHaveLength(1);
      expect(depth.aggregatedBids[0]).toEqual(["100", "8"]);
    });

    it("respects limit parameter", () => {
      ob.addOrder(
        makeOrder({
          side: "buy",
          price: 100,
          quantity: 5,
          userId: "u1",
          orderId: "a",
        }),
      );
      ob.addOrder(
        makeOrder({
          side: "buy",
          price: 99,
          quantity: 5,
          userId: "u2",
          orderId: "b",
        }),
      );
      ob.addOrder(
        makeOrder({
          side: "buy",
          price: 98,
          quantity: 5,
          userId: "u3",
          orderId: "c",
        }),
      );

      const depth = ob.getDepth(1);
      expect(depth.aggregatedBids).toHaveLength(1);
      expect(depth.aggregatedBids[0]![0]).toBe("100");
    });

    it("subtracts filled from available qty", () => {
      const ask = makeOrder({
        side: "sell",
        price: 100,
        quantity: 3,
        userId: "seller",
      });
      ob.addOrder(ask);

      // Partially fill by matching a smaller buy
      ob.addOrder(
        makeOrder({ side: "buy", price: 100, quantity: 1, userId: "buyer" }),
      );

      const depth = ob.getDepth();
      // Remaining ask qty = 3 - 1 = 2
      expect(depth.aggregatedAsks).toHaveLength(1);
      expect(depth.aggregatedAsks[0]).toEqual(["100", "2"]);
    });
  });

  describe("insertBid / insertAsk — maintains sorted order", () => {
    it("bids are sorted descending by price", () => {
      ob.addOrder(
        makeOrder({
          side: "buy",
          price: 90,
          quantity: 1,
          userId: "u1",
          orderId: "a",
        }),
      );
      ob.addOrder(
        makeOrder({
          side: "buy",
          price: 110,
          quantity: 1,
          userId: "u2",
          orderId: "b",
        }),
      );
      ob.addOrder(
        makeOrder({
          side: "buy",
          price: 100,
          quantity: 1,
          userId: "u3",
          orderId: "c",
        }),
      );

      expect(ob.bids[0]!.price).toBe(110);
      expect(ob.bids[1]!.price).toBe(100);
      expect(ob.bids[2]!.price).toBe(90);
    });

    it("asks are sorted ascending by price", () => {
      ob.addOrder(
        makeOrder({
          side: "sell",
          price: 110,
          quantity: 1,
          userId: "u1",
          orderId: "a",
        }),
      );
      ob.addOrder(
        makeOrder({
          side: "sell",
          price: 90,
          quantity: 1,
          userId: "u2",
          orderId: "b",
        }),
      );
      ob.addOrder(
        makeOrder({
          side: "sell",
          price: 100,
          quantity: 1,
          userId: "u3",
          orderId: "c",
        }),
      );

      expect(ob.asks[0]!.price).toBe(90);
      expect(ob.asks[1]!.price).toBe(100);
      expect(ob.asks[2]!.price).toBe(110);
    });
  });
});
