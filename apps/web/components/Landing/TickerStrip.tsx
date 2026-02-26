"use client";

const tickers = [
  { symbol: "BTC", price: "$96,591.70", change: "+2.43%", positive: true },
  { symbol: "ETH", price: "$4,473.92", change: "-0.32%", positive: false },
  { symbol: "SOL", price: "$229.06", change: "+5.12%", positive: true },
  { symbol: "XRP", price: "$3.13", change: "-1.07%", positive: false },
  { symbol: "ADA", price: "$1.24", change: "+3.21%", positive: true },
  { symbol: "MATIC", price: "$0.82", change: "+6.43%", positive: true },
  { symbol: "DOGE", price: "$0.41", change: "-2.15%", positive: false },
  { symbol: "AVAX", price: "$42.18", change: "+4.67%", positive: true },
  { symbol: "DOT", price: "$8.93", change: "+1.89%", positive: true },
  { symbol: "LINK", price: "$18.45", change: "-0.74%", positive: false },
];

function TickerItem({ symbol, price, change, positive }: (typeof tickers)[0]) {
  return (
    <div className="flex items-center gap-3 px-6 shrink-0">
      <span className="text-[#848e9c] text-[11px] font-medium">
        {symbol}/USD
      </span>
      <span className="text-[#eaecef] text-[11px] font-mono tabular-nums">
        {price}
      </span>
      <span
        className={`text-[11px] font-mono tabular-nums ${positive ? "text-[#00c176]" : "text-[#ea3941]"}`}
      >
        {change}
      </span>
    </div>
  );
}

export default function TickerStrip() {
  const items = [...tickers, ...tickers];

  return (
    <div className="border-y border-[rgba(42,46,57,0.2)] bg-[#0e0f14] py-2.5 overflow-hidden">
      <div
        className="flex"
        style={{
          animation: "ticker-scroll 40s linear infinite",
          width: "max-content",
        }}
      >
        {items.map((t, i) => (
          <TickerItem key={i} {...t} />
        ))}
      </div>
    </div>
  );
}
