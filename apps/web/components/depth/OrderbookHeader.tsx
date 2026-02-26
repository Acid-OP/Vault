import React from "react";

interface OrderbookHeaderProps {
  baseAsset: string;
  quoteAsset: string;
}

export function OrderbookHeader({
  baseAsset,
  quoteAsset,
}: OrderbookHeaderProps) {
  return (
    <div className="grid grid-cols-3 px-3 py-1 text-[9px] border-b border-[rgba(42,46,57,0.25)]">
      <div className="text-left text-[#3d4354] font-medium uppercase tracking-wider">
        Price({quoteAsset})
      </div>
      <div className="text-right text-[#3d4354] font-medium uppercase tracking-wider">
        Size({baseAsset})
      </div>
      <div className="text-right text-[#3d4354] font-medium uppercase tracking-wider">
        Total
      </div>
    </div>
  );
}
