import React from "react";

type ViewMode = "both" | "buy" | "sell";

interface ViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={() => setViewMode("both")}
        className={`p-1 rounded transition-all duration-200 cursor-pointer ${
          viewMode === "both" ? "bg-[#1c1e2c]" : "hover:bg-[#13141c]"
        }`}
      >
        <div className="flex flex-col gap-[1.5px]">
          <div className="w-2 h-[1.5px] bg-[#00c176] rounded-full opacity-80" />
          <div className="w-2 h-[1.5px] bg-[#00c176] rounded-full opacity-80" />
          <div className="w-2 h-[1.5px] bg-[#ea3941] rounded-full opacity-80" />
          <div className="w-2 h-[1.5px] bg-[#ea3941] rounded-full opacity-80" />
        </div>
      </button>

      <button
        onClick={() => setViewMode("sell")}
        className={`p-1 rounded transition-all duration-200 cursor-pointer ${
          viewMode === "sell" ? "bg-[#1c1e2c]" : "hover:bg-[#13141c]"
        }`}
      >
        <div className="flex flex-col gap-[1.5px]">
          <div className="w-2 h-[1.5px] bg-[#ea3941] rounded-full opacity-80" />
          <div className="w-2 h-[1.5px] bg-[#ea3941] rounded-full opacity-80" />
          <div className="w-2 h-[1.5px] bg-[#ea3941] rounded-full opacity-80" />
          <div className="w-2 h-[1.5px] bg-[#ea3941] rounded-full opacity-80" />
        </div>
      </button>

      <button
        onClick={() => setViewMode("buy")}
        className={`p-1 rounded transition-all duration-200 cursor-pointer ${
          viewMode === "buy" ? "bg-[#1c1e2c]" : "hover:bg-[#13141c]"
        }`}
      >
        <div className="flex flex-col gap-[1.5px]">
          <div className="w-2 h-[1.5px] bg-[#00c176] rounded-full opacity-80" />
          <div className="w-2 h-[1.5px] bg-[#00c176] rounded-full opacity-80" />
          <div className="w-2 h-[1.5px] bg-[#00c176] rounded-full opacity-80" />
          <div className="w-2 h-[1.5px] bg-[#00c176] rounded-full opacity-80" />
        </div>
      </button>
    </div>
  );
}
