const features = [
  {
    title: "Sub-millisecond execution",
    description: "Orders matched in under 1ms. No requotes, no slippage games.",
  },
  {
    title: "Deep order books",
    description:
      "Tight spreads across 150+ markets. Trade any size without impact.",
  },
  {
    title: "Lowest fees, period",
    description: "0.01% maker, 0.05% taker. Volume discounts go even lower.",
  },
  {
    title: "Cold storage security",
    description:
      "Multi-sig wallets, real-time monitoring, and SOC 2 compliance.",
  },
  {
    title: "Professional charting",
    description:
      "50+ indicators, real-time candles, and drawing tools built in.",
  },
  {
    title: "Always-on support",
    description:
      "24/7 support from real traders. Average response under 2 minutes.",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-[#0e0f14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mb-12">
          <h2 className="font-[family-name:var(--font-heading)] text-[28px] sm:text-[32px] text-[#eaecef] font-normal tracking-[-0.02em] leading-[1.15]">
            Why traders
            <br />
            choose Backpack.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(42,46,57,0.12)] rounded-xl overflow-hidden">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-[#0e0f14] p-7 hover:bg-[#13141c] transition-colors duration-300"
            >
              <h3 className="text-[#eaecef] text-[14px] font-medium mb-2">
                {f.title}
              </h3>
              <p className="text-[#3d4354] text-[12px] leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
