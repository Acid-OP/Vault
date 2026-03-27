import React, { memo, useRef, useEffect, useState } from "react";

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

const AskRow = memo(function AskRow({
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
            ? "rgba(234, 57, 65, 0.18)"
            : "transparent",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 transition-all duration-300 ease-out"
        style={{
          width: `${barWidth}%`,
          background:
            "linear-gradient(to left, rgba(234, 57, 65, 0.08), rgba(234, 57, 65, 0.03))",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 transition-all duration-300 ease-out"
        style={{
          width: `${sizeBarWidth}%`,
          background: "rgba(234, 57, 65, 0.15)",
        }}
      />
      <div className="text-[#ea3941] text-[10.5px] font-mono z-10 tabular-nums group-hover:brightness-125">
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

export function AskOrders({
  asks,
  maxTotal,
  calculateBarWidth,
  calculateSizeBarWidth,
}: AskOrdersProps) {
  return (
    <div className="flex-shrink-0">
      {asks
        .slice()
        .reverse()
        .map((ask) => (
          <AskRow
            key={ask.price}
            price={ask.price}
            size={ask.size}
            total={ask.total}
            barWidth={calculateBarWidth(ask.total, maxTotal)}
            sizeBarWidth={calculateSizeBarWidth(ask.size, maxTotal)}
          />
        ))}
    </div>
  );
}

export default AskOrders;
