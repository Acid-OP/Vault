"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const allMarkets = [
  { symbol: "CR7", name: "Cristiano Ronaldo", emoji: "⚽" },
  { symbol: "ELON", name: "Elon Musk", emoji: "🚀" },
  { symbol: "MESSI", name: "Lionel Messi", emoji: "🐐" },
  { symbol: "TRUMP", name: "Donald Trump", emoji: "🇺🇸" },
  { symbol: "TSWIFT", name: "Taylor Swift", emoji: "🎤" },
  { symbol: "MRBEAST", name: "MrBeast", emoji: "🍫" },
  { symbol: "DRAKE", name: "Drake", emoji: "🦉" },
  { symbol: "LEBRON", name: "LeBron James", emoji: "🏀" },
  { symbol: "RIHANNA", name: "Rihanna", emoji: "💎" },
  { symbol: "KANYE", name: "Kanye West", emoji: "🎵" },
  { symbol: "VIRAT", name: "Virat Kohli", emoji: "🏏" },
  { symbol: "DHONI", name: "MS Dhoni", emoji: "🚁" },
  { symbol: "MBAPPE", name: "Kylian Mbappé", emoji: "⚡" },
  { symbol: "HAALAND", name: "Erling Haaland", emoji: "🤖" },
  { symbol: "NEYMAR", name: "Neymar Jr", emoji: "🇧🇷" },
  { symbol: "BEYONCE", name: "Beyoncé", emoji: "👑" },
  { symbol: "CONOR", name: "Conor McGregor", emoji: "🥊" },
  { symbol: "ZUCK", name: "Mark Zuckerberg", emoji: "👓" },
  { symbol: "PEWDS", name: "PewDiePie", emoji: "📹" },
  { symbol: "POKIMANE", name: "Pokimane", emoji: "🎮" },
  { symbol: "NINJA", name: "Ninja", emoji: "🎯" },
  { symbol: "OPRAH", name: "Oprah Winfrey", emoji: "📺" },
  { symbol: "LOGAN", name: "Logan Paul", emoji: "🥤" },
  { symbol: "BILLIE", name: "Billie Eilish", emoji: "🖤" },
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filtered =
    query.length > 0
      ? allMarkets
          .filter(
            (m) =>
              m.symbol.toLowerCase().includes(query.toLowerCase()) ||
              m.name.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 6)
      : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (symbol: string) => {
    setQuery("");
    setOpen(false);
    router.push(`/trade/${symbol}_USD`);
  };

  return (
    <div className="w-56 ml-16 relative" ref={ref}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search markets..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.length > 0 && setOpen(true)}
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

      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#13141c] border border-[rgba(42,46,57,0.3)] rounded-lg overflow-hidden shadow-xl z-50">
          {filtered.map((m) => (
            <button
              key={m.symbol}
              onClick={() => handleSelect(m.symbol)}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#1c1e2c] transition-colors cursor-pointer text-left"
            >
              <span className="text-[14px]">{m.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[#eaecef] text-[11px] font-medium">
                  {m.symbol}/USD
                </div>
                <div className="text-[#3d4354] text-[9px] truncate">
                  {m.name}
                </div>
              </div>
              <svg
                className="w-3 h-3 text-[#3d4354] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ))}
        </div>
      )}

      {open && query.length > 0 && filtered.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#13141c] border border-[rgba(42,46,57,0.3)] rounded-lg overflow-hidden shadow-xl z-50 px-3 py-3">
          <span className="text-[#3d4354] text-[11px]">No markets found</span>
        </div>
      )}
    </div>
  );
}
