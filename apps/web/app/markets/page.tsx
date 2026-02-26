"use client";

import Link from "next/link";
import Navbar from "../../components/Navbar/Navbar";

const categories = [
  "All",
  "Athletes",
  "Creators",
  "Music",
  "Tech",
  "Politics",
] as const;

const allMarkets = [
  {
    symbol: "CR7",
    name: "Cristiano Ronaldo",
    emoji: "⚽",
    price: "$142.80",
    change: "+14.2%",
    positive: true,
    volume: "$48.2M",
    category: "Athletes",
  },
  {
    symbol: "ELON",
    name: "Elon Musk",
    emoji: "🚀",
    price: "$387.50",
    change: "+8.7%",
    positive: true,
    volume: "$92.1M",
    category: "Tech",
  },
  {
    symbol: "MESSI",
    name: "Lionel Messi",
    emoji: "🐐",
    price: "$128.40",
    change: "+6.9%",
    positive: true,
    volume: "$34.5M",
    category: "Athletes",
  },
  {
    symbol: "TRUMP",
    name: "Donald Trump",
    emoji: "🇺🇸",
    price: "$256.30",
    change: "+18.3%",
    positive: true,
    volume: "$78.4M",
    category: "Politics",
  },
  {
    symbol: "TSWIFT",
    name: "Taylor Swift",
    emoji: "🎤",
    price: "$89.20",
    change: "-2.1%",
    positive: false,
    volume: "$21.8M",
    category: "Music",
  },
  {
    symbol: "MRBEAST",
    name: "MrBeast",
    emoji: "🍫",
    price: "$67.40",
    change: "+11.4%",
    positive: true,
    volume: "$28.6M",
    category: "Creators",
  },
  {
    symbol: "DRAKE",
    name: "Drake",
    emoji: "🦉",
    price: "$54.30",
    change: "+2.3%",
    positive: true,
    volume: "$15.2M",
    category: "Music",
  },
  {
    symbol: "LEBRON",
    name: "LeBron James",
    emoji: "🏀",
    price: "$112.70",
    change: "+9.5%",
    positive: true,
    volume: "$31.4M",
    category: "Athletes",
  },
  {
    symbol: "KANYE",
    name: "Kanye West",
    emoji: "🎵",
    price: "$52.10",
    change: "+12.1%",
    positive: true,
    volume: "$15.6M",
    category: "Music",
  },
  {
    symbol: "VIRAT",
    name: "Virat Kohli",
    emoji: "🏏",
    price: "$98.70",
    change: "+10.4%",
    positive: true,
    volume: "$24.3M",
    category: "Athletes",
  },
  {
    symbol: "DHONI",
    name: "MS Dhoni",
    emoji: "🚁",
    price: "$76.30",
    change: "+15.7%",
    positive: true,
    volume: "$19.8M",
    category: "Athletes",
  },
  {
    symbol: "MBAPPE",
    name: "Kylian Mbappé",
    emoji: "⚡",
    price: "$94.60",
    change: "+13.2%",
    positive: true,
    volume: "$18.3M",
    category: "Athletes",
  },
  {
    symbol: "HAALAND",
    name: "Erling Haaland",
    emoji: "🤖",
    price: "$108.50",
    change: "+6.3%",
    positive: true,
    volume: "$22.1M",
    category: "Athletes",
  },
  {
    symbol: "NEYMAR",
    name: "Neymar Jr",
    emoji: "🇧🇷",
    price: "$62.40",
    change: "-3.8%",
    positive: false,
    volume: "$14.7M",
    category: "Athletes",
  },
  {
    symbol: "BEYONCE",
    name: "Beyoncé",
    emoji: "👑",
    price: "$78.90",
    change: "+7.6%",
    positive: true,
    volume: "$17.2M",
    category: "Music",
  },
  {
    symbol: "CONOR",
    name: "Conor McGregor",
    emoji: "🥊",
    price: "$45.20",
    change: "+9.1%",
    positive: true,
    volume: "$12.4M",
    category: "Athletes",
  },
  {
    symbol: "ZUCK",
    name: "Mark Zuckerberg",
    emoji: "👓",
    price: "$198.40",
    change: "+3.9%",
    positive: true,
    volume: "$42.8M",
    category: "Tech",
  },
  {
    symbol: "PEWDS",
    name: "PewDiePie",
    emoji: "📹",
    price: "$18.60",
    change: "+5.6%",
    positive: true,
    volume: "$6.3M",
    category: "Creators",
  },
  {
    symbol: "POKIMANE",
    name: "Pokimane",
    emoji: "🎮",
    price: "$12.80",
    change: "+8.1%",
    positive: true,
    volume: "$4.2M",
    category: "Creators",
  },
  {
    symbol: "RIHANNA",
    name: "Rihanna",
    emoji: "💎",
    price: "$71.30",
    change: "+4.8%",
    positive: true,
    volume: "$16.1M",
    category: "Music",
  },
  {
    symbol: "NINJA",
    name: "Ninja",
    emoji: "🎯",
    price: "$9.40",
    change: "-1.2%",
    positive: false,
    volume: "$2.8M",
    category: "Creators",
  },
  {
    symbol: "OPRAH",
    name: "Oprah Winfrey",
    emoji: "📺",
    price: "$134.20",
    change: "+4.5%",
    positive: true,
    volume: "$22.6M",
    category: "Creators",
  },
  {
    symbol: "LOGAN",
    name: "Logan Paul",
    emoji: "🥤",
    price: "$8.40",
    change: "-4.2%",
    positive: false,
    volume: "$3.1M",
    category: "Creators",
  },
  {
    symbol: "BILLIE",
    name: "Billie Eilish",
    emoji: "🖤",
    price: "$34.70",
    change: "+3.7%",
    positive: true,
    volume: "$8.9M",
    category: "Music",
  },
];

