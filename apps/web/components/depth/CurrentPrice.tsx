import React from 'react';

interface CurrentPriceProps {
  currentPrice: number;
  priceChange: number;
}

export function CurrentPrice({ currentPrice, priceChange }: CurrentPriceProps) {
  const isUp = priceChange >= 0;
  return (
    <div className="px-3 py-1.5">
      <div className="flex items-center gap-1.5">
        <span className={`text-base font-semibold font-mono tabular-nums ${isUp ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
          {currentPrice.toFixed(2)}
        </span>
        <svg
          className={`w-3 h-3 ${isUp ? 'text-[#0ecb81]' : 'text-[#f6465d] rotate-180'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-[10px] text-[#555a68] font-mono">
          ${currentPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default CurrentPrice;