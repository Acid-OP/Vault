import React from "react";

interface CurrentPriceProps {
  currentPrice: number;
  priceChange: number;
}

export function CurrentPrice({ currentPrice, priceChange }: CurrentPriceProps) {
  const isUp = priceChange >= 0;
  const color = isUp ? "text-[#00c176]" : "text-[#ea3941]";

  return (
    <div className="px-3 py-1.5 border-y border-[rgba(42,46,57,0.25)]">
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-semibold font-mono tabular-nums ${color}`}
        >
          {currentPrice.toFixed(2)}
        </span>
        <svg
          className={`w-2.5 h-2.5 ${color} ${!isUp ? "rotate-180" : ""}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-[9px] text-[#3d4354] font-mono tabular-nums">
          ${currentPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default CurrentPrice;
