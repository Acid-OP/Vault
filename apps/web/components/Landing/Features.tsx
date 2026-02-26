const features = [
  {
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Sub-millisecond Execution",
    description:
      "Our matching engine processes orders in under 1ms. No slippage, no delays, just instant fills.",
    accent: "#00c176",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Bank-grade Security",
    description:
      "Cold storage, multi-sig wallets, and real-time monitoring protect your assets around the clock.",
    accent: "#3b82f6",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Lowest Fees",
    description:
      "0.01% maker and 0.05% taker fees. High-volume traders enjoy even deeper discounts.",
    accent: "#f0b90b",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
      </svg>
    ),
    title: "Advanced Charting",
    description:
      "Professional-grade charts with 50+ indicators, drawing tools, and real-time candlestick data.",
    accent: "#ea3941",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: "Deep Liquidity",
    description:
      "Tight spreads and deep order books across 150+ markets. Trade any size without moving the market.",
    accent: "#8b5cf6",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "24/7 Support",
    description:
      "Round-the-clock support from real traders who understand your needs. Average response under 2 minutes.",
    accent: "#00c176",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-[#0e0f14] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#13141c]/30 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-[#eaecef] text-2xl font-bold">
            Why traders choose Backpack
          </h2>
          <p className="text-[#3d4354] text-[13px] mt-2 max-w-lg mx-auto">
            Every feature designed with one goal: giving you an unfair
            advantage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group bg-[#13141c] rounded-xl p-6 border border-[rgba(42,46,57,0.15)] hover:border-[rgba(42,46,57,0.4)] transition-all duration-300"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300"
                style={{ backgroundColor: `${f.accent}10`, color: f.accent }}
              >
                {f.icon}
              </div>
              <h3 className="text-[#eaecef] text-[14px] font-semibold mb-2">
                {f.title}
              </h3>
              <p className="text-[#848e9c] text-[12px] leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
