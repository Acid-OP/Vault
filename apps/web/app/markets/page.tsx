"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import Navbar from "../../components/Navbar/Navbar";

/* ── Data ─────────────────────────────────────────── */

interface Market {
  symbol: string;
  name: string;
  emoji: string;
  price: number;
  change: number;
  volume: string;
  volumeNum: number;
  marketCap: string;
  category: string;
  sparkline: number[];
  color: string;
}

const allMarkets: Market[] = [
  {
    symbol: "CR7",
    name: "Cristiano Ronaldo",
    emoji: "⚽",
    price: 142.8,
    change: 14.2,
    volume: "$48.2M",
    volumeNum: 48.2,
    marketCap: "$1.42B",
    category: "Athletes",
    sparkline: [30, 35, 38, 42, 50, 48, 55, 60, 58, 68, 65, 72],
    color: "#ea3941",
  },
  {
    symbol: "ELON",
    name: "Elon Musk",
    emoji: "🚀",
    price: 387.5,
    change: 8.7,
    volume: "$92.1M",
    volumeNum: 92.1,
    marketCap: "$3.87B",
    category: "Tech",
    sparkline: [40, 55, 42, 60, 55, 52, 68, 62, 60, 75, 70, 72],
    color: "#3b82f6",
  },
  {
    symbol: "MESSI",
    name: "Lionel Messi",
    emoji: "🐐",
    price: 128.4,
    change: 6.9,
    volume: "$34.5M",
    volumeNum: 34.5,
    marketCap: "$1.28B",
    category: "Athletes",
    sparkline: [35, 38, 40, 42, 45, 48, 50, 52, 55, 57, 58, 62],
    color: "#f0b90b",
  },
  {
    symbol: "TRUMP",
    name: "Donald Trump",
    emoji: "🇺🇸",
    price: 256.3,
    change: 18.3,
    volume: "$78.4M",
    volumeNum: 78.4,
    marketCap: "$2.56B",
    category: "Politics",
    sparkline: [25, 30, 45, 40, 58, 55, 70, 65, 62, 80, 72, 92],
    color: "#ea3941",
  },
  {
    symbol: "TSWIFT",
    name: "Taylor Swift",
    emoji: "🎤",
    price: 89.2,
    change: -2.1,
    volume: "$21.8M",
    volumeNum: 21.8,
    marketCap: "$892M",
    category: "Music",
    sparkline: [55, 52, 50, 48, 45, 47, 44, 42, 45, 43, 40, 42],
    color: "#f0b90b",
  },
  {
    symbol: "MRBEAST",
    name: "MrBeast",
    emoji: "🍫",
    price: 67.4,
    change: 11.4,
    volume: "$28.6M",
    volumeNum: 28.6,
    marketCap: "$674M",
    category: "Creators",
    sparkline: [28, 32, 35, 40, 38, 45, 50, 55, 58, 62, 60, 68],
    color: "#3b82f6",
  },
  {
    symbol: "DRAKE",
    name: "Drake",
    emoji: "🦉",
    price: 54.3,
    change: 2.3,
    volume: "$15.2M",
    volumeNum: 15.2,
    marketCap: "$543M",
    category: "Music",
    sparkline: [42, 44, 43, 46, 48, 47, 50, 49, 52, 51, 53, 54],
    color: "#ea3941",
  },
  {
    symbol: "LEBRON",
    name: "LeBron James",
    emoji: "🏀",
    price: 112.7,
    change: 9.5,
    volume: "$31.4M",
    volumeNum: 31.4,
    marketCap: "$1.12B",
    category: "Athletes",
    sparkline: [35, 40, 42, 48, 50, 52, 55, 58, 60, 64, 62, 68],
    color: "#f0b90b",
  },
  {
    symbol: "KANYE",
    name: "Kanye West",
    emoji: "🎵",
    price: 52.1,
    change: 12.1,
    volume: "$15.6M",
    volumeNum: 15.6,
    marketCap: "$521M",
    category: "Music",
    sparkline: [28, 32, 35, 40, 38, 45, 50, 55, 52, 60, 58, 65],
    color: "#3b82f6",
  },
  {
    symbol: "VIRAT",
    name: "Virat Kohli",
    emoji: "🏏",
    price: 98.7,
    change: 10.4,
    volume: "$24.3M",
    volumeNum: 24.3,
    marketCap: "$987M",
    category: "Athletes",
    sparkline: [32, 36, 40, 42, 48, 50, 52, 56, 58, 62, 60, 65],
    color: "#ea3941",
  },
  {
    symbol: "DHONI",
    name: "MS Dhoni",
    emoji: "🚁",
    price: 76.3,
    change: 15.7,
    volume: "$19.8M",
    volumeNum: 19.8,
    marketCap: "$763M",
    category: "Athletes",
    sparkline: [22, 28, 32, 38, 42, 48, 55, 60, 58, 65, 68, 75],
    color: "#f0b90b",
  },
  {
    symbol: "MBAPPE",
    name: "Kylian Mbappé",
    emoji: "⚡",
    price: 94.6,
    change: 13.2,
    volume: "$18.3M",
    volumeNum: 18.3,
    marketCap: "$946M",
    category: "Athletes",
    sparkline: [20, 28, 35, 40, 45, 50, 55, 58, 62, 68, 65, 72],
    color: "#3b82f6",
  },
  {
    symbol: "HAALAND",
    name: "Erling Haaland",
    emoji: "🤖",
    price: 108.5,
    change: 6.3,
    volume: "$22.1M",
    volumeNum: 22.1,
    marketCap: "$1.08B",
    category: "Athletes",
    sparkline: [32, 36, 40, 42, 45, 48, 50, 54, 56, 58, 57, 60],
    color: "#ea3941",
  },
  {
    symbol: "NEYMAR",
    name: "Neymar Jr",
    emoji: "🇧🇷",
    price: 62.4,
    change: -3.8,
    volume: "$14.7M",
    volumeNum: 14.7,
    marketCap: "$624M",
    category: "Athletes",
    sparkline: [58, 55, 52, 50, 48, 50, 46, 44, 42, 40, 42, 38],
    color: "#f0b90b",
  },
  {
    symbol: "BEYONCE",
    name: "Beyoncé",
    emoji: "👑",
    price: 78.9,
    change: 7.6,
    volume: "$17.2M",
    volumeNum: 17.2,
    marketCap: "$789M",
    category: "Music",
    sparkline: [35, 38, 42, 44, 48, 50, 52, 56, 54, 58, 60, 62],
    color: "#ea3941",
  },
  {
    symbol: "CONOR",
    name: "Conor McGregor",
    emoji: "🥊",
    price: 45.2,
    change: 9.1,
    volume: "$12.4M",
    volumeNum: 12.4,
    marketCap: "$452M",
    category: "Athletes",
    sparkline: [30, 35, 38, 42, 40, 48, 50, 55, 52, 58, 56, 62],
    color: "#3b82f6",
  },
  {
    symbol: "ZUCK",
    name: "Mark Zuckerberg",
    emoji: "👓",
    price: 198.4,
    change: 3.9,
    volume: "$42.8M",
    volumeNum: 42.8,
    marketCap: "$1.98B",
    category: "Tech",
    sparkline: [48, 50, 52, 54, 53, 56, 55, 58, 57, 60, 59, 62],
    color: "#3b82f6",
  },
  {
    symbol: "PEWDS",
    name: "PewDiePie",
    emoji: "📹",
    price: 18.6,
    change: 5.6,
    volume: "$6.3M",
    volumeNum: 6.3,
    marketCap: "$186M",
    category: "Creators",
    sparkline: [30, 33, 35, 38, 40, 42, 44, 46, 45, 48, 50, 52],
    color: "#f0b90b",
  },
  {
    symbol: "POKIMANE",
    name: "Pokimane",
    emoji: "🎮",
    price: 12.8,
    change: 8.1,
    volume: "$4.2M",
    volumeNum: 4.2,
    marketCap: "$128M",
    category: "Creators",
    sparkline: [20, 24, 28, 30, 32, 36, 38, 40, 42, 45, 44, 48],
    color: "#ea3941",
  },
  {
    symbol: "RIHANNA",
    name: "Rihanna",
    emoji: "💎",
    price: 71.3,
    change: 4.8,
    volume: "$16.1M",
    volumeNum: 16.1,
    marketCap: "$713M",
    category: "Music",
    sparkline: [38, 40, 42, 44, 43, 46, 48, 47, 50, 52, 51, 54],
    color: "#3b82f6",
  },
  {
    symbol: "NINJA",
    name: "Ninja",
    emoji: "🎯",
    price: 9.4,
    change: -1.2,
    volume: "$2.8M",
    volumeNum: 2.8,
    marketCap: "$94M",
    category: "Creators",
    sparkline: [32, 30, 28, 30, 28, 26, 28, 26, 24, 26, 25, 24],
    color: "#f0b90b",
  },
  {
    symbol: "OPRAH",
    name: "Oprah Winfrey",
    emoji: "📺",
    price: 134.2,
    change: 4.5,
    volume: "$22.6M",
    volumeNum: 22.6,
    marketCap: "$1.34B",
    category: "Creators",
    sparkline: [42, 44, 46, 48, 47, 50, 52, 54, 53, 56, 55, 58],
    color: "#ea3941",
  },
  {
    symbol: "LOGAN",
    name: "Logan Paul",
    emoji: "🥤",
    price: 8.4,
    change: -4.2,
    volume: "$3.1M",
    volumeNum: 3.1,
    marketCap: "$84M",
    category: "Creators",
    sparkline: [48, 45, 42, 40, 38, 40, 36, 34, 36, 32, 30, 28],
    color: "#3b82f6",
  },
  {
    symbol: "BILLIE",
    name: "Billie Eilish",
    emoji: "🖤",
    price: 34.7,
    change: 3.7,
    volume: "$8.9M",
    volumeNum: 8.9,
    marketCap: "$347M",
    category: "Music",
    sparkline: [30, 32, 34, 36, 35, 38, 40, 39, 42, 44, 43, 46],
    color: "#f0b90b",
  },
];

