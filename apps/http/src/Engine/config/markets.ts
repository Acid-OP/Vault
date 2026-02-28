export interface MarketDefinition {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  initialPrice: number;
}

export const MARKETS: MarketDefinition[] = [
  {
    symbol: "CR7_USD",
    baseAsset: "CR7",
    quoteAsset: "USD",
    initialPrice: 50000,
  },
  {
    symbol: "ELON_USD",
    baseAsset: "ELON",
    quoteAsset: "USD",
    initialPrice: 50000,
  },
];

export const BASE_ASSETS = MARKETS.map((m) => m.baseAsset);
