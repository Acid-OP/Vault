import { describe, it, expect, beforeEach } from "vitest";
import { KlineManager } from "../KlineManager";

describe("KlineManager", () => {
  let km: KlineManager;

  beforeEach(() => {
    km = new KlineManager();
  });

  describe("intervalToMs", () => {
    it.each([
      ["1m", 60_000],
      ["5m", 300_000],
      ["15m", 900_000],
      ["1h", 3_600_000],
      ["4h", 14_400_000],
      ["1d", 86_400_000],
    ])("converts %s to %d ms", (interval, expected) => {
      // Access private method via any cast
      const ms = (km as any).intervalToMs(interval);
      expect(ms).toBe(expected);
    });
  });

  describe("getWindowStart", () => {
    it("aligns timestamp to interval boundary", () => {
      // 12:03:45 for a 5m interval should align to 12:00:00
      const ts = new Date("2025-01-01T12:03:45Z").getTime();
      const windowStart = (km as any).getWindowStart(ts, "5m");
      const expected = new Date("2025-01-01T12:00:00Z").getTime();
      expect(windowStart).toBe(expected);
    });
  });

  describe("updateKline — first trade creates new candle", () => {
    it("returns newCandleInitiated=true with correct OHLCV", () => {
      const ts = new Date("2025-01-01T12:00:30Z").getTime();
      const { kline, newCandleInitiated } = km.updateKline(
        "CR7_USD",
        "1m",
        100,
        5,
        ts,
      );

      expect(newCandleInitiated).toBe(true);
      expect(kline.open).toBe(100);
      expect(kline.high).toBe(100);
      expect(kline.low).toBe(100);
      expect(kline.close).toBe(100);
      expect(kline.volume).toBe(5);
      expect(kline.trades).toBe(1);
      expect(kline.isClosed).toBe(false);
    });
  });

  describe("updateKline — second trade in same window updates OHLC", () => {
    it("updates high, low, close, volume, trades", () => {
      const ts = new Date("2025-01-01T12:00:10Z").getTime();
      km.updateKline("CR7_USD", "1m", 100, 5, ts);

      const { kline, newCandleInitiated } = km.updateKline(
        "CR7_USD",
        "1m",
        110,
        3,
        ts + 5000,
      );

      expect(newCandleInitiated).toBe(false);
      expect(kline.open).toBe(100);
      expect(kline.high).toBe(110);
      expect(kline.close).toBe(110);
      expect(kline.volume).toBe(8);
      expect(kline.trades).toBe(2);
    });
  });

  describe("updateKline — trade in new window closes previous candle", () => {
    it("marks previous candle as closed and pushes to history", () => {
      const ts1 = new Date("2025-01-01T12:00:10Z").getTime();
      km.updateKline("CR7_USD", "1m", 100, 5, ts1);

      // Jump to next minute
      const ts2 = new Date("2025-01-01T12:01:10Z").getTime();
      const { kline, newCandleInitiated } = km.updateKline(
        "CR7_USD",
        "1m",
        120,
        2,
        ts2,
      );

      expect(newCandleInitiated).toBe(true);
      expect(kline.open).toBe(120);

      const history = km.getKlineHistory("CR7_USD", "1m");
      // History includes closed candle + current open candle
      expect(history.length).toBe(2);
      expect(history[0]!.isClosed).toBe(true);
      expect(history[1]!.isClosed).toBe(false);
    });
  });

  describe("updateKline — high/low tracking", () => {
    it("correctly updates high and low", () => {
      const base = new Date("2025-01-01T12:00:00Z").getTime();
      km.updateKline("CR7_USD", "1m", 100, 1, base);
      km.updateKline("CR7_USD", "1m", 120, 1, base + 1000);
      const { kline } = km.updateKline("CR7_USD", "1m", 80, 1, base + 2000);

      expect(kline.high).toBe(120);
      expect(kline.low).toBe(80);
    });
  });

  describe("getCurrentKline", () => {
    it("returns the current candle for an existing market/interval", () => {
      const ts = new Date("2025-01-01T12:00:10Z").getTime();
      km.updateKline("CR7_USD", "1m", 100, 5, ts);

      const current = km.getCurrentKline("CR7_USD", "1m");
      expect(current).toBeDefined();
      expect(current!.open).toBe(100);
    });

    it("returns undefined for a non-existing market", () => {
      expect(km.getCurrentKline("FAKE_USD", "1m")).toBeUndefined();
    });
  });

  describe("getKlineHistory", () => {
    it("respects limit parameter", () => {
      const base = new Date("2025-01-01T12:00:00Z").getTime();
      km.updateKline("CR7_USD", "1m", 100, 1, base);
      km.updateKline("CR7_USD", "1m", 110, 1, base + 60_000);
      km.updateKline("CR7_USD", "1m", 120, 1, base + 120_000);

      // 2 closed + 1 current = 3 total; limit to 2
      const history = km.getKlineHistory("CR7_USD", "1m", 2);
      expect(history).toHaveLength(2);
    });

    it("includes current (open) candle", () => {
      const ts = new Date("2025-01-01T12:00:10Z").getTime();
      km.updateKline("CR7_USD", "1m", 100, 1, ts);

      const history = km.getKlineHistory("CR7_USD", "1m");
      expect(history).toHaveLength(1);
      expect(history[0]!.isClosed).toBe(false);
    });
  });

  describe("getAllCurrentKlines", () => {
    it("returns open candles across multiple markets", () => {
      const ts = new Date("2025-01-01T12:00:10Z").getTime();
      km.updateKline("CR7_USD", "1m", 100, 1, ts);
      km.updateKline("ELON_USD", "1m", 200, 1, ts);

      const all = km.getAllCurrentKlines();
      expect(all.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("history trimming — MAX_HISTORY_PER_KEY=500", () => {
    it("trims history beyond 500 entries", () => {
      const base = new Date("2025-01-01T00:00:00Z").getTime();
      // Create 502 windows (501 closed candles + 1 current)
      for (let i = 0; i < 502; i++) {
        km.updateKline("CR7_USD", "1m", 100 + i, 1, base + i * 60_000);
      }

      const history = km.getKlineHistory("CR7_USD", "1m");
      // 500 closed (trimmed) + 1 current = 501
      expect(history.length).toBeLessThanOrEqual(501);
    });
  });
});
