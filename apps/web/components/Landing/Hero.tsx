"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 dot-grid" />

      {/* Animated gradient orbs — warm palette */}
      <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#f0b90b]/[0.03] blur-[120px] animate-gradient-shift pointer-events-none" />
      <div className="absolute top-[25%] right-[15%] w-[400px] h-[400px] rounded-full bg-[#3b82f6]/[0.03] blur-[120px] animate-gradient-shift animation-delay-2000 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[40%] w-[350px] h-[350px] rounded-full bg-[#ea3941]/[0.02] blur-[100px] animate-gradient-shift animation-delay-4000 pointer-events-none" />

      {/* Decorative rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[rgba(42,46,57,0.06)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[rgba(42,46,57,0.04)] pointer-events-none" />

      <div className="relative text-center max-w-[900px] mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-8 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-[12px] text-[#848e9c] tracking-wide animate-border-glow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f0b90b] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f0b90b]" />
            </span>
            Markets are live — 24/7 trading
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-[family-name:var(--font-heading)] text-[48px] sm:text-[64px] lg:text-[80px] font-normal text-[#eaecef] leading-[1.05] tracking-[-0.03em] mb-6 animate-fade-in-up animation-delay-200">
          Trade the people
          <br />
          <span className="text-gradient-gold">who move markets.</span>
        </h1>

        {/* Subline */}
        <p className="text-[15px] sm:text-[17px] text-[#5d6478] leading-relaxed max-w-lg mx-auto mb-12 animate-fade-in-up animation-delay-400">
          The world&apos;s first exchange for personality-backed assets.
          <br className="hidden sm:block" />
          Sub-millisecond execution. Zero slippage.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 animate-fade-in-up animation-delay-600">
          <Link
            href="/trade/CR7_USD"
            className="group relative px-8 py-3 bg-[#eaecef] text-[#0e0f14] text-[14px] font-semibold rounded-xl hover:bg-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,236,239,0.15)]"
          >
            Start Trading
            <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
          <Link
            href="/markets"
            className="px-8 py-3 text-[#eaecef] text-[14px] font-medium rounded-xl glass-card glass-card-hover transition-all duration-300"
          >
            Explore Markets
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-12 sm:gap-16 mt-24 animate-fade-in-up animation-delay-1000">
          {[
            { value: "$2.4B", label: "24h Volume", accent: false },
            { value: "<1ms", label: "Latency", accent: true },
            { value: "0.01%", label: "Maker Fee", accent: false },
            { value: "150+", label: "Markets", accent: false },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span
                className={`text-[24px] sm:text-[28px] font-[family-name:var(--font-geist-mono)] font-semibold tracking-tight ${
                  stat.accent ? "text-[#f0b90b]" : "text-[#eaecef]"
                }`}
              >
                {stat.value}
              </span>
              <span className="text-[#5d6478] text-[11px] uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0e0f14] to-transparent pointer-events-none" />
    </section>
  );
}
