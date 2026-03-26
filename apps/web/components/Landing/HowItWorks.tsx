"use client";

import Link from "next/link";

interface PersonalityCard {
  emoji: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  positive: boolean;
  tagline: string;
  sparkline: number[];
  color: string;
}

const personalities: PersonalityCard[] = [
  {
    emoji: "⚽",
    symbol: "CR7",
    name: "Cristiano Ronaldo",
    price: "$142.80",
    change: "+14.2%",
    positive: true,
    tagline: "The GOAT debate is now tradable.",
    sparkline: [30, 35, 38, 42, 50, 48, 55, 60, 58, 68, 65, 72, 78],
    color: "#ea3941",
  },
  {
    emoji: "🚀",
    symbol: "ELON",
    name: "Elon Musk",
    price: "$387.50",
    change: "+8.7%",
    positive: true,
    tagline: "One tweet moves the market.",
    sparkline: [40, 55, 42, 60, 55, 52, 68, 62, 60, 75, 70, 65, 72],
    color: "#3b82f6",
  },
  {
    emoji: "🐐",
    symbol: "MESSI",
    name: "Lionel Messi",
    price: "$128.40",
    change: "+6.9%",
    positive: true,
    tagline: "Steady hands. Steady chart.",
    sparkline: [35, 38, 40, 42, 45, 48, 50, 52, 55, 57, 58, 60, 62],
    color: "#f0b90b",
  },
  {
    emoji: "🇺🇸",
    symbol: "TRUMP",
    name: "Donald Trump",
    price: "$256.30",
    change: "+18.3%",
    positive: true,
    tagline: "Volatility is his brand.",
    sparkline: [25, 30, 45, 40, 58, 55, 70, 65, 62, 80, 72, 85, 92],
    color: "#ea3941",
  },
];

function CardSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 80;
  const w = 240;
  const step = w / (data.length - 1);

  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");

  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg
      width={w}
      height={h}
      className="w-full"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id={`grad-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#grad-${color.replace("#", "")})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HowItWorks() {
  return (
    <section className="relative py-28 bg-[#0e0f14] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#f0b90b]/[0.02] blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <p className="text-[#ea3941] text-[12px] font-medium uppercase tracking-widest mb-4">
            Trending Now
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-[32px] sm:text-[40px] text-[#eaecef] font-normal tracking-[-0.02em] leading-[1.15]">
            Who are you betting on?
          </h2>
          <p className="text-[#5d6478] text-[14px] mt-3 max-w-md mx-auto">
            Every personality is a market. Every fan is a trader.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personalities.map((p) => (
            <Link
              key={p.symbol}
              href={`/trade/${p.symbol}_USD`}
              className="group relative p-5 rounded-2xl glass-card glass-card-hover transition-all duration-500 hover:scale-[1.02] cursor-pointer overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-[20px]"
                  style={{ backgroundColor: `${p.color}15` }}
                >
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[#eaecef] text-[14px] font-semibold">
                      {p.symbol}
                    </span>
                    <span
                      className={`text-[11px] font-[family-name:var(--font-geist-mono)] font-medium ${
                        p.positive ? "text-[#00c176]" : "text-[#ea3941]"
                      }`}
                    >
                      {p.change}
                    </span>
                  </div>
                  <span className="text-[#5d6478] text-[11px] truncate block">
                    {p.name}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-[#eaecef] text-[22px] font-[family-name:var(--font-geist-mono)] font-bold mb-3">
                {p.price}
              </div>

              {/* Chart */}
              <div className="mb-4 -mx-1">
                <CardSparkline data={p.sparkline} color={p.color} />
              </div>

              {/* Tagline */}
              <p
                className="text-[12px] italic leading-snug"
                style={{ color: `${p.color}99` }}
              >
                &ldquo;{p.tagline}&rdquo;
              </p>

              {/* Hover accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundColor: p.color }}
              />
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/markets"
            className="group inline-flex items-center gap-1 text-[#848e9c] text-[13px] font-medium hover:text-[#eaecef] transition-colors"
          >
            View all 150+ markets
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
