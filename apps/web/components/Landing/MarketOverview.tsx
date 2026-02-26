"use client";

import { useState } from "react";
import Link from "next/link";

const tabs = ["Popular", "New Listings", "Top Gainers", "Top Volume"] as const;

interface Market {
  symbol: string;
  name: string;
  price: string;
  change: string;
  positive: boolean;
  volume: string;
  marketCap: string;
  sparkline: number[];
}

const markets: Record<string, Market[]> = {
  Popular: [
    {
      symbol: "CR7",
      name: "Cristiano Ronaldo",
      price: "$142.80",
      change: "+14.2%",
      positive: true,
      volume: "$48.2M",
      marketCap: "$1.42B",
      sparkline: [30, 35, 38, 42, 50, 48, 55, 60, 58, 68],
    },
    {
      symbol: "ELON",
      name: "Elon Musk",
      price: "$387.50",
      change: "+8.7%",
      positive: true,
      volume: "$92.1M",
      marketCap: "$3.87B",
      sparkline: [40, 45, 42, 50, 55, 52, 58, 62, 60, 65],
    },
    {
      symbol: "MESSI",
      name: "Lionel Messi",
      price: "$128.40",
      change: "+6.9%",
      positive: true,
      volume: "$34.5M",
      marketCap: "$1.28B",
      sparkline: [35, 38, 40, 42, 45, 48, 50, 52, 55, 57],
    },
    {
      symbol: "TRUMP",
      name: "Donald Trump",
      price: "$256.30",
      change: "+18.3%",
      positive: true,
      volume: "$78.4M",
      marketCap: "$2.56B",
      sparkline: [25, 30, 35, 40, 48, 55, 60, 65, 62, 72],
    },
    {
      symbol: "TSWIFT",
      name: "Taylor Swift",
      price: "$89.20",
      change: "-2.1%",
      positive: false,
      volume: "$21.8M",
      marketCap: "$892M",
      sparkline: [55, 52, 50, 48, 45, 47, 44, 42, 45, 43],
    },
    {
      symbol: "MRBEAST",
      name: "MrBeast",
      price: "$67.40",
      change: "+11.4%",
      positive: true,
      volume: "$28.6M",
      marketCap: "$674M",
      sparkline: [28, 32, 35, 40, 38, 45, 50, 55, 58, 62],
    },
  ],
  "New Listings": [
    {
      symbol: "MBAPPE",
      name: "Kylian Mbappé",
      price: "$94.60",
      change: "+13.2%",
      positive: true,
      volume: "$18.3M",
      marketCap: "$946M",
      sparkline: [20, 28, 35, 40, 45, 50, 55, 58, 62, 68],
    },
    {
      symbol: "POKIMANE",
      name: "Pokimane",
      price: "$12.80",
      change: "+8.1%",
      positive: true,
      volume: "$4.2M",
      marketCap: "$128M",
      sparkline: [30, 35, 33, 40, 42, 45, 50, 55, 52, 58],
    },
    {
      symbol: "BILLIE",
      name: "Billie Eilish",
      price: "$34.70",
      change: "+3.7%",
      positive: true,
      volume: "$8.9M",
      marketCap: "$347M",
      sparkline: [35, 38, 40, 42, 40, 44, 46, 45, 48, 50],
    },
    {
      symbol: "HAALAND",
      name: "Erling Haaland",
      price: "$108.50",
      change: "+6.3%",
      positive: true,
      volume: "$22.1M",
      marketCap: "$1.08B",
      sparkline: [32, 36, 40, 42, 45, 48, 50, 54, 56, 58],
    },
    {
      symbol: "LOGAN",
      name: "Logan Paul",
      price: "$8.40",
      change: "-4.2%",
      positive: false,
      volume: "$3.1M",
      marketCap: "$84M",
      sparkline: [50, 48, 45, 42, 40, 38, 42, 40, 36, 35],
    },
    {
      symbol: "CONOR",
      name: "Conor McGregor",
      price: "$45.20",
      change: "+9.1%",
      positive: true,
      volume: "$12.4M",
      marketCap: "$452M",
      sparkline: [30, 35, 38, 42, 40, 48, 50, 55, 52, 58],
    },
  ],
  "Top Gainers": [
    {
      symbol: "TRUMP",
      name: "Donald Trump",
      price: "$256.30",
      change: "+18.3%",
      positive: true,
      volume: "$78.4M",
      marketCap: "$2.56B",
      sparkline: [25, 30, 35, 40, 48, 55, 60, 65, 62, 72],
    },
    {
      symbol: "DHONI",
      name: "MS Dhoni",
      price: "$76.30",
      change: "+15.7%",
      positive: true,
      volume: "$19.8M",
      marketCap: "$763M",
      sparkline: [22, 28, 32, 38, 42, 48, 55, 60, 58, 65],
    },
    {
      symbol: "CR7",
      name: "Cristiano Ronaldo",
      price: "$142.80",
      change: "+14.2%",
      positive: true,
      volume: "$48.2M",
      marketCap: "$1.42B",
      sparkline: [30, 35, 38, 42, 50, 48, 55, 60, 58, 68],
    },
    {
      symbol: "MBAPPE",
      name: "Kylian Mbappé",
      price: "$94.60",
      change: "+13.2%",
      positive: true,
      volume: "$18.3M",
      marketCap: "$946M",
      sparkline: [20, 28, 35, 40, 45, 50, 55, 58, 62, 68],
    },
    {
      symbol: "KANYE",
      name: "Kanye West",
      price: "$52.10",
      change: "+12.1%",
      positive: true,
      volume: "$15.6M",
      marketCap: "$521M",
      sparkline: [28, 32, 35, 40, 38, 45, 50, 55, 52, 60],
    },
    {
      symbol: "MRBEAST",
      name: "MrBeast",
      price: "$67.40",
      change: "+11.4%",
      positive: true,
      volume: "$28.6M",
      marketCap: "$674M",
      sparkline: [28, 32, 35, 40, 38, 45, 50, 55, 58, 62],
    },
  ],
  "Top Volume": [
    {
      symbol: "ELON",
      name: "Elon Musk",
      price: "$387.50",
      change: "+8.7%",
      positive: true,
      volume: "$92.1M",
      marketCap: "$3.87B",
      sparkline: [40, 45, 42, 50, 55, 52, 58, 62, 60, 65],
    },
    {
      symbol: "TRUMP",
      name: "Donald Trump",
      price: "$256.30",
      change: "+18.3%",
      positive: true,
      volume: "$78.4M",
      marketCap: "$2.56B",
      sparkline: [25, 30, 35, 40, 48, 55, 60, 65, 62, 72],
    },
    {
      symbol: "CR7",
      name: "Cristiano Ronaldo",
      price: "$142.80",
      change: "+14.2%",
      positive: true,
      volume: "$48.2M",
      marketCap: "$1.42B",
      sparkline: [30, 35, 38, 42, 50, 48, 55, 60, 58, 68],
    },
    {
      symbol: "MESSI",
      name: "Lionel Messi",
      price: "$128.40",
      change: "+6.9%",
      positive: true,
      volume: "$34.5M",
      marketCap: "$1.28B",
      sparkline: [35, 38, 40, 42, 45, 48, 50, 52, 55, 57],
    },
    {
      symbol: "MRBEAST",
      name: "MrBeast",
      price: "$67.40",
      change: "+11.4%",
      positive: true,
      volume: "$28.6M",
      marketCap: "$674M",
      sparkline: [28, 32, 35, 40, 38, 45, 50, 55, 58, 62],
    },
    {
      symbol: "VIRAT",
      name: "Virat Kohli",
      price: "$98.70",
      change: "+10.4%",
      positive: true,
      volume: "$24.3M",
      marketCap: "$987M",
      sparkline: [32, 36, 40, 42, 48, 50, 52, 56, 58, 62],
    },
  ],
};

