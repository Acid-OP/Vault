import React from 'react';

interface OrderbookHeaderProps {
  baseAsset: string;
  quoteAsset: string;
}

export function OrderbookHeader({ baseAsset, quoteAsset }: OrderbookHeaderProps) {
  return (
    <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] border-b border-[#1c1d25]">
      <div className="text-left text-[#555a68] font-medium">Price({quoteAsset})</div>
      <div className="text-right text-[#555a68] font-medium">Size({baseAsset})</div>
      <div className="text-right text-[#555a68] font-medium">Total({baseAsset})</div>
    </div>
  );
}
