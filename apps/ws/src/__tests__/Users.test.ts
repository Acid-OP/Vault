import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../utils/logger.js", () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

const mockSubscribe = vi.fn().mockResolvedValue(undefined);
const mockUnsubscribe = vi.fn().mockResolvedValue(undefined);

vi.mock("../subscription.js", () => ({
  Subscription: {
    getInstance: () => ({
      subscribe: mockSubscribe,
      unsubscribe: mockUnsubscribe,
    }),
  },
}));

import { Users } from "../Users";

function createMockWs() {
  const handlers: Record<string, Function> = {};
  return {
    send: vi.fn(),
    on: vi.fn((event: string, handler: Function) => {
      handlers[event] = handler;
    }),
    _trigger: (event: string, ...args: any[]) => {
      handlers[event]?.(...args);
    },
  };
}

describe("Users", () => {
  let mockWs: ReturnType<typeof createMockWs>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWs = createMockWs();
  });

  describe("isValidMessage", () => {
    // Access private method through the message handler behavior
    function sendAndCheck(data: unknown): boolean {
      new Users("test-user", mockWs as any);
      mockWs.send.mockClear();
      mockWs._trigger("message", JSON.stringify(data));
      // If send was called with an error, the message was invalid
      // (valid SUBSCRIBE triggers Subscription.subscribe, not ws.send with error)
      return !mockWs.send.mock.calls.some((call: any[]) => {
        try {
          const parsed = JSON.parse(call[0]);
          return parsed.error !== undefined;
        } catch {
          return false;
        }
      });
    }

    it("valid SUBSCRIBE accepted", () => {
      const valid = sendAndCheck({
        method: "SUBSCRIBE",
        params: ["trade@CR7_USD"],
      });
      expect(valid).toBe(true);
    });

    it("valid UNSUBSCRIBE accepted", () => {
      const valid = sendAndCheck({
        method: "UNSUBSCRIBE",
        params: ["depth@CR7_USD"],
      });
      expect(valid).toBe(true);
    });

    it("invalid method rejected", () => {
      const valid = sendAndCheck({
        method: "INVALID",
        params: ["trade@CR7_USD"],
      });
      expect(valid).toBe(false);
    });

    it("empty params rejected", () => {
      const valid = sendAndCheck({ method: "SUBSCRIBE", params: [] });
      expect(valid).toBe(false);
    });

    it(">10 params rejected", () => {
      const params = Array.from({ length: 11 }, (_, i) => `trade@MKT${i}_USD`);
      const valid = sendAndCheck({ method: "SUBSCRIBE", params });
      expect(valid).toBe(false);
    });

    it("param too long (>50 chars) rejected", () => {
      const valid = sendAndCheck({
        method: "SUBSCRIBE",
        params: ["a".repeat(50)],
      });
      expect(valid).toBe(false);
    });

    it("non-string param rejected", () => {
      const valid = sendAndCheck({ method: "SUBSCRIBE", params: [123] });
      expect(valid).toBe(false);
    });

    it("null body rejected", async () => {
      new Users("test-user", mockWs as any);
      mockWs.send.mockClear();
      mockWs._trigger("message", JSON.stringify(null));
      expect(mockWs.send).toHaveBeenCalledWith(
        expect.stringContaining("Invalid message format"),
      );
    });

    it("non-object (string) rejected", () => {
      new Users("test-user", mockWs as any);
      mockWs.send.mockClear();
      mockWs._trigger("message", JSON.stringify("a string"));
      expect(mockWs.send).toHaveBeenCalledWith(
        expect.stringContaining("Invalid message format"),
      );
    });
  });

  describe("emit", () => {
    it("sends JSON via ws.send", () => {
      const user = new Users("test-user", mockWs as any);
      const message = {
        type: "ticker" as const,
        data: {
          event: "ticker" as const,
          symbol: "CR7_USD",
          price: "100",
          quantity: "1",
          side: "buy" as const,
          priceChange: "0",
          priceChangePercent: "0",
          high24h: "100",
          low24h: "100",
          volume24h: "1",
          quoteVolume24h: "100",
          timestamp: Date.now(),
        },
      };
      user.emit(message);
      expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify(message));
    });
  });

  describe("malformed JSON", () => {
    it("sends error response for non-JSON string", () => {
      new Users("test-user", mockWs as any);
      mockWs.send.mockClear();
      mockWs._trigger("message", "not valid json {{{");
      expect(mockWs.send).toHaveBeenCalledWith(
        expect.stringContaining("Malformed JSON"),
      );
    });
  });

  describe("valid SUBSCRIBE flow", () => {
    it("calls Subscription.subscribe for each param", async () => {
      new Users("test-user", mockWs as any);
      mockWs._trigger(
        "message",
        JSON.stringify({
          method: "SUBSCRIBE",
          params: ["trade@CR7_USD", "depth@CR7_USD"],
        }),
      );

      // Allow async handlers to settle
      await new Promise((r) => setTimeout(r, 10));

      expect(mockSubscribe).toHaveBeenCalledTimes(2);
      expect(mockSubscribe).toHaveBeenCalledWith("test-user", "trade@CR7_USD");
      expect(mockSubscribe).toHaveBeenCalledWith("test-user", "depth@CR7_USD");
    });
  });
});