function MiniSparkline({
  data,
  positive,
}: {
  data: number[];
  positive: boolean;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 28;
  const w = 80;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "#00c176" : "#ea3941"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MarketOverview() {
  const [activeTab, setActiveTab] = useState<string>("Popular");

  return (
    <section className="py-16 bg-[#0e0f14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-[28px] sm:text-[32px] text-[#eaecef] font-normal tracking-[-0.02em]">
              Markets
            </h2>
            <p className="text-[#3d4354] text-[13px] mt-1">
              Real-time prices across top assets.
            </p>
          </div>
          <Link
            href="/trade/CR7_USD"
            className="text-[#00c176] text-[12px] font-medium hover:text-[#00c176]/80 transition-colors"
          >
            View all markets &rarr;
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-[rgba(42,46,57,0.2)]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-[12px] font-medium transition-colors relative cursor-pointer ${
                activeTab === tab
                  ? "text-[#eaecef]"
                  : "text-[#3d4354] hover:text-[#848e9c]"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00c176] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_100px] gap-4 px-4 py-2 text-[9px] text-[#3d4354] uppercase tracking-widest">
          <span>Name</span>
          <span className="text-right">Price</span>
          <span className="text-right">24h Change</span>
          <span className="text-right">24h Volume</span>
          <span className="text-right">Market Cap</span>
          <span className="text-right">Last 7d</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[rgba(42,46,57,0.12)]">
          {(markets[activeTab] || []).map((m) => (
            <Link
              key={m.symbol}
              href={`/trade/${m.symbol}_USD`}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_100px] gap-4 px-4 py-3.5 items-center hover:bg-[#13141c] transition-colors rounded-lg cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1c1e2c] flex items-center justify-center text-[#848e9c] text-[10px] font-bold shrink-0 group-hover:bg-[#242636] transition-colors">
                  {m.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="text-[#eaecef] text-[13px] font-medium">
                    {m.name}
                  </div>
                  <div className="text-[#3d4354] text-[10px]">{m.symbol}</div>
                </div>
              </div>
              <div className="text-[#eaecef] text-[13px] font-mono tabular-nums text-right">
                {m.price}
              </div>
              <div
                className={`text-[13px] font-mono tabular-nums text-right ${m.positive ? "text-[#00c176]" : "text-[#ea3941]"}`}
              >
                {m.change}
              </div>
              <div className="text-[#848e9c] text-[13px] font-mono tabular-nums text-right">
                {m.volume}
              </div>
              <div className="text-[#848e9c] text-[13px] font-mono tabular-nums text-right">
                {m.marketCap}
              </div>
              <div className="flex justify-end">
                <MiniSparkline data={m.sparkline} positive={m.positive} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