import { useState } from "react";

export default function MarketsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = allMarkets.filter((m) => {
    const matchesCategory =
      activeCategory === "All" || m.category === activeCategory;
    const matchesSearch =
      search.length === 0 ||
      m.symbol.toLowerCase().includes(search.toLowerCase()) ||
      m.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-screen overflow-y-auto bg-[#0e0f14] scrollbar-none">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-[32px] text-[#eaecef] font-normal tracking-[-0.02em]">
              All Markets
            </h1>
            <p className="text-[#3d4354] text-[13px] mt-1">
              {allMarkets.length} characters available to trade.
            </p>
          </div>
          <div className="relative w-56">
            <input
              type="text"
              placeholder="Filter markets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#13141c] text-[#eaecef] placeholder:text-[#3d4354] rounded-md px-3 py-1.5 pl-8 text-[11px] border border-[rgba(42,46,57,0.2)] focus:outline-none focus:border-[rgba(42,46,57,0.5)] transition-colors"
            />
            <svg
              className="w-3.5 h-3.5 text-[#3d4354] absolute left-2.5 top-[7px]"
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
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-[rgba(42,46,57,0.2)]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 text-[12px] font-medium transition-colors relative cursor-pointer ${
                activeCategory === cat
                  ? "text-[#eaecef]"
                  : "text-[#3d4354] hover:text-[#848e9c]"
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00c176] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-2 text-[9px] text-[#3d4354] uppercase tracking-widest">
          <span>Name</span>
          <span className="text-right">Price</span>
          <span className="text-right">24h Change</span>
          <span className="text-right">Volume</span>
          <span className="text-right">Category</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[rgba(42,46,57,0.12)]">
          {filtered.map((m) => (
            <Link
              key={m.symbol}
              href={`/trade/${m.symbol}_USD`}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3.5 items-center hover:bg-[#13141c] transition-colors rounded-lg cursor-pointer group"
            >
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
              <div
                className={`text-[13px] font-mono tabular-nums text-right ${m.positive ? "text-[#00c176]" : "text-[#ea3941]"}`}
              >
                {m.change}
              </div>
              <div className="text-[#848e9c] text-[13px] font-mono tabular-nums text-right">
                {m.volume}
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#3d4354] bg-[#1c1e2c] px-2 py-0.5 rounded">
                  {m.category}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="text-[#3d4354] text-[13px]">
              No markets match your search.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
