import React from "react";

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
  flashPrices: Set<string>;
}

export function AskOrders({
  asks,
  maxTotal,
  calculateBarWidth,
  calculateSizeBarWidth,
  flashPrices,
}: AskOrdersProps) {
  return (
    <div className="flex-shrink-0">
      {asks
        .slice()
        .reverse()
        .map((ask) => {
          const isFlashing = flashPrices.has(ask.price);
          return (
            <div
              key={ask.price}
              className={`relative grid grid-cols-3 px-3 py-[2px] cursor-pointer group ${
                isFlashing ? "animate-flash-red" : ""
              }`}
            >
              <div
                className="absolute right-0 top-0 bottom-0 transition-all duration-300 ease-out"
                style={{
                  width: `${calculateBarWidth(ask.total, maxTotal)}%`,
                  background:
                    "linear-gradient(to left, rgba(234, 57, 65, 0.08), rgba(234, 57, 65, 0.03))",
                }}
              />
              <div
                className="absolute right-0 top-0 bottom-0 transition-all duration-300 ease-out"
                style={{
                  width: `${calculateSizeBarWidth(ask.size, maxTotal)}%`,
                  background: "rgba(234, 57, 65, 0.15)",
                }}
              />
              <div className="text-[#ea3941] text-[10.5px] font-mono z-10 tabular-nums group-hover:brightness-125">
                {ask.price}
              </div>
              <div className="text-right text-[10.5px] font-mono text-[#848e9c] z-10 tabular-nums">
                {ask.size}
              </div>
              <div className="text-right text-[10.5px] font-mono text-[#5e6673] z-10 tabular-nums">
                {ask.total}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default AskOrders;
