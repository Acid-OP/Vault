"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar/Navbar";

const timeframes = ["24h", "7d", "30d", "All Time"] as const;

const leaderboardData: Record<
  string,
  {
    symbol: string;
    name: string;
    emoji: string;
    price: string;
    change: string;
    positive: boolean;
    volume: string;
    rank: number;
  }[]
> = {
  "24h": [
    {
      rank: 1,
      symbol: "TRUMP",
      name: "Donald Trump",
      emoji: "🇺🇸",
      price: "$256.30",
      change: "+18.3%",
      positive: true,
      volume: "$78.4M",
    },
    {
      rank: 2,
      symbol: "DHONI",
      name: "MS Dhoni",
      emoji: "🚁",
      price: "$76.30",
      change: "+15.7%",
      positive: true,
      volume: "$19.8M",
    },
    {
      rank: 3,
      symbol: "CR7",
      name: "Cristiano Ronaldo",
      emoji: "⚽",
      price: "$142.80",
      change: "+14.2%",
      positive: true,
      volume: "$48.2M",
    },
    {
      rank: 4,
      symbol: "MBAPPE",
      name: "Kylian Mbappé",
      emoji: "⚡",
      price: "$94.60",
      change: "+13.2%",
      positive: true,
      volume: "$18.3M",
    },
    {
      rank: 5,
      symbol: "KANYE",
      name: "Kanye West",
      emoji: "🎵",
      price: "$52.10",
      change: "+12.1%",
      positive: true,
      volume: "$15.6M",
    },
    {
      rank: 6,
      symbol: "MRBEAST",
      name: "MrBeast",
      emoji: "🍫",
      price: "$67.40",
      change: "+11.4%",
      positive: true,
      volume: "$28.6M",
    },
    {
      rank: 7,
      symbol: "VIRAT",
      name: "Virat Kohli",
      emoji: "🏏",
      price: "$98.70",
      change: "+10.4%",
      positive: true,
      volume: "$24.3M",
    },
    {
      rank: 8,
      symbol: "LEBRON",
      name: "LeBron James",
      emoji: "🏀",
      price: "$112.70",
      change: "+9.5%",
      positive: true,
      volume: "$31.4M",
    },
    {
      rank: 9,
      symbol: "CONOR",
      name: "Conor McGregor",
      emoji: "🥊",
      price: "$45.20",
      change: "+9.1%",
      positive: true,
      volume: "$12.4M",
    },
    {
      rank: 10,
      symbol: "ELON",
      name: "Elon Musk",
      emoji: "🚀",
      price: "$387.50",
      change: "+8.7%",
      positive: true,
      volume: "$92.1M",
    },
  ],
  "7d": [
    {
      rank: 1,
      symbol: "ELON",
      name: "Elon Musk",
      emoji: "🚀",
      price: "$387.50",
      change: "+34.2%",
      positive: true,
      volume: "$644M",
    },
    {
      rank: 2,
      symbol: "CR7",
      name: "Cristiano Ronaldo",
      emoji: "⚽",
      price: "$142.80",
      change: "+28.6%",
      positive: true,
      volume: "$337M",
    },
    {
      rank: 3,
      symbol: "TRUMP",
      name: "Donald Trump",
      emoji: "🇺🇸",
      price: "$256.30",
      change: "+24.1%",
      positive: true,
      volume: "$548M",
    },
    {
      rank: 4,
      symbol: "MRBEAST",
      name: "MrBeast",
      emoji: "🍫",
      price: "$67.40",
      change: "+22.8%",
      positive: true,
      volume: "$200M",
    },
    {
      rank: 5,
      symbol: "DHONI",
      name: "MS Dhoni",
      emoji: "🚁",
      price: "$76.30",
      change: "+21.3%",
      positive: true,
      volume: "$138M",
    },
    {
      rank: 6,
      symbol: "VIRAT",
      name: "Virat Kohli",
      emoji: "🏏",
      price: "$98.70",
      change: "+19.7%",
      positive: true,
      volume: "$170M",
    },
    {
      rank: 7,
      symbol: "MBAPPE",
      name: "Kylian Mbappé",
      emoji: "⚡",
      price: "$94.60",
      change: "+18.4%",
      positive: true,
      volume: "$128M",
    },
    {
      rank: 8,
      symbol: "KANYE",
      name: "Kanye West",
      emoji: "🎵",
      price: "$52.10",
      change: "+16.9%",
      positive: true,
      volume: "$109M",
    },
    {
      rank: 9,
      symbol: "LEBRON",
      name: "LeBron James",
      emoji: "🏀",
      price: "$112.70",
      change: "+15.2%",
      positive: true,
      volume: "$219M",
    },
    {
      rank: 10,
      symbol: "BEYONCE",
      name: "Beyoncé",
      emoji: "👑",
      price: "$78.90",
      change: "+14.8%",
      positive: true,
      volume: "$120M",
    },
  ],
  "30d": [
    {
      rank: 1,
      symbol: "CR7",
      name: "Cristiano Ronaldo",
      emoji: "⚽",
      price: "$142.80",
      change: "+67.4%",
      positive: true,
      volume: "$1.44B",
    },
    {
      rank: 2,
      symbol: "TRUMP",
      name: "Donald Trump",
      emoji: "🇺🇸",
      price: "$256.30",
      change: "+58.2%",
      positive: true,
      volume: "$2.35B",
    },
    {
      rank: 3,
      symbol: "ELON",
      name: "Elon Musk",
      emoji: "🚀",
      price: "$387.50",
      change: "+52.8%",
      positive: true,
      volume: "$2.76B",
    },
    {
      rank: 4,
      symbol: "MESSI",
      name: "Lionel Messi",
      emoji: "🐐",
      price: "$128.40",
      change: "+48.1%",
      positive: true,
      volume: "$1.03B",
    },
    {
      rank: 5,
      symbol: "DHONI",
      name: "MS Dhoni",
      emoji: "🚁",
      price: "$76.30",
      change: "+45.6%",
      positive: true,
      volume: "$594M",
    },
    {
      rank: 6,
      symbol: "VIRAT",
      name: "Virat Kohli",
      emoji: "🏏",
      price: "$98.70",
      change: "+42.3%",
      positive: true,
      volume: "$728M",
    },
    {
      rank: 7,
      symbol: "MRBEAST",
      name: "MrBeast",
      emoji: "🍫",
      price: "$67.40",
      change: "+39.7%",
      positive: true,
      volume: "$858M",
    },
    {
      rank: 8,
      symbol: "MBAPPE",
      name: "Kylian Mbappé",
      emoji: "⚡",
      price: "$94.60",
      change: "+36.4%",
      positive: true,
      volume: "$549M",
    },
    {
      rank: 9,
      symbol: "LEBRON",
      name: "LeBron James",
      emoji: "🏀",
      price: "$112.70",
      change: "+33.8%",
      positive: true,
      volume: "$942M",
    },
    {
      rank: 10,
      symbol: "KANYE",
      name: "Kanye West",
      emoji: "🎵",
      price: "$52.10",
      change: "+31.2%",
      positive: true,
      volume: "$468M",
    },
  ],
  "All Time": [
    {
      rank: 1,
      symbol: "ELON",
      name: "Elon Musk",
      emoji: "🚀",
      price: "$387.50",
      change: "+287.5%",
      positive: true,
      volume: "$14.2B",
    },
    {
      rank: 2,
      symbol: "TRUMP",
      name: "Donald Trump",
      emoji: "🇺🇸",
      price: "$256.30",
      change: "+256.3%",
      positive: true,
      volume: "$12.8B",
    },
    {
      rank: 3,
      symbol: "CR7",
      name: "Cristiano Ronaldo",
      emoji: "⚽",
      price: "$142.80",
      change: "+142.8%",
      positive: true,
      volume: "$8.4B",
    },
    {
      rank: 4,
      symbol: "MESSI",
      name: "Lionel Messi",
      emoji: "🐐",
      price: "$128.40",
      change: "+128.4%",
      positive: true,
      volume: "$6.2B",
    },
    {
      rank: 5,
      symbol: "ZUCK",
      name: "Mark Zuckerberg",
      emoji: "👓",
      price: "$198.40",
      change: "+98.4%",
      positive: true,
      volume: "$5.8B",
    },
    {
      rank: 6,
      symbol: "LEBRON",
      name: "LeBron James",
      emoji: "🏀",
      price: "$112.70",
      change: "+92.7%",
      positive: true,
      volume: "$4.9B",
    },
    {
      rank: 7,
      symbol: "VIRAT",
      name: "Virat Kohli",
      emoji: "🏏",
      price: "$98.70",
      change: "+88.7%",
      positive: true,
      volume: "$3.7B",
    },
    {
      rank: 8,
      symbol: "MBAPPE",
      name: "Kylian Mbappé",
      emoji: "⚡",
      price: "$94.60",
      change: "+84.6%",
      positive: true,
      volume: "$3.2B",
    },
    {
      rank: 9,
      symbol: "TSWIFT",
      name: "Taylor Swift",
      emoji: "🎤",
      price: "$89.20",
      change: "+79.2%",
      positive: true,
      volume: "$2.9B",
    },
    {
      rank: 10,
      symbol: "BEYONCE",
      name: "Beyoncé",
      emoji: "👑",
      price: "$78.90",
      change: "+68.9%",
      positive: true,
      volume: "$2.4B",
    },
  ],
};

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<string>("24h");
  const data = leaderboardData[timeframe] || [];

  return (
    <div className="h-screen overflow-y-auto bg-[#0e0f14] scrollbar-none">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-heading)] text-[32px] text-[#eaecef] font-normal tracking-[-0.02em]">
            Leaderboard
          </h1>
          <p className="text-[#3d4354] text-[13px] mt-1">
            Top performing characters by price change.
          </p>
        </div>

        {/* Timeframe tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-[rgba(42,46,57,0.2)]">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2.5 text-[12px] font-medium transition-colors relative cursor-pointer ${
                timeframe === tf
                  ? "text-[#eaecef]"
                  : "text-[#3d4354] hover:text-[#848e9c]"
              }`}
            >
              {tf}
              {timeframe === tf && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f0b90b] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[40px_2fr_1fr_1fr_1fr] gap-4 px-4 py-2 text-[9px] text-[#3d4354] uppercase tracking-widest">
          <span>#</span>
          <span>Name</span>
          <span className="text-right">Price</span>
          <span className="text-right">Change</span>
          <span className="text-right">Volume</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[rgba(42,46,57,0.12)]">
          {data.map((m) => (
            <Link
              key={m.symbol}
              href={`/trade/${m.symbol}_USD`}
              className="grid grid-cols-[40px_2fr_1fr_1fr_1fr] gap-4 px-4 py-3.5 items-center hover:bg-[#13141c] transition-colors rounded-lg cursor-pointer group"
            >
              <span
                className={`text-[14px] font-mono tabular-nums font-bold ${
                  m.rank === 1
                    ? "text-[#f0b90b]"
                    : m.rank === 2
                      ? "text-[#848e9c]"
                      : m.rank === 3
                        ? "text-[#cd7f32]"
                        : "text-[#3d4354]"
                }`}
              >
                {m.rank}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[18px] w-8 text-center">{m.emoji}</span>
                <div>
                  <div className="text-[#eaecef] text-[13px] font-medium">
                    {m.name}
                  </div>
                  <div className="text-[#3d4354] text-[10px]">
                    {m.symbol}/USD
                  </div>
                </div>
              </div>
              <div className="text-[#eaecef] text-[13px] font-mono tabular-nums text-right">
                {m.price}
              </div>
              <div className="text-[#00c176] text-[13px] font-mono tabular-nums text-right font-medium">
                {m.change}
              </div>
              <div className="text-[#848e9c] text-[13px] font-mono tabular-nums text-right">
                {m.volume}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
