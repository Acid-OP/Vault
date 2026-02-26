import React from "react";

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
  flashPrices: Set<string>;
}

export function BidOrders({
  bids,
  maxTotal,
  calculateBarWidth,
  calculateSizeBarWidth,
  flashPrices,
}: BidOrdersProps) {
  return (
    <div className="flex-shrink-0">
      {bids.map((bid) => {
        const isFlashing = flashPrices.has(bid.price);
        return (
          <div
            key={bid.price}
            className={`relative grid grid-cols-3 px-3 py-[2px] cursor-pointer group ${
              isFlashing ? "animate-flash-green" : ""
            }`}
          >
            <div
              className="absolute right-0 top-0 bottom-0 transition-all duration-300 ease-out"
              style={{
                width: `${calculateBarWidth(bid.total, maxTotal)}%`,
                background:
                  "linear-gradient(to left, rgba(0, 193, 118, 0.08), rgba(0, 193, 118, 0.03))",
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 transition-all duration-300 ease-out"
              style={{
                width: `${calculateSizeBarWidth(bid.size, maxTotal)}%`,
                background: "rgba(0, 193, 118, 0.15)",
              }}
            />
            <div className="text-[#00c176] text-[10.5px] font-mono z-10 tabular-nums group-hover:brightness-125">
              {bid.price}
            </div>
            <div className="text-right text-[10.5px] font-mono text-[#848e9c] z-10 tabular-nums">
              {bid.size}
            </div>
            <div className="text-right text-[10.5px] font-mono text-[#5e6673] z-10 tabular-nums">
              {bid.total}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BidOrders;
