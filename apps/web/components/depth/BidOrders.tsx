import React from 'react';

interface Order {
  price: string;
  size: string;
  total: string;
}

interface BidOrdersProps {
  bids: Order[];
  maxTotal: number;
  calculateBarWidth: (total: string, maxTotal: number) => number;
  calculateSizeBarWidth: (size: string, maxTotal: number) => number;
}

export function BidOrders({ bids, maxTotal, calculateBarWidth, calculateSizeBarWidth }: BidOrdersProps) {
  return (
    <div className="flex-shrink-0">
      {bids.map((bid, idx) => (
        <div
          key={`bid-${idx}`}
          className="relative grid grid-cols-3 px-3 py-[2.5px] hover:bg-[#1a1b23] cursor-pointer transition-colors"
        >
          <div
            className="absolute right-0 top-0 bottom-0 bg-[#0e2d23] transition-all duration-150"
            style={{ width: `${calculateBarWidth(bid.total, maxTotal)}%` }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 bg-[#0d4d37] transition-all duration-150"
            style={{ width: `${calculateSizeBarWidth(bid.size, maxTotal)}%` }}
          />
          <div className="text-[#0ecb81] text-[11px] font-mono z-10 tabular-nums">{bid.price}</div>
          <div className="text-right text-[11px] font-mono text-[#b7bdc6] z-10 tabular-nums">{bid.size}</div>
          <div className="text-right text-[11px] font-mono text-[#b7bdc6] z-10 tabular-nums">{bid.total}</div>
        </div>
      ))}
    </div>
  );
}

export default BidOrders;