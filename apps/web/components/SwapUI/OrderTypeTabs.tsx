import React, { useState } from "react";

type OrderType = "limit" | "market" | "conditional";

type OrderTabsProps = {
  initialType?: OrderType;
  balance?: string;
  onOrderTypeChange?: (type: OrderType) => void;
};

const OrderTabs: React.FC<OrderTabsProps> = ({
  initialType = "limit",
  balance = "-",
  onOrderTypeChange,
}) => {
  const [orderType, setOrderType] = useState<OrderType>(initialType);

  const handleClick = (type: OrderType) => {
    setOrderType(type);
    if (onOrderTypeChange) onOrderTypeChange(type);
  };

  return (
    <div>
      <div className="flex mb-2.5 gap-0.5">
        <button
          onClick={() => handleClick("limit")}
          className={`px-2 py-1 text-[10px] font-medium cursor-pointer transition-colors rounded-[4px] ${
            orderType === "limit"
              ? "text-[#eaecef] bg-[#1c1e2c]"
              : "text-[#3d4354] hover:text-[#848e9c]"
          }`}
        >
          Limit
        </button>
        <button
          onClick={() => handleClick("market")}
          className={`px-2 py-1 text-[10px] font-medium cursor-pointer transition-colors rounded-[4px] ${
            orderType === "market"
              ? "text-[#eaecef] bg-[#1c1e2c]"
              : "text-[#3d4354] hover:text-[#848e9c]"
          }`}
        >
          Market
        </button>
        <button
          onClick={() => handleClick("conditional")}
          className={`px-2 py-1 text-[10px] font-medium cursor-pointer transition-colors rounded-[4px] flex items-center gap-0.5 ${
            orderType === "conditional"
              ? "text-[#eaecef] bg-[#1c1e2c]"
              : "text-[#3d4354] hover:text-[#848e9c]"
          }`}
        >
          Conditional
          <svg
            className="w-2 h-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[9px] text-[#3d4354] uppercase tracking-wider border-b border-dashed border-[rgba(42,46,57,0.4)]">
          Balance
        </span>
        <span className="text-[10px] text-[#848e9c] font-mono tabular-nums">
          {balance}
        </span>
      </div>
    </div>
  );
};

export default OrderTabs;
