import React from 'react';

interface Order {
  price: string;
  size: string;
  total: string;
}

interface AskOrdersProps {
  asks: Order[];
  maxTotal: number;
  calculateBarWidth: (total: string, maxTotal: number) => number;
  calculateSizeBarWidth: (size: string, maxTotal: number) => number;
}

export function AskOrders({ asks, maxTotal, calculateBarWidth, calculateSizeBarWidth }: AskOrdersProps) {
  return (
    <div className="flex-shrink-0">
      {asks.slice().reverse().map((ask, idx) => (
        <div
          key={`ask-${idx}`}
          className="relative grid grid-cols-3 px-3 py-[2.5px] hover:bg-[#1a1b23] cursor-pointer transition-colors"
        >
          <div
            className="absolute right-0 top-0 bottom-0 bg-[#2d1a1e] transition-all duration-150"
            style={{ width: `${calculateBarWidth(ask.total, maxTotal)}%` }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 bg-[#5c2229] transition-all duration-150"
            style={{ width: `${calculateSizeBarWidth(ask.size, maxTotal)}%` }}
          />
          <div className="text-[#f6465d] text-[11px] font-mono z-10 tabular-nums">{ask.price}</div>
          <div className="text-right text-[11px] font-mono text-[#b7bdc6] z-10 tabular-nums">{ask.size}</div>
          <div className="text-right text-[11px] font-mono text-[#b7bdc6] z-10 tabular-nums">{ask.total}</div>
        </div>
      ))}
    </div>
  );
}

export default AskOrders;