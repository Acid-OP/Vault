import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 bg-[#0e0f14] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#00c176]/[0.03] blur-[150px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-[#eaecef] text-3xl sm:text-4xl font-bold leading-tight">
          Ready to start trading?
        </h2>
        <p className="text-[#848e9c] text-[15px] mt-4 max-w-xl mx-auto leading-relaxed">
          Join thousands of traders who trust Backpack for fast, secure, and
          low-cost crypto trading. Create your account in under 60 seconds.
        </p>

        <div className="flex items-center justify-center gap-3 mt-10">
          <Link
            href="/signup"
            className="bg-[#00c176] text-white px-8 py-3 rounded-lg text-[13px] font-semibold hover:bg-[#00c176]/90 transition-colors"
          >
            Create Free Account
          </Link>
          <Link
            href="/trade/CR7_USD"
            className="bg-[#13141c] text-[#eaecef] px-8 py-3 rounded-lg text-[13px] font-semibold border border-[rgba(42,46,57,0.3)] hover:border-[rgba(42,46,57,0.6)] transition-colors"
          >
            Explore Demo
          </Link>
        </div>

        <p className="text-[#3d4354] text-[10px] mt-6 uppercase tracking-widest">
          No credit card required &middot; Start trading in minutes
        </p>
      </div>
    </section>
  );
}
