import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-36 bg-[#0e0f14]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-[28px] sm:text-[36px] text-[#eaecef] font-normal tracking-[-0.02em] leading-[1.15] mb-4">
          Ready when you are.
        </h2>
        <p className="text-[#3d4354] text-[14px] leading-relaxed mb-10 max-w-md mx-auto">
          Create an account in under a minute. No credit card, no paperwork.
        </p>

        <Link
          href="/signup"
          className="inline-block px-7 py-2.5 bg-[#eaecef] text-[#0e0f14] text-[13px] font-medium rounded-md hover:bg-white transition-colors"
        >
          Create Free Account &rarr;
        </Link>
      </div>
    </section>
  );
}