const categories = [
  "All",
  "Athletes",
  "Creators",
  "Music",
  "Tech",
  "Politics",
] as const;

type SortKey = "name" | "price" | "change" | "volume";

const categoryColors: Record<string, string> = {
  Athletes: "#ea3941",
  Creators: "#3b82f6",
  Music: "#f0b90b",
  Tech: "#3b82f6",
  Politics: "#ea3941",
};

/* ── Sparkline ────────────────────────────────────── */

function Sparkline({
  data,
  color,
  w = 120,
  h = 40,
}: {
  data: number[];
  color: string;
  w?: number;
  h?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");
  const area = `0,${h} ${points} ${w},${h}`;
  const gradId = `sg-${color.replace("#", "")}`;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="w-full"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradId})`} />
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

/* ── View toggle icons ────────────────────────────── */

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke={active ? "#eaecef" : "#5d6478"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="1" width="5.5" height="5.5" rx="1" />
      <rect x="9.5" y="1" width="5.5" height="5.5" rx="1" />
      <rect x="1" y="9.5" width="5.5" height="5.5" rx="1" />
      <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1" />
    </svg>
  );
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke={active ? "#eaecef" : "#5d6478"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 3h14M1 8h14M1 13h14" />
    </svg>
  );
}

/* ── Page ──────────────────────────────────────────── */

const PER_PAGE_OPTIONS = [8, 12, 20, 0] as const;

export default function MarketsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("volume");
  const [sortAsc, setSortAsc] = useState(false);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(12);

  const filtered = useMemo(() => {
    const list = allMarkets.filter((m) => {
      const matchCat =
        activeCategory === "All" || m.category === activeCategory;
      const matchSearch =
        !search ||
        m.symbol.toLowerCase().includes(search.toLowerCase()) ||
        m.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });

    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = a.name.localeCompare(b.name);
      else if (sortBy === "price") cmp = a.price - b.price;
      else if (sortBy === "change") cmp = a.change - b.change;
      else cmp = a.volumeNum - b.volumeNum;
      return sortAsc ? cmp : -cmp;
    });

    return list;
  }, [activeCategory, search, sortBy, sortAsc]);

  const totalPages =
    perPage === 0 ? 1 : Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged =
    perPage === 0
      ? filtered
      : filtered.slice((safePage - 1) * perPage, safePage * perPage);

  function resetPage() {
    setPage(1);
  }

  const totalVolume = allMarkets.reduce((s, m) => s + m.volumeNum, 0);
  const topGainer = allMarkets.reduce(
    (best, m) => (m.change > best.change ? m : best),
    allMarkets[0]!,
  );

  function handleSort(key: SortKey) {
    if (sortBy === key) setSortAsc(!sortAsc);
    else {
      setSortBy(key);
      setSortAsc(false);
    }
    resetPage();
  }

  const sortArrow = (key: SortKey) =>
    sortBy === key ? (sortAsc ? " ↑" : " ↓") : "";

  return (
    <div className="h-screen overflow-y-auto bg-[#0e0f14] scrollbar-none">
      <Navbar />

      {/* ── Header ────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-[rgba(42,46,57,0.15)]">
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute top-0 right-[20%] w-[400px] h-[250px] rounded-full bg-[#f0b90b]/[0.02] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-[30%] w-[300px] h-[200px] rounded-full bg-[#3b82f6]/[0.02] blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 relative">
          <p className="text-[#f0b90b] text-[12px] font-medium uppercase tracking-widest mb-3">
            Explore
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-[36px] sm:text-[44px] text-[#eaecef] font-normal tracking-[-0.02em] leading-[1.1] mb-3">
            All Markets
          </h1>
          <p className="text-[#5d6478] text-[14px] max-w-md mb-8">
            {allMarkets.length} personalities available to trade. Pick your
            favorites and ride the chart.
          </p>

          {/* Stats strip */}
          <div className="flex items-center gap-8">
            {[
              { label: "Total Markets", value: String(allMarkets.length) },
              { label: "24h Volume", value: `$${totalVolume.toFixed(1)}M` },
              {
                label: "Top Gainer",
                value: `${topGainer.emoji} ${topGainer.symbol} +${topGainer.change}%`,
              },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-[#eaecef] text-[14px] font-[family-name:var(--font-geist-mono)] font-semibold">
                  {s.value}
                </span>
                <span className="text-[#5d6478] text-[11px] uppercase tracking-widest">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Controls bar ──────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg
              className="w-4 h-4 text-[#5d6478] absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search markets..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              className="w-full bg-[#13141c]/60 backdrop-blur-sm text-[#eaecef] placeholder:text-[#3d4354] rounded-xl px-4 py-2.5 pl-10 text-[13px] border border-[rgba(42,46,57,0.2)] focus:outline-none focus:border-[rgba(42,46,57,0.5)] transition-colors"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 text-[12px] text-[#5d6478]">
            <span>Sort:</span>
            {(["volume", "change", "price", "name"] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => handleSort(key)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer capitalize ${
                  sortBy === key
                    ? "bg-[#1c1e2c] text-[#eaecef]"
                    : "hover:bg-[#13141c] text-[#5d6478] hover:text-[#848e9c]"
                }`}
              >
                {key}
                {sortArrow(key)}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${view === "grid" ? "bg-[#1c1e2c]" : "hover:bg-[#13141c]"}`}
            >
              <GridIcon active={view === "grid"} />
            </button>
            <button
              onClick={() => setView("table")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${view === "table" ? "bg-[#1c1e2c]" : "hover:bg-[#13141c]"}`}
            >
              <ListIcon active={view === "table"} />
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {categories.map((cat) => {
            const active = activeCategory === cat;
            const color =
              cat === "All" ? "#eaecef" : categoryColors[cat] || "#eaecef";
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  resetPage();
                }}
                className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 cursor-pointer border ${
                  active
                    ? "text-[#0e0f14] border-transparent"
                    : "border-[rgba(42,46,57,0.2)] text-[#5d6478] hover:border-[rgba(42,46,57,0.4)] hover:text-[#848e9c]"
                }`}
                style={
                  active
                    ? {
                        backgroundColor: color,
                        color:
                          cat === "All"
                            ? "#0e0f14"
                            : ["#f0b90b", "#3b82f6"].includes(color)
                              ? "#0e0f14"
                              : "#fff",
                      }
                    : undefined
                }
              >
                {cat}
                {cat !== "All" && (
                  <span className="ml-1.5 opacity-60">
                    {allMarkets.filter((m) => m.category === cat).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Grid view ───────────────────────────── */}
        {view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paged.map((m) => (
              <Link
                key={m.symbol}
                href={`/trade/${m.symbol}_USD`}
                className="group relative p-5 rounded-2xl glass-card glass-card-hover transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
              >
                {/* Header row */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-[20px]"
                    style={{ backgroundColor: `${m.color}12` }}
                  >
                    {m.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[#eaecef] text-[14px] font-semibold group-hover:text-white transition-colors">
                        {m.symbol}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                        style={{
                          backgroundColor: `${categoryColors[m.category] || "#5d6478"}12`,
                          color: categoryColors[m.category] || "#5d6478",
                        }}
                      >
                        {m.category}
                      </span>
                    </div>
                    <span className="text-[#5d6478] text-[11px] truncate block">
                      {m.name}
                    </span>
                  </div>
                </div>

                {/* Price + change */}
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-[#eaecef] text-[22px] font-[family-name:var(--font-geist-mono)] font-bold">
                    ${m.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-[12px] font-[family-name:var(--font-geist-mono)] font-medium ${
                      m.change >= 0 ? "text-[#00c176]" : "text-[#ea3941]"
                    }`}
                  >
                    {m.change >= 0 ? "+" : ""}
                    {m.change.toFixed(1)}%
                  </span>
                </div>

                {/* Chart */}
                <div className="-mx-1 mb-3">
                  <Sparkline
                    data={m.sparkline}
                    color={m.change >= 0 ? "#00c176" : "#ea3941"}
                    h={48}
                  />
                </div>

                {/* Footer stats */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#5d6478]">
                    Vol{" "}
                    <span className="text-[#848e9c] font-[family-name:var(--font-geist-mono)]">
                      {m.volume}
                    </span>
                  </span>
                  <span className="text-[#5d6478]">
                    MCap{" "}
                    <span className="text-[#848e9c] font-[family-name:var(--font-geist-mono)]">
                      {m.marketCap}
                    </span>
                  </span>
                </div>

                {/* Hover accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundColor: m.color }}
                />
              </Link>
            ))}
          </div>
        )}

        {/* ── Table view ──────────────────────────── */}
        {view === "table" && (
          <div>
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] gap-4 px-5 py-2.5 text-[10px] text-[#5d6478] uppercase tracking-widest">
              <span>Name</span>
              <button
                onClick={() => handleSort("price")}
                className="text-right cursor-pointer hover:text-[#848e9c] transition-colors"
              >
                Price{sortArrow("price")}
              </button>
              <button
                onClick={() => handleSort("change")}
                className="text-right cursor-pointer hover:text-[#848e9c] transition-colors"
              >
                24h Change{sortArrow("change")}
              </button>
              <button
                onClick={() => handleSort("volume")}
                className="text-right cursor-pointer hover:text-[#848e9c] transition-colors"
              >
                Volume{sortArrow("volume")}
              </button>
              <span className="text-right">Market Cap</span>
              <span className="text-right">7d Chart</span>
            </div>

            <div className="divide-y divide-[rgba(42,46,57,0.1)]">
              {paged.map((m) => (
                <Link
                  key={m.symbol}
                  href={`/trade/${m.symbol}_USD`}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] gap-4 px-5 py-4 items-center hover:bg-[#13141c]/60 transition-all duration-300 rounded-xl cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-[16px] shrink-0 group-hover:scale-110 transition-transform duration-200"
                      style={{ backgroundColor: `${m.color}12` }}
                    >
                      {m.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#eaecef] text-[13px] font-semibold">
                          {m.name}
                        </span>
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                          style={{
                            backgroundColor: `${categoryColors[m.category] || "#5d6478"}12`,
                            color: categoryColors[m.category] || "#5d6478",
                          }}
                        >
                          {m.category}
                        </span>
                      </div>
                      <span className="text-[#5d6478] text-[11px]">
                        {m.symbol}/USD
                      </span>
                    </div>
                  </div>
                  <div className="text-[#eaecef] text-[13px] font-[family-name:var(--font-geist-mono)] tabular-nums text-right">
                    ${m.price.toFixed(2)}
                  </div>
                  <div
                    className={`text-[13px] font-[family-name:var(--font-geist-mono)] tabular-nums text-right ${
                      m.change >= 0 ? "text-[#00c176]" : "text-[#ea3941]"
                    }`}
                  >
                    {m.change >= 0 ? "+" : ""}
                    {m.change.toFixed(1)}%
                  </div>
                  <div className="text-[#848e9c] text-[13px] font-[family-name:var(--font-geist-mono)] tabular-nums text-right">
                    {m.volume}
                  </div>
                  <div className="text-[#848e9c] text-[13px] font-[family-name:var(--font-geist-mono)] tabular-nums text-right">
                    {m.marketCap}
                  </div>
                  <div className="flex justify-end">
                    <Sparkline
                      data={m.sparkline}
                      color={m.change >= 0 ? "#00c176" : "#ea3941"}
                      w={100}
                      h={32}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Pagination bar ─────────────────────── */}
        {filtered.length > 0 && (
          <div className="max-w-sm mx-auto flex flex-col items-center gap-4 mt-8 pt-6 border-t border-[rgba(42,46,57,0.12)]">
            {/* Page navigation */}
            {perPage > 0 && totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(Math.max(1, safePage - 1))}
                  disabled={safePage <= 1}
                  className="px-3 py-1.5 rounded-lg text-[12px] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-[#5d6478] hover:bg-[#13141c] hover:text-[#848e9c]"
                >
                  ←
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-[12px] font-[family-name:var(--font-geist-mono)] transition-colors cursor-pointer ${
                        safePage === p
                          ? "bg-[#1c1e2c] text-[#eaecef]"
                          : "text-[#5d6478] hover:bg-[#13141c] hover:text-[#848e9c]"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                  disabled={safePage >= totalPages}
                  className="px-3 py-1.5 rounded-lg text-[12px] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-[#5d6478] hover:bg-[#13141c] hover:text-[#848e9c]"
                >
                  →
                </button>
              </div>
            )}

            {/* Count + per-page */}
            <div className="flex items-center gap-3 text-[11px] text-[#5d6478]">
              <span>
                <span className="text-[#848e9c] font-[family-name:var(--font-geist-mono)]">
                  {perPage === 0
                    ? filtered.length
                    : Math.min((safePage - 1) * perPage + 1, filtered.length)}
                  –
                  {perPage === 0
                    ? filtered.length
                    : Math.min(safePage * perPage, filtered.length)}
                </span>{" "}
                of{" "}
                <span className="text-[#848e9c] font-[family-name:var(--font-geist-mono)]">
                  {filtered.length}
                </span>
              </span>

              <div className="flex items-center gap-0.5 bg-[#13141c]/60 rounded-lg p-0.5">
                {PER_PAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setPerPage(opt);
                      resetPage();
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer font-[family-name:var(--font-geist-mono)] ${
                      perPage === opt
                        ? "bg-[#1c1e2c] text-[#eaecef]"
                        : "text-[#5d6478] hover:text-[#848e9c]"
                    }`}
                  >
                    {opt === 0 ? "All" : opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="text-[40px] mb-4">🔍</div>
            <p className="text-[#5d6478] text-[14px] mb-1">No markets found</p>
            <p className="text-[#3d4354] text-[12px]">
              Try a different search or category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
