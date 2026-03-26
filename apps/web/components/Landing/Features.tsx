"use client";

function MiniOrderbook() {
  const bids = [
    { price: "142.80", size: 85 },
    { price: "142.75", size: 62 },
    { price: "142.70", size: 45 },
    { price: "142.65", size: 78 },
    { price: "142.60", size: 35 },
  ];
  const asks = [
    { price: "142.85", size: 70 },
    { price: "142.90", size: 55 },
    { price: "142.95", size: 90 },
    { price: "143.00", size: 40 },
    { price: "143.05", size: 65 },
  ];
  return (
    <div className="flex gap-3 text-[11px] font-[family-name:var(--font-geist-mono)]">
      <div className="flex-1 space-y-1">
        {bids.map((b, i) => (
          <div key={b.price} className="flex items-center gap-2 relative">
            <div
              className={`absolute right-0 top-0 bottom-0 bg-[#00c176]/10 rounded-sm bar-pulse bar-pulse-delay-${i}`}
              style={{ width: `${b.size}%` }}
            />
            <span className="text-[#00c176] relative z-10">{b.price}</span>
            <span className="text-[#5d6478] ml-auto relative z-10">
              {(b.size * 2.3).toFixed(0)}
            </span>
          </div>
        ))}
      </div>
      <div className="w-px bg-[rgba(42,46,57,0.2)]" />
      <div className="flex-1 space-y-1">
        {asks.map((a, i) => (
          <div key={a.price} className="flex items-center gap-2 relative">
            <div
              className={`absolute left-0 top-0 bottom-0 bg-[#ea3941]/10 rounded-sm bar-pulse bar-pulse-delay-${i}`}
              style={{ width: `${a.size}%` }}
            />
            <span className="text-[#5d6478] relative z-10">
              {(a.size * 1.8).toFixed(0)}
            </span>
            <span className="text-[#ea3941] ml-auto relative z-10">
              {a.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpeedGauge() {
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="rgba(42,46,57,0.2)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#f0b90b"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="264"
            strokeDashoffset="26"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[#eaecef] text-[18px] font-[family-name:var(--font-geist-mono)] font-bold">
            &lt;1
          </span>
          <span className="text-[#5d6478] text-[9px] uppercase tracking-wider">
            ms
          </span>
        </div>
      </div>
      <div>
        <div className="text-[#eaecef] text-[14px] font-semibold mb-1">
          Matching speed
        </div>
        <div className="text-[#5d6478] text-[12px] leading-relaxed">
          Orders matched before
          <br />
          you blink. Literally.
        </div>
      </div>
    </div>
  );
}

function FeeComparison() {
  const exchanges = [
    { name: "Backpack", maker: "0.01%", taker: "0.05%", highlight: true },
    { name: "Exchange B", maker: "0.10%", taker: "0.15%", highlight: false },
    { name: "Exchange C", maker: "0.20%", taker: "0.40%", highlight: false },
  ];
  return (
    <div className="space-y-2 text-[12px]">
      <div className="grid grid-cols-3 gap-4 text-[#5d6478] text-[10px] uppercase tracking-widest pb-1">
        <span>Exchange</span>
        <span className="text-right">Maker</span>
        <span className="text-right">Taker</span>
      </div>
      {exchanges.map((e) => (
        <div
          key={e.name}
          className={`grid grid-cols-3 gap-4 py-1.5 px-2 rounded-lg ${
            e.highlight ? "bg-[#f0b90b]/5 border border-[#f0b90b]/15" : ""
          }`}
        >
          <span
            className={
              e.highlight ? "text-[#f0b90b] font-semibold" : "text-[#5d6478]"
            }
          >
            {e.name}
          </span>
          <span
            className={`text-right font-[family-name:var(--font-geist-mono)] ${
              e.highlight ? "text-[#eaecef]" : "text-[#5d6478]"
            }`}
          >
            {e.maker}
          </span>
          <span
            className={`text-right font-[family-name:var(--font-geist-mono)] ${
              e.highlight ? "text-[#eaecef]" : "text-[#5d6478]"
            }`}
          >
            {e.taker}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Features() {
  return (
    <section className="relative py-28 bg-[#0e0f14]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#f0b90b] text-[12px] font-medium uppercase tracking-widest mb-4">
            The Platform
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-[32px] sm:text-[40px] text-[#eaecef] font-normal tracking-[-0.02em] leading-[1.15]">
            Not just another exchange.
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Large card — Orderbook */}
          <div className="lg:col-span-2 p-8 rounded-2xl glass-card glass-card-hover transition-all duration-500 group">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#00c176]" />
              <span className="text-[#5d6478] text-[11px] uppercase tracking-widest">
                Live Depth
              </span>
            </div>
            <h3 className="text-[#eaecef] text-[18px] font-semibold mb-1">
              Deep order books
            </h3>
            <p className="text-[#5d6478] text-[13px] mb-6 max-w-md">
              Tight spreads, real liquidity. Trade any size without moving the
              price.
            </p>
            <MiniOrderbook />
          </div>

          {/* Speed card */}
          <div className="p-8 rounded-2xl glass-card glass-card-hover transition-all duration-500 group">
            <SpeedGauge />
          </div>

          {/* Fee card */}
          <div className="p-8 rounded-2xl glass-card glass-card-hover transition-all duration-500">
            <h3 className="text-[#eaecef] text-[18px] font-semibold mb-1">
              Lowest fees. Period.
            </h3>
            <p className="text-[#5d6478] text-[13px] mb-5">
              See how we stack up.
            </p>
            <FeeComparison />
          </div>

          {/* Security card */}
          <div className="p-8 rounded-2xl glass-card glass-card-hover transition-all duration-500 group">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#ea3941]/10 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ea3941"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-[#eaecef] text-[16px] font-semibold">
                  Cold storage
                </h3>
                <p className="text-[#5d6478] text-[12px]">Multi-sig + SOC 2</p>
              </div>
            </div>
            <p className="text-[#5d6478] text-[13px] leading-relaxed">
              Your assets in institutional-grade custody. Real-time monitoring,
              multi-sig wallets, and insurance coverage.
            </p>
          </div>

          {/* Charts + Support card */}
          <div className="p-8 rounded-2xl glass-card glass-card-hover transition-all duration-500 flex flex-col justify-between">
            <div>
              <h3 className="text-[#eaecef] text-[16px] font-semibold mb-1">
                Pro-grade tools
              </h3>
              <p className="text-[#5d6478] text-[13px] leading-relaxed mb-4">
                50+ indicators, real-time candles, multi-timeframe analysis.
                Drawing tools for the chart obsessed.
              </p>
            </div>
            {/* Mini chart lines */}
            <div className="flex items-end gap-1 h-12">
              {[30, 45, 35, 55, 48, 62, 58, 70, 65, 78, 72, 85].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-[#3b82f6]/30"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
