import React from "react";

interface TabsProps {
  activeTab: "book" | "trades";
  setActiveTab: (tab: "book" | "trades") => void;
}

export function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="flex gap-0.5 px-3 pt-2 pb-0.5">
      <button
        onClick={() => setActiveTab("book")}
        className={`px-2 py-0.5 text-[10px] font-medium rounded cursor-pointer transition-all duration-200 ${
          activeTab === "book"
            ? "text-[#eaecef] bg-[#1c1e2c]"
            : "text-[#3d4354] hover:text-[#6b7280]"
        }`}
      >
        Book
      </button>
      <button
        onClick={() => setActiveTab("trades")}
        className={`px-2 py-0.5 text-[10px] font-medium rounded cursor-pointer transition-all duration-200 ${
          activeTab === "trades"
            ? "text-[#eaecef] bg-[#1c1e2c]"
            : "text-[#3d4354] hover:text-[#6b7280]"
        }`}
      >
        Trades
      </button>
    </div>
  );
}
