import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Landing/Hero";
import MarketShowcase from "../components/Landing/MarketShowcase";
import MarketOverview from "../components/Landing/MarketOverview";
import Features from "../components/Landing/Features";
import CTASection from "../components/Landing/CTASection";
import Footer from "../components/Landing/Footer";

export default function Home() {
  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-[#0e0f14] scrollbar-none">
      <Navbar />
      <Hero />
      <MarketShowcase />
      <MarketOverview />
      <Features />
      <CTASection />
      <Footer />
    </div>
  );
}
