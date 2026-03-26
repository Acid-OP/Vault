"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";

const row1 = [
  {
    symbol: "CR7",
    name: "Cristiano Ronaldo",
    emoji: "⚽",
    color: "#ea3941",
    change: "+14.2%",
  },
  {
    symbol: "ELON",
    name: "Elon Musk",
    emoji: "🚀",
    color: "#3b82f6",
    change: "+8.7%",
  },
  {
    symbol: "TSWIFT",
    name: "Taylor Swift",
    emoji: "🎤",
    color: "#f0b90b",
    change: "+3.1%",
  },
  {
    symbol: "MRBEAST",
    name: "MrBeast",
    emoji: "🍫",
    color: "#00c176",
    change: "+11.4%",
  },
  {
    symbol: "MESSI",
    name: "Lionel Messi",
    emoji: "🐐",
    color: "#8b5cf6",
    change: "+6.9%",
  },
  {
    symbol: "DRAKE",
    name: "Drake",
    emoji: "🦉",
    color: "#ea3941",
    change: "+2.3%",
  },
  {
    symbol: "LEBRON",
    name: "LeBron James",
    emoji: "🏀",
    color: "#f0b90b",
    change: "+9.5%",
  },
  {
    symbol: "RIHANNA",
    name: "Rihanna",
    emoji: "💎",
    color: "#3b82f6",
    change: "+4.8%",
  },
];

const row2 = [
  {
    symbol: "TRUMP",
    name: "Donald Trump",
    emoji: "🇺🇸",
    color: "#ea3941",
    change: "+18.3%",
  },
  {
    symbol: "PEWDS",
    name: "PewDiePie",
    emoji: "📹",
    color: "#00c176",
    change: "+5.6%",
  },
  {
    symbol: "NEYMAR",
    name: "Neymar Jr",
    emoji: "🇧🇷",
    color: "#f0b90b",
    change: "+7.2%",
  },
  {
    symbol: "ZUCK",
    name: "Mark Zuckerberg",
    emoji: "👓",
    color: "#3b82f6",
    change: "+3.9%",
  },
  {
    symbol: "KANYE",
    name: "Kanye West",
    emoji: "🎵",
    color: "#8b5cf6",
    change: "+12.1%",
  },
  {
    symbol: "VIRAT",
    name: "Virat Kohli",
    emoji: "🏏",
    color: "#00c176",
    change: "+10.4%",
  },
  {
    symbol: "HAALAND",
    name: "Erling Haaland",
    emoji: "🤖",
    color: "#ea3941",
    change: "+6.3%",
  },
  {
    symbol: "POKIMANE",
    name: "Pokimane",
    emoji: "🎮",
    color: "#f0b90b",
    change: "+8.1%",
  },
];

const row3 = [
  {
    symbol: "OPRAH",
    name: "Oprah Winfrey",
    emoji: "📺",
    color: "#8b5cf6",
    change: "+4.5%",
  },
  {
    symbol: "DHONI",
    name: "MS Dhoni",
    emoji: "🚁",
    color: "#f0b90b",
    change: "+15.7%",
  },
  {
    symbol: "NINJA",
    name: "Ninja",
    emoji: "🎯",
    color: "#3b82f6",
    change: "+2.8%",
  },
  {
    symbol: "CONOR",
    name: "Conor McGregor",
    emoji: "🥊",
    color: "#00c176",
    change: "+9.1%",
  },
  {
    symbol: "BEYONCE",
    name: "Beyoncé",
    emoji: "👑",
    color: "#ea3941",
    change: "+7.6%",
  },
  {
    symbol: "MBAPPE",
    name: "Kylian Mbappé",
    emoji: "⚡",
    color: "#3b82f6",
    change: "+13.2%",
  },
  {
    symbol: "LOGAN",
    name: "Logan Paul",
    emoji: "🥤",
    color: "#f0b90b",
    change: "+5.4%",
  },
  {
    symbol: "BILLIE",
    name: "Billie Eilish",
    emoji: "🖤",
    color: "#8b5cf6",
    change: "+3.7%",
  },
];

function MarketPill({
  symbol,
  name,
  emoji,
  color,
  change,
}: {
  symbol: string;
  name: string;
  emoji: string;
  color: string;
  change: string;
}) {
  return (
    <Link
      href={`/trade/${symbol}_USD`}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#13141c] border border-[rgba(42,46,57,0.15)] hover:border-[rgba(42,46,57,0.4)] transition-all duration-200 shrink-0 group cursor-pointer"
    >
      <span className="text-[16px]">{emoji}</span>
      <div className="flex flex-col">
        <span className="text-[#eaecef] text-[12px] font-medium group-hover:text-white transition-colors">
          {symbol}/USD
        </span>
        <span className="text-[#3d4354] text-[9px]">{name}</span>
      </div>
      <span
        className="ml-1 text-[10px] font-mono tabular-nums font-medium"
        style={{ color }}
      >
        {change}
      </span>
    </Link>
  );
}

function ScrollRow({
  items,
  direction,
}: {
  items: typeof row1;
  direction: "left" | "right";
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const oneSetWidth = track.scrollWidth / 3;
      track.style.setProperty("--set-width", `${oneSetWidth}px`);
    };
    measure();
    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative overflow-hidden w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0e0f14] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0e0f14] to-transparent z-10" />
      <div
        ref={trackRef}
        className={
          direction === "left" ? "scroll-track-left" : "scroll-track-right"
        }
        style={{ display: "flex", gap: 12 }}
      >
        {[0, 1, 2].map((setIdx) =>
          items.map((item) => (
            <MarketPill key={`${item.symbol}-${setIdx}`} {...item} />
          )),
        )}
      </div>
    </div>
  );
}

export default function MarketShowcase() {
  return (
    <section className="relative py-24 bg-[#0e0f14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <p className="text-[#ea3941] text-[12px] font-medium uppercase tracking-widest mb-4">
            150+ Markets
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-[32px] sm:text-[40px] text-[#eaecef] font-normal tracking-[-0.02em] leading-[1.15]">
            Trade anyone. Bet on everyone.
          </h2>
          <p className="text-[#5d6478] text-[14px] mt-3 max-w-md mx-auto">
            Athletes, creators, icons — all tradable. Pick a side and ride the
            momentum.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <ScrollRow items={row1} direction="left" />
        <ScrollRow items={row2} direction="right" />
        <ScrollRow items={row3} direction="left" />
      </div>

      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(calc(var(--set-width, 0px) * -1)); }
        }
        @keyframes marquee-right {
          from { transform: translateX(calc(var(--set-width, 0px) * -1)); }
          to { transform: translateX(0); }
        }
        .scroll-track-left {
          animation: marquee-left 50s linear infinite;
          will-change: transform;
        }
        .scroll-track-right {
          animation: marquee-right 50s linear infinite;
          will-change: transform;
        }
        .scroll-track-left:hover,
        .scroll-track-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
