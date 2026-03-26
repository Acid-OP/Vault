"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar/Navbar";

const timeframes = ["24h", "7d", "30d", "All Time"] as const;

interface Entry {
  rank: number;
  symbol: string;
  name: string;
  emoji: string;
  price: string;
  change: number;
  volume: string;
  sparkline: number[];
  color: string;
}

const leaderboardData: Record<string, Entry[]> = {
  "24h": [
    {
      rank: 1,
      symbol: "TRUMP",
      name: "Donald Trump",
      emoji: "🇺🇸",
      price: "$256.30",
      change: 18.3,
      volume: "$78.4M",
      sparkline: [25, 30, 45, 40, 58, 55, 70, 65, 62, 80, 72, 92],
      color: "#ea3941",
    },
    {
      rank: 2,
      symbol: "DHONI",
      name: "MS Dhoni",
      emoji: "🚁",
      price: "$76.30",
      change: 15.7,
      volume: "$19.8M",
      sparkline: [22, 28, 32, 38, 42, 48, 55, 60, 58, 65, 68, 75],
      color: "#f0b90b",
    },
    {
      rank: 3,
      symbol: "CR7",
      name: "Cristiano Ronaldo",
      emoji: "⚽",
      price: "$142.80",
      change: 14.2,
      volume: "$48.2M",
      sparkline: [30, 35, 38, 42, 50, 48, 55, 60, 58, 68, 65, 72],
      color: "#ea3941",
    },
    {
      rank: 4,
      symbol: "MBAPPE",
      name: "Kylian Mbappé",
      emoji: "⚡",
      price: "$94.60",
      change: 13.2,
      volume: "$18.3M",
      sparkline: [20, 28, 35, 40, 45, 50, 55, 58, 62, 68, 65, 72],
      color: "#3b82f6",
    },
    {
      rank: 5,
      symbol: "KANYE",
      name: "Kanye West",
      emoji: "🎵",
      price: "$52.10",
      change: 12.1,
      volume: "$15.6M",
      sparkline: [28, 32, 35, 40, 38, 45, 50, 55, 52, 60, 58, 65],
      color: "#3b82f6",
    },
    {
      rank: 6,
      symbol: "MRBEAST",
      name: "MrBeast",
      emoji: "🍫",
      price: "$67.40",
      change: 11.4,
      volume: "$28.6M",
      sparkline: [28, 32, 35, 40, 38, 45, 50, 55, 58, 62, 60, 68],
      color: "#3b82f6",
    },
    {
      rank: 7,
      symbol: "VIRAT",
      name: "Virat Kohli",
      emoji: "🏏",
      price: "$98.70",
      change: 10.4,
      volume: "$24.3M",
      sparkline: [32, 36, 40, 42, 48, 50, 52, 56, 58, 62, 60, 65],
      color: "#ea3941",
    },
    {
      rank: 8,
      symbol: "LEBRON",
      name: "LeBron James",
      emoji: "🏀",
      price: "$112.70",
      change: 9.5,
      volume: "$31.4M",
      sparkline: [35, 40, 42, 48, 50, 52, 55, 58, 60, 64, 62, 68],
      color: "#f0b90b",
    },
    {
      rank: 9,
      symbol: "CONOR",
      name: "Conor McGregor",
      emoji: "🥊",
      price: "$45.20",
      change: 9.1,
      volume: "$12.4M",
      sparkline: [30, 35, 38, 42, 40, 48, 50, 55, 52, 58, 56, 62],
      color: "#3b82f6",
    },
    {
      rank: 10,
      symbol: "ELON",
      name: "Elon Musk",
      emoji: "🚀",
      price: "$387.50",
      change: 8.7,
      volume: "$92.1M",
      sparkline: [40, 55, 42, 60, 55, 52, 68, 62, 60, 75, 70, 72],
      color: "#3b82f6",
    },
  ],
  "7d": [
    {
      rank: 1,
      symbol: "ELON",
      name: "Elon Musk",
      emoji: "🚀",
      price: "$387.50",
      change: 34.2,
      volume: "$644M",
      sparkline: [30, 35, 42, 50, 55, 62, 58, 70, 75, 80, 78, 88],
      color: "#3b82f6",
    },
    {
      rank: 2,
      symbol: "CR7",
      name: "Cristiano Ronaldo",
      emoji: "⚽",
      price: "$142.80",
      change: 28.6,
      volume: "$337M",
      sparkline: [25, 30, 35, 42, 48, 55, 52, 60, 65, 70, 68, 75],
      color: "#ea3941",
    },
    {
      rank: 3,
      symbol: "TRUMP",
      name: "Donald Trump",
      emoji: "🇺🇸",
      price: "$256.30",
      change: 24.1,
      volume: "$548M",
      sparkline: [30, 38, 42, 50, 48, 58, 55, 65, 60, 70, 68, 78],
      color: "#ea3941",
    },
    {
      rank: 4,
      symbol: "MRBEAST",
      name: "MrBeast",
      emoji: "🍫",
      price: "$67.40",
      change: 22.8,
      volume: "$200M",
      sparkline: [22, 28, 35, 40, 45, 50, 48, 58, 55, 62, 60, 68],
      color: "#3b82f6",
    },
    {
      rank: 5,
      symbol: "DHONI",
      name: "MS Dhoni",
      emoji: "🚁",
      price: "$76.30",
      change: 21.3,
      volume: "$138M",
      sparkline: [20, 26, 32, 38, 42, 48, 45, 55, 52, 60, 58, 65],
      color: "#f0b90b",
    },
    {
      rank: 6,
      symbol: "VIRAT",
      name: "Virat Kohli",
      emoji: "🏏",
      price: "$98.70",
      change: 19.7,
      volume: "$170M",
      sparkline: [28, 34, 38, 44, 48, 52, 50, 58, 56, 62, 60, 66],
      color: "#ea3941",
    },
    {
      rank: 7,
      symbol: "MBAPPE",
      name: "Kylian Mbappé",
      emoji: "⚡",
      price: "$94.60",
      change: 18.4,
      volume: "$128M",
      sparkline: [25, 30, 36, 42, 46, 50, 48, 56, 54, 60, 58, 64],
      color: "#3b82f6",
    },
    {
      rank: 8,
      symbol: "KANYE",
      name: "Kanye West",
      emoji: "🎵",
      price: "$52.10",
      change: 16.9,
      volume: "$109M",
      sparkline: [22, 28, 34, 38, 42, 48, 46, 54, 52, 58, 56, 62],
      color: "#3b82f6",
    },
    {
      rank: 9,
      symbol: "LEBRON",
      name: "LeBron James",
      emoji: "🏀",
      price: "$112.70",
      change: 15.2,
      volume: "$219M",
      sparkline: [30, 35, 40, 45, 48, 52, 50, 56, 54, 60, 58, 63],
      color: "#f0b90b",
    },
    {
      rank: 10,
      symbol: "BEYONCE",
      name: "Beyoncé",
      emoji: "👑",
      price: "$78.90",
      change: 14.8,
      volume: "$120M",
      sparkline: [28, 33, 38, 42, 46, 50, 48, 54, 52, 58, 56, 62],
      color: "#ea3941",
    },
  ],
  "30d": [
    {
      rank: 1,
      symbol: "CR7",
      name: "Cristiano Ronaldo",
      emoji: "⚽",
      price: "$142.80",
      change: 67.4,
      volume: "$1.44B",
      sparkline: [15, 22, 30, 38, 45, 52, 58, 62, 68, 72, 78, 85],
      color: "#ea3941",
    },
    {
      rank: 2,
      symbol: "TRUMP",
      name: "Donald Trump",
      emoji: "🇺🇸",
      price: "$256.30",
      change: 58.2,
      volume: "$2.35B",
      sparkline: [18, 25, 32, 40, 48, 55, 50, 62, 58, 70, 75, 82],
      color: "#ea3941",
    },
    {
      rank: 3,
      symbol: "ELON",
      name: "Elon Musk",
      emoji: "🚀",
      price: "$387.50",
      change: 52.8,
      volume: "$2.76B",
      sparkline: [20, 28, 35, 42, 48, 55, 60, 58, 65, 70, 68, 78],
      color: "#3b82f6",
    },
    {
      rank: 4,
      symbol: "MESSI",
      name: "Lionel Messi",
      emoji: "🐐",
      price: "$128.40",
      change: 48.1,
      volume: "$1.03B",
      sparkline: [22, 28, 34, 40, 45, 50, 55, 58, 62, 66, 68, 72],
      color: "#f0b90b",
    },
    {
      rank: 5,
      symbol: "DHONI",
      name: "MS Dhoni",
      emoji: "🚁",
      price: "$76.30",
      change: 45.6,
      volume: "$594M",
      sparkline: [18, 24, 30, 36, 42, 48, 52, 56, 60, 64, 66, 70],
      color: "#f0b90b",
    },
    {
      rank: 6,
      symbol: "VIRAT",
      name: "Virat Kohli",
      emoji: "🏏",
      price: "$98.70",
      change: 42.3,
      volume: "$728M",
      sparkline: [20, 26, 32, 38, 44, 48, 52, 56, 60, 62, 64, 68],
      color: "#ea3941",
    },
    {
      rank: 7,
      symbol: "MRBEAST",
      name: "MrBeast",
      emoji: "🍫",
      price: "$67.40",
      change: 39.7,
      volume: "$858M",
      sparkline: [18, 24, 30, 35, 40, 45, 50, 54, 58, 60, 62, 66],
      color: "#3b82f6",
    },
    {
      rank: 8,
      symbol: "MBAPPE",
      name: "Kylian Mbappé",
      emoji: "⚡",
      price: "$94.60",
      change: 36.4,
      volume: "$549M",
      sparkline: [22, 28, 33, 38, 42, 46, 50, 54, 56, 60, 62, 65],
      color: "#3b82f6",
    },
    {
      rank: 9,
      symbol: "LEBRON",
      name: "LeBron James",
      emoji: "🏀",
      price: "$112.70",
      change: 33.8,
      volume: "$942M",
      sparkline: [24, 30, 35, 40, 44, 48, 52, 55, 58, 60, 62, 65],
      color: "#f0b90b",
    },
    {
      rank: 10,
      symbol: "KANYE",
      name: "Kanye West",
      emoji: "🎵",
      price: "$52.10",
      change: 31.2,
      volume: "$468M",
      sparkline: [20, 26, 31, 36, 40, 44, 48, 52, 54, 58, 60, 63],
      color: "#3b82f6",
    },
  ],
  "All Time": [
    {
      rank: 1,
      symbol: "ELON",
      name: "Elon Musk",
      emoji: "🚀",
      price: "$387.50",
      change: 287.5,
      volume: "$14.2B",
      sparkline: [5, 12, 20, 30, 42, 55, 48, 62, 70, 78, 82, 92],
      color: "#3b82f6",
    },
    {
      rank: 2,
      symbol: "TRUMP",
      name: "Donald Trump",
      emoji: "🇺🇸",
      price: "$256.30",
      change: 256.3,
      volume: "$12.8B",
      sparkline: [8, 15, 22, 35, 45, 50, 58, 55, 68, 72, 78, 88],
      color: "#ea3941",
    },
    {
      rank: 3,
      symbol: "CR7",
      name: "Cristiano Ronaldo",
      emoji: "⚽",
      price: "$142.80",
      change: 142.8,
      volume: "$8.4B",
      sparkline: [10, 18, 25, 32, 40, 48, 55, 60, 65, 70, 75, 82],
      color: "#ea3941",
    },
    {
      rank: 4,
      symbol: "MESSI",
      name: "Lionel Messi",
      emoji: "🐐",
      price: "$128.40",
      change: 128.4,
      volume: "$6.2B",
      sparkline: [12, 20, 28, 35, 42, 48, 54, 58, 62, 66, 70, 76],
      color: "#f0b90b",
    },
    {
      rank: 5,
      symbol: "ZUCK",
      name: "Mark Zuckerberg",
      emoji: "👓",
      price: "$198.40",
      change: 98.4,
      volume: "$5.8B",
      sparkline: [15, 22, 28, 34, 40, 46, 50, 54, 58, 62, 65, 72],
      color: "#3b82f6",
    },
    {
      rank: 6,
      symbol: "LEBRON",
      name: "LeBron James",
      emoji: "🏀",
      price: "$112.70",
      change: 92.7,
      volume: "$4.9B",
      sparkline: [14, 20, 26, 32, 38, 44, 48, 52, 56, 60, 63, 68],
      color: "#f0b90b",
    },
    {
      rank: 7,
      symbol: "VIRAT",
      name: "Virat Kohli",
      emoji: "🏏",
      price: "$98.70",
      change: 88.7,
      volume: "$3.7B",
      sparkline: [12, 18, 24, 30, 36, 42, 46, 50, 54, 58, 62, 66],
      color: "#ea3941",
    },
    {
      rank: 8,
      symbol: "MBAPPE",
      name: "Kylian Mbappé",
      emoji: "⚡",
      price: "$94.60",
      change: 84.6,
      volume: "$3.2B",
      sparkline: [10, 16, 22, 28, 34, 40, 44, 48, 52, 56, 60, 64],
      color: "#3b82f6",
    },
    {
      rank: 9,
      symbol: "TSWIFT",
      name: "Taylor Swift",
      emoji: "🎤",
      price: "$89.20",
      change: 79.2,
      volume: "$2.9B",
      sparkline: [12, 18, 24, 30, 35, 40, 44, 48, 52, 55, 58, 62],
      color: "#f0b90b",
    },
    {
      rank: 10,
      symbol: "BEYONCE",
      name: "Beyoncé",
      emoji: "👑",
      price: "$78.90",
      change: 68.9,
      volume: "$2.4B",
      sparkline: [14, 20, 25, 30, 35, 40, 44, 48, 50, 54, 58, 62],
      color: "#ea3941",
    },
  ],
};

