import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../utils/logger.js", () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

const mockPublish = vi.fn().mockResolvedValue(undefined);
const mockResponseToHTTP = vi.fn().mockResolvedValue(undefined);
const mockPushDbEvent = vi.fn();

vi.mock("../../RedisManager", () => ({
  RedisManager: {
    getInstance: () => ({
      Publish: mockPublish,
      ResponseToHTTP: mockResponseToHTTP,
      pushDbEvent: mockPushDbEvent,
    }),
  },
}));

import { Engine } from "../Engine";
import { CREATE_ORDER, CANCEL_ORDER } from "../../../types/orders";

describe("Engine", () => {
  let engine: Engine;

  beforeEach(() => {
    vi.clearAllMocks();
    engine = new Engine();
  });

  describe("getBalanceDirect", () => {
    it("new user gets default balances (100000 USD, 1000 per base asset)", () => {
      const balance = engine.getBalanceDirect("new-user");
      expect(balance).not.toBeNull();
      expect(balance!["USD"]!.available).toBe(100000);
      expect(balance!["USD"]!.locked).toBe(0);
      expect(balance!["CR7"]!.available).toBe(1000);
      expect(balance!["ELON"]!.available).toBe(1000);
    });

    it("existing user returns cached balance without reset", () => {
      const first = engine.getBalanceDirect("user-1");
      const second = engine.getBalanceDirect("user-1");
      expect(first).toBe(second);
    });
  });

  describe("getDepthDirect", () => {
    it("unknown market returns empty bids/asks", () => {
      const depth = engine.getDepthDirect("FAKE_USD");
      expect(depth.bids).toEqual([]);
      expect(depth.asks).toEqual([]);
    });

    it("with orders returns populated depth", async () => {
      engine.getBalanceDirect("buyer");
      engine.getBalanceDirect("seller");

      await engine.process({
        message: {
          type: CREATE_ORDER,
          data: {
            market: "CR7_USD",
            price: "100",
            quantity: "5",
            side: "buy",
            userId: "buyer",
          },
        },
        clientId: "c1",
      });

      const depth = engine.getDepthDirect("CR7_USD");
      expect(depth.bids.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("getTickerDirect", () => {
    it("no trades returns zeroed ticker", () => {
      const ticker = engine.getTickerDirect("CR7_USD");
      expect(ticker.price).toBe("0");
      expect(ticker.volume24h).toBe("0");
    });
  });

  describe("getKlineDirect", () => {
    it("no trades returns empty candles", () => {
      const result = engine.getKlineDirect("CR7_USD");
      expect(result.candles).toEqual([]);
    });
  });

  describe("process CREATE_ORDER", () => {
    it("buy order locks USD and returns orderId", async () => {
      await engine.process({
        message: {
          type: CREATE_ORDER,
          data: {
            market: "CR7_USD",
            price: "100",
            quantity: "5",
            side: "buy",
            userId: "buyer",
          },
        },
        clientId: "c1",
      });

      expect(mockResponseToHTTP).toHaveBeenCalledWith(
        "c1",
        expect.objectContaining({ type: "ORDER_PLACED" }),
      );

      const payload = mockResponseToHTTP.mock.calls[0]![1].payload;
      expect(payload.orderId).toBeDefined();

      const balance = engine.getBalanceDirect("buyer");
      expect(balance!["USD"]!.available).toBeLessThan(100000);
      expect(balance!["USD"]!.locked).toBeGreaterThan(0);
    });

    it("sell order locks base asset", async () => {
      await engine.process({
        message: {
          type: CREATE_ORDER,
          data: {
            market: "CR7_USD",
            price: "100",
            quantity: "5",
            side: "sell",
            userId: "seller",
          },
        },
        clientId: "c1",
      });

      expect(mockResponseToHTTP).toHaveBeenCalledWith(
        "c1",
        expect.objectContaining({ type: "ORDER_PLACED" }),
      );

      const balance = engine.getBalanceDirect("seller");
      expect(balance!["CR7"]!.available).toBe(995);
      expect(balance!["CR7"]!.locked).toBe(5);
    });

    it("insufficient funds returns ORDER_CANCELLED", async () => {
      await engine.process({
        message: {
          type: CREATE_ORDER,
          data: {
            market: "CR7_USD",
            price: "100000",
            quantity: "10",
            side: "buy",
            userId: "poor-user",
          },
        },
        clientId: "c1",
      });

      expect(mockResponseToHTTP).toHaveBeenCalledWith(
        "c1",
        expect.objectContaining({ type: "ORDER_CANCELLED" }),
      );
    });

    it("rollback restores balance when order creation fails after locking", async () => {
      // Use a non-existent market so checkAndLockFunds locks USD successfully
      // but createOrder returns undefined (no orderbook), triggering the catch rollback
      await engine.process({
        message: {
          type: CREATE_ORDER,
          data: {
            market: "FAKE_USD",
            price: "100",
            quantity: "5",
            side: "buy",
            userId: "rollback-user",
          },
        },
        clientId: "c1",
      });

      expect(mockResponseToHTTP).toHaveBeenCalledWith(
        "c1",
        expect.objectContaining({ type: "ORDER_CANCELLED" }),
      );

      const balance = engine.getBalanceDirect("rollback-user");
      expect(balance!["USD"]!.available).toBe(100000);
      expect(balance!["USD"]!.locked).toBe(0);
    });

    it("matching order settles correctly — buyer gets base, seller gets quote", async () => {
      // Place sell order
      await engine.process({
        message: {
          type: CREATE_ORDER,
          data: {
            market: "CR7_USD",
            price: "100",
            quantity: "5",
            side: "sell",
            userId: "seller",
          },
        },
        clientId: "c1",
      });

      // Place matching buy order
      await engine.process({
        message: {
          type: CREATE_ORDER,
          data: {
            market: "CR7_USD",
            price: "100",
            quantity: "5",
            side: "buy",
            userId: "buyer",
          },
        },
        clientId: "c2",
      });

      const buyerBalance = engine.getBalanceDirect("buyer");
      const sellerBalance = engine.getBalanceDirect("seller");

      // Buyer received 5 CR7
      expect(buyerBalance!["CR7"]!.available).toBe(1005);
      // Seller received 500 USD (5 * 100)
      expect(sellerBalance!["USD"]!.available).toBe(100500);
    });

    it("price improvement refund — buy at 100, match at 95 refunds surplus", async () => {
      await engine.process({
        message: {
          type: CREATE_ORDER,
          data: {
            market: "CR7_USD",
            price: "95",
            quantity: "5",
            side: "sell",
            userId: "seller",
          },
        },
        clientId: "c1",
      });

      await engine.process({
        message: {
          type: CREATE_ORDER,
          data: {
            market: "CR7_USD",
            price: "100",
            quantity: "5",
            side: "buy",
            userId: "buyer",
          },
        },
        clientId: "c2",
      });

      const buyerBalance = engine.getBalanceDirect("buyer");
      // Locked 100*5=500 but spent 95*5=475, surplus 25 refunded
      // available = 100000 - 500 + 25 = 99525
      expect(buyerBalance!["USD"]!.available).toBe(99525);
      expect(buyerBalance!["USD"]!.locked).toBe(0);
    });

    it("lockedQuote tracks remaining after partial fill", async () => {
      // Sell 3 at 95
      await engine.process({
        message: {
          type: CREATE_ORDER,
          data: {
            market: "CR7_USD",
            price: "95",
            quantity: "3",
            side: "sell",
            userId: "seller",
          },
        },
        clientId: "c1",
      });

      // Buy 5 at 100 — partial fill (3 filled, 2 remaining on book)
      await engine.process({
        message: {
          type: CREATE_ORDER,
          data: {
            market: "CR7_USD",
            price: "100",
            quantity: "5",
            side: "buy",
            userId: "buyer",
          },
        },
        clientId: "c2",
      });

      const buyerBalance = engine.getBalanceDirect("buyer");
      // Locked: 100*5=500, spent on fills: 95*3=285, locked remaining: 500-285=215
      // Price improvement refund: (100-95)*3=15 refunded to available
      // available = 100000 - 500 + 15 = 99515
      expect(buyerBalance!["USD"]!.available).toBe(99515);
      // locked = 500 - 285 (trade) - 15 (refund) = 200
      expect(buyerBalance!["USD"]!.locked).toBe(200);
    });

    it("pushDbEvent called with ORDER_NEW", async () => {
      await engine.process({
        message: {
          type: CREATE_ORDER,
          data: {
            market: "CR7_USD",
            price: "100",
            quantity: "5",
            side: "buy",
            userId: "user-1",
          },
        },
        clientId: "c1",
      });

      const orderNewCalls = mockPushDbEvent.mock.calls.filter(
        (c: any[]) => c[0].type === "ORDER_NEW",
      );
      expect(orderNewCalls.length).toBeGreaterThanOrEqual(1);
      expect(orderNewCalls[0]![0]).toMatchObject({
        type: "ORDER_NEW",
        userId: "user-1",
        market: "CR7_USD",
        side: "buy",
        price: 100,
        quantity: 5,
      });
    });
  });

  describe("process CANCEL_ORDER", () => {
    it("unlocks funds correctly", async () => {
      // Place a buy order first
      await engine.process({
        message: {
          type: CREATE_ORDER,
          data: {
            market: "CR7_USD",
            price: "100",
            quantity: "5",
            side: "buy",
            userId: "user-1",
          },
        },
        clientId: "c1",
      });

      const orderId = mockResponseToHTTP.mock.calls[0]![1].payload.orderId;

      await engine.process({
        message: {
          type: CANCEL_ORDER,
          data: { orderId, market: "CR7_USD" },
        },
        clientId: "c2",
      });

      const balance = engine.getBalanceDirect("user-1");
      expect(balance!["USD"]!.available).toBe(100000);
      expect(balance!["USD"]!.locked).toBe(0);
    });

    it("nonexistent order returns ORDER_CANCELLED without crash", async () => {
      engine.getBalanceDirect("user-1");

      await engine.process({
        message: {
          type: CANCEL_ORDER,
          data: { orderId: "nonexistent-id", market: "CR7_USD" },
        },
        clientId: "c1",
      });

      expect(mockResponseToHTTP).toHaveBeenCalledWith(
        "c1",
        expect.objectContaining({ type: "ORDER_CANCELLED" }),
      );
    });

    it("pushDbEvent called with ORDER_CANCEL", async () => {
      await engine.process({
        message: {
          type: CREATE_ORDER,
          data: {
            market: "CR7_USD",
            price: "100",
            quantity: "5",
            side: "buy",
            userId: "user-1",
          },
        },
        clientId: "c1",
      });

      const orderId = mockResponseToHTTP.mock.calls[0]![1].payload.orderId;
      vi.clearAllMocks();

      await engine.process({
        message: {
          type: CANCEL_ORDER,
          data: { orderId, market: "CR7_USD" },
        },
        clientId: "c2",
      });

      const cancelCalls = mockPushDbEvent.mock.calls.filter(
        (c: any[]) => c[0].type === "ORDER_CANCEL",
      );
      expect(cancelCalls.length).toBe(1);
      expect(cancelCalls[0]![0]).toMatchObject({
        type: "ORDER_CANCEL",
        orderId,
      });
    });
  });
});
