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
      symbol: "BTC",
      name: "Bitcoin",
      price: "$96,591.70",
      change: "+2.43%",
      positive: true,
      volume: "$28.4B",
      marketCap: "$1.91T",
      sparkline: [40, 42, 38, 45, 50, 48, 55, 58, 54, 60],
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: "$4,473.92",
      change: "-0.32%",
      positive: false,
      volume: "$12.1B",
      marketCap: "$538B",
      sparkline: [50, 48, 52, 47, 45, 48, 44, 42, 46, 43],
    },
    {
      symbol: "SOL",
      name: "Solana",
      price: "$229.06",
      change: "+5.12%",
      positive: true,
      volume: "$4.8B",
      marketCap: "$108B",
      sparkline: [30, 35, 33, 40, 42, 45, 50, 48, 55, 58],
    },
    {
      symbol: "XRP",
      name: "Ripple",
      price: "$3.13",
      change: "-1.07%",
      positive: false,
      volume: "$3.2B",
      marketCap: "$178B",
      sparkline: [45, 42, 48, 44, 40, 38, 42, 39, 36, 38],
    },
    {
      symbol: "ADA",
      name: "Cardano",
      price: "$1.24",
      change: "+3.21%",
      positive: true,
      volume: "$1.9B",
      marketCap: "$43.7B",
      sparkline: [35, 38, 36, 40, 42, 45, 43, 48, 50, 52],
    },
    {
      symbol: "AVAX",
      name: "Avalanche",
      price: "$42.18",
      change: "+4.67%",
      positive: true,
      volume: "$890M",
      marketCap: "$17.2B",
      sparkline: [28, 32, 35, 38, 40, 42, 48, 50, 52, 55],
    },
  ],
  "New Listings": [
    {
      symbol: "PENGU",
      name: "Pengu",
      price: "$0.01207",
      change: "+12.4%",
      positive: true,
      volume: "$342M",
      marketCap: "$1.2B",
      sparkline: [20, 28, 35, 32, 40, 50, 48, 55, 60, 65],
    },
    {
      symbol: "SHFL",
      name: "Shuffle",
      price: "$0.2481",
      change: "+8.15%",
      positive: true,
      volume: "$89M",
      marketCap: "$248M",
      sparkline: [30, 35, 33, 40, 42, 45, 50, 55, 52, 58],
    },
    {
      symbol: "WLD",
      name: "Worldcoin",
      price: "$0.9347",
      change: "+5.99%",
      positive: true,
      volume: "$567M",
      marketCap: "$934M",
      sparkline: [25, 30, 28, 35, 38, 40, 45, 42, 48, 50],
    },
    {
      symbol: "DBR",
      name: "Debiru",
      price: "$0.01647",
      change: "+2.87%",
      positive: true,
      volume: "$45M",
      marketCap: "$165M",
      sparkline: [35, 38, 40, 42, 40, 44, 46, 45, 48, 50],
    },
    {
      symbol: "STRK",
      name: "Starknet",
      price: "$0.87",
      change: "-3.21%",
      positive: false,
      volume: "$234M",
      marketCap: "$870M",
      sparkline: [50, 48, 45, 42, 40, 38, 42, 40, 36, 35],
    },
    {
      symbol: "TIA",
      name: "Celestia",
      price: "$12.34",
      change: "+6.78%",
      positive: true,
      volume: "$412M",
      marketCap: "$3.1B",
      sparkline: [30, 35, 38, 42, 40, 48, 50, 55, 52, 58],
    },
  ],
  "Top Gainers": [
    {
      symbol: "PENGU",
      name: "Pengu",
      price: "$0.01207",
      change: "+12.4%",
      positive: true,
      volume: "$342M",
      marketCap: "$1.2B",
      sparkline: [20, 28, 35, 32, 40, 50, 48, 55, 60, 65],
    },
    {
      symbol: "SHFL",
      name: "Shuffle",
      price: "$0.2481",
      change: "+8.15%",
      positive: true,
      volume: "$89M",
      marketCap: "$248M",
      sparkline: [25, 32, 35, 40, 38, 45, 50, 55, 52, 60],
    },
    {
      symbol: "TIA",
      name: "Celestia",
      price: "$12.34",
      change: "+6.78%",
      positive: true,
      volume: "$412M",
      marketCap: "$3.1B",
      sparkline: [30, 35, 38, 42, 40, 48, 50, 55, 52, 58],
    },
    {
      symbol: "MATIC",
      name: "Polygon",
      price: "$0.8234",
      change: "+6.43%",
      positive: true,
      volume: "$654M",
      marketCap: "$8.2B",
      sparkline: [32, 36, 40, 38, 42, 48, 50, 52, 55, 58],
    },
    {
      symbol: "WLD",
      name: "Worldcoin",
      price: "$0.9347",
      change: "+5.99%",
      positive: true,
      volume: "$567M",
      marketCap: "$934M",
      sparkline: [28, 32, 35, 40, 38, 42, 48, 50, 52, 55],
    },
    {
      symbol: "SOL",
      name: "Solana",
      price: "$229.06",
      change: "+5.12%",
      positive: true,
      volume: "$4.8B",
      marketCap: "$108B",
      sparkline: [30, 35, 33, 40, 42, 45, 50, 48, 55, 58],
    },
  ],
  "Top Volume": [
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: "$96,591.70",
      change: "+2.43%",
      positive: true,
      volume: "$28.4B",
      marketCap: "$1.91T",
      sparkline: [40, 42, 38, 45, 50, 48, 55, 58, 54, 60],
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: "$4,473.92",
      change: "-0.32%",
      positive: false,
      volume: "$12.1B",
      marketCap: "$538B",
      sparkline: [50, 48, 52, 47, 45, 48, 44, 42, 46, 43],
    },
    {
      symbol: "SOL",
      name: "Solana",
      price: "$229.06",
      change: "+5.12%",
      positive: true,
      volume: "$4.8B",
      marketCap: "$108B",
      sparkline: [30, 35, 33, 40, 42, 45, 50, 48, 55, 58],
    },
    {
      symbol: "XRP",
      name: "Ripple",
      price: "$3.13",
      change: "-1.07%",
      positive: false,
      volume: "$3.2B",
      marketCap: "$178B",
      sparkline: [45, 42, 48, 44, 40, 38, 42, 39, 36, 38],
    },
    {
      symbol: "ADA",
      name: "Cardano",
      price: "$1.24",
      change: "+3.21%",
      positive: true,
      volume: "$1.9B",
      marketCap: "$43.7B",
      sparkline: [35, 38, 36, 40, 42, 45, 43, 48, 50, 52],
    },
    {
      symbol: "AVAX",
      name: "Avalanche",
      price: "$42.18",
      change: "+4.67%",
      positive: true,
      volume: "$890M",
      marketCap: "$17.2B",
      sparkline: [28, 32, 35, 38, 40, 42, 48, 50, 52, 55],
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
              href="/trade/CR7_USD"
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
