import React from 'react';

interface BuySellPressureProps {
  buyPercentage: number;
}

export function BuySellPressure({ buyPercentage }: BuySellPressureProps) {
  return (
    <div className="border-t border-[#1c1d25] px-3 py-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] text-[#555a68]">Buy/Sell Pressure</span>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full gap-[1px]">
        <div
          className="bg-[#0ecb81] transition-all duration-500 ease-out rounded-l-full"
          style={{ width: `${buyPercentage}%` }}
        />
        <div
          className="bg-[#f6465d] transition-all duration-500 ease-out rounded-r-full"
          style={{ width: `${100 - buyPercentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] font-medium text-[#0ecb81]">
          {Math.round(buyPercentage)}%
        </span>
        <span className="text-[10px] font-medium text-[#f6465d]">
          {Math.round(100 - buyPercentage)}%
        </span>
      </div>
    </div>
  );
}

export default BuySellPressure;
