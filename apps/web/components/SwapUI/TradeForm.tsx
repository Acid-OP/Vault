import React, { useState } from "react";

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

const TradeForm: React.FC<TradeFormProps> = ({
  price,
  setPrice,
  quantity,
  setQuantity,
  percentage,
  handlePercentageChange,
  orderValue,
  setOrderValue,
}) => {
  const [postOnly, setPostOnly] = useState(false);
  const [ioc, setIoc] = useState(false);
  return (
    <div className="flex flex-col">
      <div className="mb-2.5">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] text-[#3d4354] uppercase tracking-wider">
            Price
          </span>
          <div className="flex gap-1.5">
            <button className="text-[9px] text-[#00c176] hover:text-[#00c176]/70 font-medium transition-colors">
              Mid
            </button>
            <button className="text-[9px] text-[#00c176] hover:text-[#00c176]/70 font-medium transition-colors">
              BBO
            </button>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-[#13141c] text-[#eaecef] text-[13px] font-semibold font-mono tabular-nums px-3 py-2 rounded-md border border-[rgba(42,46,57,0.2)] focus:outline-none focus:border-[rgba(42,46,57,0.5)] transition-colors"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-4.5 h-4.5 bg-[#00c176] rounded-full flex items-center justify-center">
            <span className="text-white text-[9px] font-bold">$</span>
          </button>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] text-[#3d4354] uppercase tracking-wider">
            Quantity
          </span>
          <button className="p-0.5 hover:bg-[#1c1e2c] rounded transition-colors">
            <svg
              className="w-3 h-3 text-[#3d4354]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-[#13141c] text-[#eaecef] text-[13px] font-semibold font-mono tabular-nums px-3 py-2 rounded-md border border-[rgba(42,46,57,0.2)] focus:outline-none focus:border-[rgba(42,46,57,0.5)] transition-colors"
          />
        </div>
      </div>

      <div className="mb-2.5">
        <input
          type="range"
          min="0"
          max="100"
          value={percentage}
          onChange={(e) => handlePercentageChange(Number(e.target.value))}
          className="w-full h-0.5 bg-[#1c1e2c] rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #00c176 0%, #00c176 ${percentage}%, #1c1e2c ${percentage}%, #1c1e2c 100%)`,
          }}
        />
        <div className="flex justify-between items-center mt-0.5">
          <span className="text-[8px] text-[#3d4354] font-mono">0</span>
          <span className="text-[9px] text-[#848e9c] font-medium font-mono tabular-nums">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] text-[#3d4354] uppercase tracking-wider">
            Order Value
          </span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={orderValue}
            onChange={(e) => setOrderValue(e.target.value)}
            className="w-full bg-[#13141c] text-[#eaecef] text-[13px] font-semibold font-mono tabular-nums px-3 py-2 rounded-md border border-[rgba(42,46,57,0.2)] focus:outline-none focus:border-[rgba(42,46,57,0.5)] transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4.5 h-4.5 bg-[#00c176] rounded-full flex items-center justify-center">
            <span className="text-white text-[9px] font-bold">$</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <button className="w-full py-2 bg-[#eaecef] text-[#0e0f14] cursor-pointer text-[11px] font-semibold rounded-md hover:bg-white transition-colors">
          Sign up to trade
        </button>
        <button className="w-full py-2 bg-[#13141c] text-[#848e9c] cursor-pointer text-[11px] font-semibold rounded-md hover:bg-[#1c1e2c] transition-colors border border-[rgba(42,46,57,0.25)]">
          Sign in to trade
        </button>
      </div>

      <div className="flex gap-4 mt-2.5">
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <div
            onClick={() => setPostOnly(!postOnly)}
            className={`w-3 h-3 rounded-[3px] border flex items-center justify-center transition-colors ${
              postOnly
                ? "bg-[#00c176] border-[#00c176]"
                : "bg-transparent border-[#3d4354]"
            }`}
          >
            {postOnly && (
              <svg
                className="w-2 h-2 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span className="text-[9px] text-[#3d4354]">Post Only</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <div
            onClick={() => setIoc(!ioc)}
            className={`w-3 h-3 rounded-[3px] border flex items-center justify-center transition-colors ${
              ioc
                ? "bg-[#00c176] border-[#00c176]"
                : "bg-transparent border-[#3d4354]"
            }`}
          >
            {ioc && (
              <svg
                className="w-2 h-2 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span className="text-[9px] text-[#3d4354]">IOC</span>
        </label>
      </div>
    </div>
  );
};

export default TradeForm;
