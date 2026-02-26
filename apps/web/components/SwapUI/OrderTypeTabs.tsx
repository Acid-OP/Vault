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
      <div className="flex mb-3 gap-1">
        <button
          onClick={() => handleClick("limit")}
          className={`px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors rounded ${
            orderType === "limit"
              ? "text-white bg-[#2a2b35]"
              : "text-[#4a5068] hover:text-[#848e9c]"
          }`}
        >
          Limit
        </button>
        <button
          onClick={() => handleClick("market")}
          className={`px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors rounded ${
            orderType === "market"
              ? "text-white bg-[#2a2b35]"
              : "text-[#4a5068] hover:text-[#848e9c]"
          }`}
        >
          Market
        </button>
        <button
          onClick={() => handleClick("conditional")}
          className={`px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors rounded flex items-center gap-1 ${
            orderType === "conditional"
              ? "text-white bg-[#2a2b35]"
              : "text-[#4a5068] hover:text-[#848e9c]"
          }`}
        >
          Conditional
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="flex justify-between items-center mb-3">
        <span className="text-[11px] text-[#4a5068] border-b border-dashed border-[#2a2b35]">
          Balance
        </span>
        <span className="text-[11px] text-[#eaecef]">{balance}</span>
      </div>
    </div>
  );
};

export default OrderTabs;
