import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-32 bg-[#0e0f14] relative overflow-hidden">
      {/* Background orbs — warm */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[#f0b90b]/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-[30%] -translate-y-1/2 w-[300px] h-[200px] rounded-full bg-[#ea3941]/[0.03] blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="glass-card rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden">
          {/* Top glow line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-px bg-gradient-to-r from-transparent via-[#f0b90b]/40 to-transparent" />

          <h2 className="font-[family-name:var(--font-heading)] text-[32px] sm:text-[42px] text-[#eaecef] font-normal tracking-[-0.02em] leading-[1.15] mb-4">
            Ready when you are.
          </h2>
          <p className="text-[#5d6478] text-[15px] leading-relaxed mb-10 max-w-md mx-auto">
            Create an account in under a minute. No credit card, no paperwork.
            Start trading the world&apos;s most exciting markets.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group px-8 py-3 bg-[#eaecef] text-[#0e0f14] text-[14px] font-semibold rounded-xl hover:bg-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,236,239,0.15)]"
            >
              Create Free Account
              <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <Link
              href="/trade/CR7_USD"
              className="px-8 py-3 text-[#848e9c] text-[14px] font-medium rounded-xl hover:text-[#eaecef] transition-colors duration-300"
            >
              Try Demo
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-12 pt-8 border-t border-[rgba(42,46,57,0.15)]">
            {["SOC 2 Certified", "Multi-sig Custody", "24/7 Support"].map(
              (badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-1.5 text-[#5d6478] text-[11px]"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f0b90b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  {badge}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
