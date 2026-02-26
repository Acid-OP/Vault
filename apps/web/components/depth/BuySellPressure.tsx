import React from "react";

interface BuySellPressureProps {
  buyPercentage: number;
}

export function BuySellPressure({ buyPercentage }: BuySellPressureProps) {
  return (
    <div className="border-t border-[rgba(42,46,57,0.25)] px-3 py-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] text-[#3d4354] uppercase tracking-wider">
          B/S Ratio
        </span>
      </div>
      <div className="flex h-1 overflow-hidden rounded-full gap-px">
        <div
          className="bg-[#00c176] transition-all duration-700 ease-out rounded-l-full"
          style={{ width: `${buyPercentage}%`, opacity: 0.7 }}
        />
        <div
          className="bg-[#ea3941] transition-all duration-700 ease-out rounded-r-full"
          style={{ width: `${100 - buyPercentage}%`, opacity: 0.7 }}
        />
      </div>
      <div className="flex items-center justify-between mt-0.5">
        <span className="text-[9px] font-mono font-medium text-[#00c176] tabular-nums">
          {Math.round(buyPercentage)}%
        </span>
        <span className="text-[9px] font-mono font-medium text-[#ea3941] tabular-nums">
          {Math.round(100 - buyPercentage)}%
        </span>
      </div>
    </div>
  );
}

export default BuySellPressure;
