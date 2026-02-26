"use client";

import React, { useEffect, useState } from "react";
import { SignalingManager, Ticker } from "../../utils/Manager";
import { getTicker } from "../../utils/httpClient";

export function MarketBar({ market }: { market: string }) {
  const [base, quote] = market.split("_");
  const [marketData, setMarketData] = useState<Ticker | null>(null);

  useEffect(() => {
    const manager = SignalingManager.getInstance();
    const callbackId = `marketbar-${market}`;

    manager.subscribe(market);

    getTicker(market)
      .then((data: any) => {
        if (data && data.symbol) {
          setMarketData({
            symbol: data.symbol,
            lastPrice: data.price || "0",
            priceChange: data.priceChange || "0",
            priceChangePercent: data.priceChangePercent || "0",
            high24h: data.high24h || "0",
            low24h: data.low24h || "0",
            volume24h: data.volume24h || "0",
            quoteVolume24h: data.quoteVolume24h || "0",
            lastQuantity: data.quantity || "0",
            lastSide: data.side || "buy",
            timestamp: data.timestamp || Date.now(),
          });
        }
      })
      .catch((err) => console.error("Failed to fetch initial ticker:", err));

    manager.registerCallback(
      "ticker",
      (ticker: Ticker) => {
        if (ticker.symbol === market) {
          setMarketData(ticker);
        }
      },
      callbackId,
    );

    return () => {
      manager.deRegisterCallback("ticker", callbackId);
      manager.unsubscribe(market);
    };
  }, [market]);

  if (!marketData) {
    return (
      <div className="flex items-center gap-4 px-3 py-1.5 bg-[#0e0f14] rounded-lg border border-[rgba(42,46,57,0.2)] h-[42px]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#1c1e2c] rounded-full animate-pulse" />
          <div className="w-16 h-3 bg-[#1c1e2c] rounded animate-pulse" />
        </div>
        <div className="w-12 h-4 bg-[#1c1e2c] rounded animate-pulse" />
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-12 h-6 bg-[#1c1e2c] rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  const isNegative = marketData.priceChangePercent.startsWith("-");
  const changeColor = isNegative ? "text-[#ea3941]" : "text-[#00c176]";

  return (
    <div className="flex items-center gap-4 px-3 py-1 bg-[#0e0f14] rounded-lg border border-[rgba(42,46,57,0.2)]">
      <div className="flex items-center gap-2 pr-4 border-r border-[rgba(42,46,57,0.25)]">
        <div className="w-5 h-5 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0">
          {base?.charAt(0)}
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-[#eaecef] font-semibold text-[12px]">
            {base}
          </span>
          <span className="text-[#3d4354] text-[12px]">/</span>
          <span className="text-[#3d4354] text-[12px]">{quote}</span>
        </div>
      </div>

      <div className="flex flex-col pr-4 border-r border-[rgba(42,46,57,0.25)]">
        <span
          className={`text-[14px] font-semibold font-mono tabular-nums leading-tight ${changeColor}`}
        >
          {marketData.lastPrice}
        </span>
        <span className="text-[8px] text-[#3d4354] font-mono leading-tight">
          ${marketData.lastPrice}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[8px] text-[#3d4354] leading-tight uppercase tracking-wider">
            24h Chg
          </span>
          <span
            className={`text-[10px] font-medium font-mono tabular-nums leading-tight ${changeColor}`}
          >
            {isNegative ? "" : "+"}
            {marketData.priceChange} ({marketData.priceChangePercent}%)
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[8px] text-[#3d4354] leading-tight uppercase tracking-wider">
            High
          </span>
          <span className="text-[10px] text-[#848e9c] font-mono tabular-nums leading-tight">
            {marketData.high24h}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[8px] text-[#3d4354] leading-tight uppercase tracking-wider">
            Low
          </span>
          <span className="text-[10px] text-[#848e9c] font-mono tabular-nums leading-tight">
            {marketData.low24h}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[8px] text-[#3d4354] leading-tight uppercase tracking-wider">
            Vol({quote})
          </span>
          <span className="text-[10px] text-[#848e9c] font-mono tabular-nums leading-tight">
            {marketData.volume24h}
          </span>
        </div>
      </div>
    </div>
  );
}
