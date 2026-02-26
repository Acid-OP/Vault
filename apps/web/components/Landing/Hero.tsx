"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-28">
      {/* Animated gradient orbs */}
      <div
        className="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full bg-[#00c176]/[0.04] blur-[120px]"
        style={{ animation: "float 8s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-[-100px] right-[-60px] w-[450px] h-[450px] rounded-full bg-[#3b82f6]/[0.04] blur-[120px]"
        style={{ animation: "float 10s ease-in-out infinite 2s" }}
      />
      <div
        className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-[#ea3941]/[0.03] blur-[100px]"
        style={{ animation: "float 12s ease-in-out infinite 4s" }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(234,236,239,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(234,236,239,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#00c176]/[0.08] border border-[#00c176]/20 rounded-full px-3.5 py-1 mb-8">
            <div
              className="w-1.5 h-1.5 rounded-full bg-[#00c176]"
              style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
            />
            <span className="text-[#00c176] text-[11px] font-medium tracking-wide">
              Live Trading
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[#eaecef] text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight max-w-4xl">
            Trade crypto with
            <span className="bg-gradient-to-r from-[#00c176] via-[#00c176] to-[#3b82f6] bg-clip-text text-transparent">
              {" "}
              zero friction
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-[#848e9c] text-lg sm:text-xl max-w-2xl leading-relaxed">
            Lightning-fast execution, institutional-grade security, and the
            lowest fees in the market. Built for traders who demand more.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 mt-10">
            <Link
              href="/trade/CR7_USD"
              className="bg-[#eaecef] text-[#0e0f14] px-7 py-3 rounded-lg text-[13px] font-semibold hover:bg-white transition-colors"
            >
              Start Trading
            </Link>
            <Link
              href="/trade/CR7_USD"
              className="bg-[#13141c] text-[#eaecef] px-7 py-3 rounded-lg text-[13px] font-semibold border border-[rgba(42,46,57,0.3)] hover:border-[rgba(42,46,57,0.6)] transition-colors"
            >
              View Markets
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-10 mt-16">
            <div className="flex flex-col items-center">
              <span className="text-[#eaecef] text-2xl sm:text-3xl font-bold font-mono tabular-nums">
                $2.4B
              </span>
              <span className="text-[#3d4354] text-[10px] uppercase tracking-widest mt-1">
                24h Volume
              </span>
            </div>
            <div className="w-px h-10 bg-[rgba(42,46,57,0.3)]" />
            <div className="flex flex-col items-center">
              <span className="text-[#eaecef] text-2xl sm:text-3xl font-bold font-mono tabular-nums">
                150+
              </span>
              <span className="text-[#3d4354] text-[10px] uppercase tracking-widest mt-1">
                Markets
              </span>
            </div>
            <div className="w-px h-10 bg-[rgba(42,46,57,0.3)]" />
            <div className="flex flex-col items-center">
              <span className="text-[#eaecef] text-2xl sm:text-3xl font-bold font-mono tabular-nums">
                &lt;1ms
              </span>
              <span className="text-[#3d4354] text-[10px] uppercase tracking-widest mt-1">
                Latency
              </span>
            </div>
            <div className="w-px h-10 bg-[rgba(42,46,57,0.3)]" />
            <div className="flex flex-col items-center">
              <span className="text-[#eaecef] text-2xl sm:text-3xl font-bold font-mono tabular-nums">
                0.01%
              </span>
              <span className="text-[#3d4354] text-[10px] uppercase tracking-widest mt-1">
                Maker Fee
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
