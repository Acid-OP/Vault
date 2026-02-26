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
      <div className="flex items-center gap-4 px-3 py-2 bg-[#14151b] rounded-lg h-[52px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#1a1b24] rounded-full animate-pulse" />
          <div className="w-20 h-4 bg-[#1a1b24] rounded animate-pulse" />
        </div>
        <div className="w-16 h-5 bg-[#1a1b24] rounded animate-pulse" />
        {[1,2,3,4].map(i => (
          <div key={i} className="w-14 h-8 bg-[#1a1b24] rounded animate-pulse" />
        ))}
      </div>
    );
  }

  const isNegative = marketData.priceChangePercent.startsWith('-');
  const changeColor = isNegative ? 'text-[#f6465d]' : 'text-[#0ecb81]';

  return (
    <div className="flex items-center gap-4 px-3 py-1.5 bg-[#14151b] rounded-lg">
      <div className="flex items-center gap-2 pr-4 border-r border-[#1a1b24]">
        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0">
          {base?.charAt(0)}
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-white font-semibold text-[13px]">{base}</span>
          <span className="text-[#4a5068] text-[13px]">/</span>
          <span className="text-[#4a5068] text-[13px]">{quote}</span>
        </div>
      </div>

      <div className="flex flex-col pr-4 border-r border-[#1a1b24]">
        <span className={`text-[15px] font-semibold font-mono tabular-nums leading-tight ${changeColor}`}>
          {marketData.lastPrice}
        </span>
        <span className="text-[9px] text-[#4a5068] font-mono leading-tight">
          ${marketData.lastPrice}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[9px] text-[#4a5068] leading-tight">24h Change</span>
          <span className={`text-[11px] font-medium font-mono tabular-nums leading-tight ${changeColor}`}>
            {isNegative ? '' : '+'}{marketData.priceChange} ({marketData.priceChangePercent}%)
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[9px] text-[#4a5068] leading-tight">24h High</span>
          <span className="text-[11px] text-[#eaecef] font-mono tabular-nums leading-tight">
            {marketData.high24h}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[9px] text-[#4a5068] leading-tight">24h Low</span>
          <span className="text-[11px] text-[#eaecef] font-mono tabular-nums leading-tight">
            {marketData.low24h}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[9px] text-[#4a5068] leading-tight">24h Vol({quote})</span>
          <span className="text-[11px] text-[#eaecef] font-mono tabular-nums leading-tight">
            {marketData.volume24h}
          </span>
        </div>
      </div>
    </div>
  );
}