const medals = ["🥇", "🥈", "🥉"];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100,
    h = 32;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");
  const area = `0,${h} ${points} ${w},${h}`;
  const gid = `lb-${color.replace("#", "")}`;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="w-full"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gid})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChangeBar({ change, max }: { change: number; max: number }) {
  const pct = Math.min((change / max) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#00c176] text-[13px] font-[family-name:var(--font-geist-mono)] tabular-nums font-medium w-[70px] text-right">
        +{change.toFixed(1)}%
      </span>
      <div className="flex-1 h-[6px] rounded-full bg-[rgba(42,46,57,0.15)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#00c176]/60 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<string>("24h");
  const data = leaderboardData[timeframe] || [];
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);
  const maxChange = data[0]?.change || 1;

  return (
    <div className="h-screen overflow-y-auto bg-[#0e0f14] scrollbar-none">
      <Navbar />

      {/* ── Header ─────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-[rgba(42,46,57,0.15)]">
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute top-0 left-[30%] w-[400px] h-[250px] rounded-full bg-[#f0b90b]/[0.03] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-[20%] w-[300px] h-[200px] rounded-full bg-[#ea3941]/[0.02] blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 relative">
          <p className="text-[#f0b90b] text-[12px] font-medium uppercase tracking-widest mb-3">
            Rankings
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-[36px] sm:text-[44px] text-[#eaecef] font-normal tracking-[-0.02em] leading-[1.1] mb-3">
            Leaderboard
          </h1>
          <p className="text-[#5d6478] text-[14px] max-w-md">
            Top performing personalities ranked by price change. Who&apos;s
            winning?
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Timeframe pills ──────────────────────── */}
        <div className="flex items-center gap-2 mb-10">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 cursor-pointer border ${
                timeframe === tf
                  ? "bg-[#eaecef] text-[#0e0f14] border-transparent"
                  : "border-[rgba(42,46,57,0.2)] text-[#5d6478] hover:border-[rgba(42,46,57,0.4)] hover:text-[#848e9c]"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* ── Podium: top 3 ────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {top3.map((m, i) => (
            <Link
              key={m.symbol}
              href={`/trade/${m.symbol}_USD`}
              className="group relative p-6 rounded-2xl glass-card glass-card-hover transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
            >
              {/* Top glow for #1 */}
              {i === 0 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-px bg-gradient-to-r from-transparent via-[#f0b90b]/50 to-transparent" />
              )}

              <div className="flex items-center justify-between mb-4">
                <span className="text-[28px]">{medals[i]}</span>
                <span
                  className="text-[11px] font-[family-name:var(--font-geist-mono)] font-semibold px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: `${m.color}15`, color: m.color }}
                >
                  #{m.rank}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-[24px]"
                  style={{ backgroundColor: `${m.color}12` }}
                >
                  {m.emoji}
                </div>
                <div>
                  <div className="text-[#eaecef] text-[16px] font-semibold group-hover:text-white transition-colors">
                    {m.symbol}
                  </div>
                  <div className="text-[#5d6478] text-[12px]">{m.name}</div>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-[#eaecef] text-[24px] font-[family-name:var(--font-geist-mono)] font-bold">
                  {m.price}
                </span>
                <span className="text-[#00c176] text-[13px] font-[family-name:var(--font-geist-mono)] font-medium">
                  +{m.change.toFixed(1)}%
                </span>
              </div>

              <div className="-mx-1 mb-3">
                <Sparkline data={m.sparkline} color={m.color} />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#5d6478]">
                <span>
                  Vol{" "}
                  <span className="text-[#848e9c] font-[family-name:var(--font-geist-mono)]">
                    {m.volume}
                  </span>
                </span>
              </div>

              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundColor: m.color }}
              />
            </Link>
          ))}
        </div>

        {/* ── Rest of rankings ─────────────────────── */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[48px_2fr_1fr_minmax(180px,1.5fr)_1fr_100px] gap-4 px-6 py-3 text-[10px] text-[#5d6478] uppercase tracking-widest border-b border-[rgba(42,46,57,0.12)]">
            <span>#</span>
            <span>Name</span>
            <span className="text-right">Price</span>
            <span>Change</span>
            <span className="text-right">Volume</span>
            <span className="text-right">7d</span>
          </div>

          {rest.map((m) => (
            <Link
              key={m.symbol}
              href={`/trade/${m.symbol}_USD`}
              className="grid grid-cols-[48px_2fr_1fr_minmax(180px,1.5fr)_1fr_100px] gap-4 px-6 py-4 items-center hover:bg-[rgba(19,20,28,0.4)] transition-all duration-300 cursor-pointer group border-b border-[rgba(42,46,57,0.06)] last:border-b-0"
            >
              <span className="text-[#5d6478] text-[14px] font-[family-name:var(--font-geist-mono)] font-bold">
                {m.rank}
              </span>

              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[16px] shrink-0 group-hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: `${m.color}12` }}
                >
                  {m.emoji}
                </div>
                <div>
                  <span className="text-[#eaecef] text-[13px] font-semibold group-hover:text-white transition-colors">
                    {m.name}
                  </span>
                  <div className="text-[#5d6478] text-[11px]">
                    {m.symbol}/USD
                  </div>
                </div>
              </div>

              <div className="text-[#eaecef] text-[13px] font-[family-name:var(--font-geist-mono)] tabular-nums text-right">
                {m.price}
              </div>

              <ChangeBar change={m.change} max={maxChange} />

              <div className="text-[#848e9c] text-[13px] font-[family-name:var(--font-geist-mono)] tabular-nums text-right">
                {m.volume}
              </div>

              <div className="flex justify-end">
                <Sparkline data={m.sparkline} color="#00c176" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
