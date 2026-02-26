import React from 'react';

type ViewMode = 'both' | 'buy' | 'sell';

interface ViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setViewMode('both')}
        className={`p-1.5 rounded transition-colors cursor-pointer ${
          viewMode === 'both' ? 'bg-[#2a2b35]' : 'hover:bg-[#1e1f28]'
        }`}
      >
        <div className="flex flex-col gap-[2px]">
          <div className="w-2.5 h-[2px] bg-[#0ecb81] rounded-full"></div>
          <div className="w-2.5 h-[2px] bg-[#0ecb81] rounded-full"></div>
          <div className="w-2.5 h-[2px] bg-[#f6465d] rounded-full"></div>
          <div className="w-2.5 h-[2px] bg-[#f6465d] rounded-full"></div>
        </div>
      </button>

      <button
        onClick={() => setViewMode('sell')}
        className={`p-1.5 rounded transition-colors cursor-pointer ${
          viewMode === 'sell' ? 'bg-[#2a2b35]' : 'hover:bg-[#1e1f28]'
        }`}
      >
        <div className="flex flex-col gap-[2px]">
          <div className="w-2.5 h-[2px] bg-[#f6465d] rounded-full"></div>
          <div className="w-2.5 h-[2px] bg-[#f6465d] rounded-full"></div>
          <div className="w-2.5 h-[2px] bg-[#f6465d] rounded-full"></div>
          <div className="w-2.5 h-[2px] bg-[#f6465d] rounded-full"></div>
        </div>
      </button>

      <button
        onClick={() => setViewMode('buy')}
        className={`p-1.5 rounded transition-colors cursor-pointer ${
          viewMode === 'buy' ? 'bg-[#2a2b35]' : 'hover:bg-[#1e1f28]'
        }`}
      >
        <div className="flex flex-col gap-[2px]">
          <div className="w-2.5 h-[2px] bg-[#0ecb81] rounded-full"></div>
          <div className="w-2.5 h-[2px] bg-[#0ecb81] rounded-full"></div>
          <div className="w-2.5 h-[2px] bg-[#0ecb81] rounded-full"></div>
          <div className="w-2.5 h-[2px] bg-[#0ecb81] rounded-full"></div>
        </div>
      </button>
    </div>
  );
}
