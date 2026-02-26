import React, { useState } from 'react';

interface TradeFormProps {
  price: string;
  setPrice: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  percentage: number;
  handlePercentageChange: (value: number) => void;
  orderValue: string;
  setOrderValue: (value: string) => void;
}

const TradeForm: React.FC<TradeFormProps> = ({ price, setPrice, quantity, setQuantity, percentage, handlePercentageChange, orderValue, setOrderValue }) => {
    const [postOnly, setPostOnly] = useState(false);
    const [ioc, setIoc] = useState(false);
    return (
    <div className="flex flex-col">
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] text-[#4a5068]">Price</span>
          <div className="flex gap-2">
            <button className="text-[10px] text-[#3b82f6] hover:text-[#60a5fa] font-medium">Mid</button>
            <button className="text-[10px] text-[#3b82f6] hover:text-[#60a5fa] font-medium">BBO</button>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-[#1a1b24] text-[#eaecef] text-base font-semibold font-mono tabular-nums px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3b82f6]/50"
          />
          <button className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#0ecb81] rounded-full flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">$</span>
          </button>
        </div>
      </div>

      <div className="mb-2.5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] text-[#4a5068]">Quantity</span>
          <button className="p-0.5 hover:bg-[#1a1b24] rounded">
            <svg className="w-3.5 h-3.5 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-[#1a1b24] text-[#eaecef] text-base font-semibold font-mono tabular-nums px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3b82f6]/50"
          />
        </div>
      </div>

      <div className="mb-3">
        <input
          type="range"
          min="0"
          max="100"
          value={percentage}
          onChange={(e) => handlePercentageChange(Number(e.target.value))}
          className="w-full h-1 bg-[#1a1b24] rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #1a1b24 ${percentage}%, #1a1b24 100%)`
          }}
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-[10px] text-[#4a5068]">0</span>
          <span className="text-[10px] text-[#eaecef] font-medium font-mono">{percentage}%</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] text-[#4a5068]">Order Value</span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={orderValue}
            onChange={(e) => setOrderValue(e.target.value)}
            className="w-full bg-[#1a1b24] text-[#eaecef] text-base font-semibold font-mono tabular-nums px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3b82f6]/50"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#0ecb81] rounded-full flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">$</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button className="w-full py-2.5 bg-white text-[#0e0f14] cursor-pointer text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors">
          Sign up to trade
        </button>
        <button className="w-full py-2.5 bg-[#1a1b24] text-[#eaecef] cursor-pointer text-xs font-semibold rounded-lg hover:bg-[#23242d] transition-colors border border-[#2a2b35]">
          Sign in to trade
        </button>
      </div>

      <div className="flex gap-4 mt-3">
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <div
            onClick={() => setPostOnly(!postOnly)}
            className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
              postOnly ? 'bg-[#3b82f6] border-[#3b82f6]' : 'bg-transparent border-[#4a5068]'
            }`}
          >
            {postOnly && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-[11px] text-[#4a5068]">Post Only</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <div
            onClick={() => setIoc(!ioc)}
            className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
              ioc ? 'bg-[#3b82f6] border-[#3b82f6]' : 'bg-transparent border-[#4a5068]'
            }`}
          >
            {ioc && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-[11px] text-[#4a5068]">IOC</span>
        </label>
      </div>
    </div>
  );
};

export default TradeForm;
