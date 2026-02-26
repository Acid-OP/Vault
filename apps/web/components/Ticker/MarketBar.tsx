'use client';

import React, { useEffect, useState } from 'react';
import { SignalingManager, Ticker } from '../../utils/Manager';
import { getTicker } from '../../utils/httpClient';

export function MarketBar({ market }: { market: string }) {
  const [base, quote] = market.split('_');
  const [marketData, setMarketData] = useState<Ticker | null>(null);

  useEffect(() => {
    const manager = SignalingManager.getInstance();
    const callbackId = `marketbar-${market}`;

    manager.subscribe(market);

    // Fetch initial ticker via HTTP
    getTicker(market).then((data: any) => {
      if (data && data.symbol) {
        setMarketData({
          symbol: data.symbol,
          lastPrice: data.price || '0',
          priceChange: data.priceChange || '0',
          priceChangePercent: data.priceChangePercent || '0',
          high24h: data.high24h || '0',
          low24h: data.low24h || '0',
          volume24h: data.volume24h || '0',
          quoteVolume24h: data.quoteVolume24h || '0',
          lastQuantity: data.quantity || '0',
          lastSide: data.side || 'buy',
          timestamp: data.timestamp || Date.now()
        });
      }
    }).catch(err => console.error('Failed to fetch initial ticker:', err));

    manager.registerCallback('ticker', (ticker: Ticker) => {
      if (ticker.symbol === market) {
        setMarketData(ticker);
      }
    }, callbackId);

    return () => {
      manager.deRegisterCallback('ticker', callbackId);
      manager.unsubscribe(market);
    };
  }, [market]);

  if (!marketData) {
    return (
      <div className="flex items-center gap-6 px-4 py-2.5 bg-[#14151b] rounded-lg">
        <div className="text-[#555a68] text-xs">Loading market data...</div>
      </div>
    );
  }

  const isNegative = marketData.priceChangePercent.startsWith('-');
  const changeColor = isNegative ? 'text-[#f6465d]' : 'text-[#0ecb81]';

  return (
    <div className="flex items-center gap-5 px-4 py-2 bg-[#14151b] rounded-lg">
      <div className="flex items-center gap-2.5 pr-5 border-r border-[#1c1d25]">
        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
          {base?.charAt(0)}
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-white font-semibold text-sm">{base}</span>
          <span className="text-[#555a68] text-sm">/</span>
          <span className="text-[#555a68] text-sm">{quote}</span>
        </div>
      </div>

      <div className="flex flex-col pr-5 border-r border-[#1c1d25]">
        <span className={`text-lg font-semibold font-mono tabular-nums ${changeColor}`}>
          {marketData.lastPrice}
        </span>
        <span className="text-[10px] text-[#555a68] font-mono">
          ${marketData.lastPrice}
        </span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-[#555a68]">24h Change</span>
          <span className={`text-xs font-medium font-mono tabular-nums ${changeColor}`}>
            {isNegative ? '' : '+'}{marketData.priceChange} ({marketData.priceChangePercent}%)
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-[#555a68]">24h High</span>
          <span className="text-xs text-[#eaecef] font-mono tabular-nums">
            {marketData.high24h}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-[#555a68]">24h Low</span>
          <span className="text-xs text-[#eaecef] font-mono tabular-nums">
            {marketData.low24h}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-[#555a68]">24h Vol({quote})</span>
          <span className="text-xs text-[#eaecef] font-mono tabular-nums">
            {marketData.volume24h}
          </span>
        </div>
      </div>
    </div>
  );
}