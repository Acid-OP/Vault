import { MarketMaker } from "./MarketMaker";

/**
 * Market configs - add new markets here.
 * basePrice: starting fair price
 * volatility: max price drift per tick
 * levels: number of bid/ask levels
 * spread: gap between each level
 * baseQty: average order size
 */
const MARKETS = [
  {
    symbol: "CR7_USD",
    basePrice: 105,
    volatility: 0.4,
    levels: 6,
    spread: 1.0,
    baseQty: 3,
  },
  {
    symbol: "ELON_USD",
    basePrice: 890,
    volatility: 2.0,
    levels: 6,
    spread: 5.0,
    baseQty: 2,
  },
];

const TICK_INTERVAL_MS = 4000;

async function waitForApi(): Promise<void> {
  const url = process.env.API_URL || "http://localhost:3001";
  console.log(`Waiting for API at ${url}...`);
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`${url}/depth?symbol=CR7_USD`);
      if (res.ok) {
        console.log("API is ready.\n");
        return;
      }
    } catch {
      /* not ready */
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(
    `API at ${url} not reachable after 60s. Is the http server running?`,
  );
}

async function main() {
  console.log("========================================");
  console.log("  Market Maker Bot");
  console.log(`  Markets: ${MARKETS.map((m) => m.symbol).join(", ")}`);
  console.log(`  Tick interval: ${TICK_INTERVAL_MS}ms`);
  console.log("========================================\n");

  await waitForApi();

  const makers = MARKETS.map((cfg) => new MarketMaker(cfg));

  for (const mm of makers) {
    await mm.seed();
  }

  console.log("\nAll markets seeded. Starting tick loop...\n");

  const loop = async () => {
    const tickPromises = makers.map((mm) =>
      mm.tick().catch((err) => {
        console.error(`[MM:${mm.getSymbol()}] tick error:`, err);
      }),
    );
    await Promise.allSettled(tickPromises);
  };

  setInterval(loop, TICK_INTERVAL_MS);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
