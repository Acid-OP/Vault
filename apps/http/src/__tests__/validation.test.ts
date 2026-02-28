import { describe, it, expect } from "vitest";
import {
  createOrderSchema,
  cancelOrderSchema,
  symbolQuerySchema,
  klineQuerySchema,
  balanceQuerySchema,
} from "../validation";

describe("createOrderSchema", () => {
  const validInput = {
    market: "CR7_USD",
    price: 100,
    quantity: 5,
    side: "buy" as const,
    userId: "user-1",
  };

  it("valid input passes", () => {
    expect(() => createOrderSchema.parse(validInput)).not.toThrow();
  });

  it("invalid market format rejected (no underscore, lowercase)", () => {
    expect(() =>
      createOrderSchema.parse({ ...validInput, market: "btcusd" }),
    ).toThrow();
  });

  it("negative price rejected", () => {
    expect(() =>
      createOrderSchema.parse({ ...validInput, price: -1 }),
    ).toThrow();
  });

  it("zero quantity rejected", () => {
    expect(() =>
      createOrderSchema.parse({ ...validInput, quantity: 0 }),
    ).toThrow();
  });

  it("string numbers coerce correctly", () => {
    const result = createOrderSchema.parse({
      ...validInput,
      price: "100",
      quantity: "5",
    });
    expect(result).toBeDefined();
  });

  it("empty userId rejected", () => {
    expect(() =>
      createOrderSchema.parse({ ...validInput, userId: "" }),
    ).toThrow();
  });
});

describe("cancelOrderSchema", () => {
  it("valid input passes", () => {
    expect(() =>
      cancelOrderSchema.parse({ orderId: "order-123", market: "CR7_USD" }),
    ).not.toThrow();
  });

  it("invalid market rejected", () => {
    expect(() =>
      cancelOrderSchema.parse({ orderId: "order-123", market: "invalid" }),
    ).toThrow();
  });
});

describe("symbolQuerySchema", () => {
  it("valid symbol passes", () => {
    expect(() => symbolQuerySchema.parse({ symbol: "CR7_USD" })).not.toThrow();
  });

  it("lowercase rejected", () => {
    expect(() => symbolQuerySchema.parse({ symbol: "cr7_usd" })).toThrow();
  });
});

describe("klineQuerySchema", () => {
  it("defaults applied when no interval/limit", () => {
    const result = klineQuerySchema.parse({ symbol: "CR7_USD" });
    expect(result.interval).toBe("1m");
    expect(result.limit).toBe(500);
  });

  it("invalid interval rejected", () => {
    expect(() =>
      klineQuerySchema.parse({ symbol: "CR7_USD", interval: "2m" }),
    ).toThrow();
  });

  it("limit=0 rejected (below min)", () => {
    expect(() =>
      klineQuerySchema.parse({ symbol: "CR7_USD", limit: 0 }),
    ).toThrow();
  });

  it("limit=1001 rejected (above max)", () => {
    expect(() =>
      klineQuerySchema.parse({ symbol: "CR7_USD", limit: 1001 }),
    ).toThrow();
  });
});

describe("balanceQuerySchema", () => {
  it("valid userId passes", () => {
    expect(() => balanceQuerySchema.parse({ userId: "user-1" })).not.toThrow();
  });

  it("empty userId rejected", () => {
    expect(() => balanceQuerySchema.parse({ userId: "" })).toThrow();
  });
});
