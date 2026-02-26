import Navbar from "../../../components/Navbar/Navbar";

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-[#0e0f14]">
      <Navbar />
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}