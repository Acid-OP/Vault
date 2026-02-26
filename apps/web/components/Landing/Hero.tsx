"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-44px)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#00c176]/[0.02] blur-[150px] pointer-events-none" />

      <div className="relative text-center max-w-[800px] mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-7">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13141c]/80 border border-[rgba(42,46,57,0.3)] text-[12px] text-[#848e9c] tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00c176] animate-pulse" />
            markets are open
          </span>
        </div>

        {/* Headline - editorial serif */}
        <h1 className="font-[family-name:var(--font-heading)] text-[42px] sm:text-[58px] lg:text-[72px] font-normal text-[#eaecef] leading-[1.08] tracking-[-0.02em] mb-6">
          The exchange
          <br />
          built for speed.
        </h1>

        {/* Subline */}
        <p className="text-[14px] sm:text-[15px] text-[#3d4354] leading-relaxed max-w-md mx-auto mb-10">
          Sub-millisecond matching. Deep liquidity. The lowest fees.
          <br className="hidden sm:block" />
          Everything else is noise.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/trade/CR7_USD"
            className="px-6 py-2.5 bg-[#eaecef] text-[#0e0f14] text-[13px] font-medium rounded-md hover:bg-white transition-colors"
          >
            Start Trading &rarr;
          </Link>
          <Link
            href="/trade/CR7_USD"
            className="px-6 py-2.5 bg-[#13141c] text-[#eaecef] text-[13px] font-medium rounded-md border border-[rgba(42,46,57,0.3)] hover:border-[rgba(42,46,57,0.6)] transition-colors"
          >
            View Demo
          </Link>
        </div>

        {/* Minimal stats - understated */}
        <div className="flex items-center justify-center gap-8 mt-20">
          {[
            { value: "$2.4B", label: "volume" },
            { value: "<1ms", label: "latency" },
            { value: "0.01%", label: "fees" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-1.5">
              <span className="text-[#eaecef] text-[15px] font-[family-name:var(--font-geist-mono)] font-medium">
                {stat.value}
              </span>
              <span className="text-[#3d4354] text-[11px]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
