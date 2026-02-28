import { MarketMaker } from "./MarketMaker.js";
import { logger } from "./utils/logger.js";

/*
 * Market configs.
 *
 * trend: 0.0 = hard dump, 0.5 = sideways, 1.0 = hard pump
 *   0.65 = gradual uptrend (CR7 going up)
 *   0.35 = gradual downtrend
 *   0.50 = ranging / choppy
 *
 * To add a new market:
 *   1. Add an OrderBook in Engine constructor (apps/http)
 *   2. Add a config line below
 */
const MARKETS = [
  {
    symbol: "CR7_USD",
    basePrice: 105,
    volatility: 0.35,
    trend: 0.65,
    levels: 6,
    spread: 0.8,
    baseQty: 3,
  },
  {
    symbol: "ELON_USD",
    basePrice: 890,
    volatility: 1.8,
    trend: 0.55,
    levels: 6,
    spread: 4.0,
    baseQty: 2,
  },
];

const TICK_MS = 4000;

async function waitForApi(): Promise<void> {
  const url = process.env.API_URL || "http://localhost:3001";
  process.stdout.write(`Waiting for API at ${url}`);
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(
        `${url}/depth?symbol=${MARKETS[0]?.symbol || "CR7_USD"}`,
      );
      if (res.ok) {
        logger.info("mm.api.ready", { url });
        return;
      }
    } catch {
      /* not up yet */
    }
    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`API not reachable after 120s. Start the http server first.`);
}

async function main() {
  logger.info("mm.startup", { message: "Market Maker" });

  MARKETS.forEach((m) => {
    const dir = m.trend > 0.55 ? "BULL" : m.trend < 0.45 ? "BEAR" : "NEUTRAL";
    logger.info("mm.market.config", {
      symbol: m.symbol,
      basePrice: m.basePrice,
      direction: dir,
    });
  });

  logger.info("mm.tick.interval", { intervalSeconds: TICK_MS / 1000 });

  await waitForApi();

  const makers = MARKETS.map((cfg) => new MarketMaker(cfg));

  for (const mm of makers) {
    await mm.seed();
  }

  logger.info("mm.running", { message: "Running... (Ctrl+C to stop)" });

  const tick = async () => {
    await Promise.allSettled(
      makers.map((mm) =>
        mm.tick().catch((err) =>
          logger.error("mm.tick.error", {
            symbol: mm.getSymbol(),
            error: err,
          }),
        ),
      ),
    );
  };

  setInterval(tick, TICK_MS);
}

main().catch((err) => {
  logger.error("mm.fatal", { error: err.message });
  process.exit(1);
});
