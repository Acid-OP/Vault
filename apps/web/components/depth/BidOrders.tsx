import React, { memo, useRef, useEffect, useState } from "react";

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

const BidRow = memo(function BidRow({
  price,
  size,
  total,
  barWidth,
  sizeBarWidth,
}: {
  price: string;
  size: string;
  total: string;
  barWidth: number;
  sizeBarWidth: number;
}) {
  const prevSizeRef = useRef(size);
  const [highlight, setHighlight] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (prevSizeRef.current !== size) {
      prevSizeRef.current = size;
      setHighlight(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setHighlight(false), 80);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [size]);

  return (
    <div className="relative grid grid-cols-3 px-3 py-[2px] cursor-pointer group">
      <div
        className="absolute inset-0 transition-all duration-300 ease-out"
        style={{
          backgroundColor: highlight
            ? "rgba(0, 193, 118, 0.18)"
            : "transparent",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 transition-all duration-300 ease-out"
        style={{
          width: `${barWidth}%`,
          background:
            "linear-gradient(to left, rgba(0, 193, 118, 0.08), rgba(0, 193, 118, 0.03))",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 transition-all duration-300 ease-out"
        style={{
          width: `${sizeBarWidth}%`,
          background: "rgba(0, 193, 118, 0.15)",
        }}
      />
      <div className="text-[#00c176] text-[10.5px] font-mono z-10 tabular-nums group-hover:brightness-125">
        {price}
      </div>
      <div className="text-right text-[10.5px] font-mono text-[#848e9c] z-10 tabular-nums">
        {size}
      </div>
      <div className="text-right text-[10.5px] font-mono text-[#5e6673] z-10 tabular-nums">
        {total}
      </div>
    </div>
  );
});

export function BidOrders({
  bids,
  maxTotal,
  calculateBarWidth,
  calculateSizeBarWidth,
}: BidOrdersProps) {
  return (
    <div className="flex-shrink-0">
      {bids.map((bid) => (
        <BidRow
          key={bid.price}
          price={bid.price}
          size={bid.size}
          total={bid.total}
          barWidth={calculateBarWidth(bid.total, maxTotal)}
          sizeBarWidth={calculateSizeBarWidth(bid.size, maxTotal)}
        />
      ))}
    </div>
  );
}

export default BidOrders;
