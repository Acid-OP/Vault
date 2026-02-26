import React from 'react';

interface TabsProps {
  activeTab: 'book' | 'trades';
  setActiveTab: (tab: 'book' | 'trades') => void;
}

export function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="flex gap-1 px-3 pt-2.5 pb-1">
      <button
        onClick={() => setActiveTab('book')}
        className={`px-2.5 py-1 text-xs font-medium rounded cursor-pointer transition-colors ${
          activeTab === 'book' ? 'text-white bg-[#2a2b35]' : 'text-[#555a68] hover:text-[#848e9c]'
        }`}
      >
        Book
      </button>
      <button
        onClick={() => setActiveTab('trades')}
        className={`px-2.5 py-1 text-xs font-medium rounded cursor-pointer transition-colors ${
          activeTab === 'trades' ? 'text-white bg-[#2a2b35]' : 'text-[#555a68] hover:text-[#848e9c]'
        }`}
      >
        Trades
      </button>
    </div>
  );
}
