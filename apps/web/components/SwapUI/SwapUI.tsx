import React, { useState } from "react";
import TradeToggle from "./TradeToggle";
import OrderTabs from "./OrderTypeTabs";
import TradeForm from "./TradeForm";

export function SwapUI({ market }: { market: string }) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<
    "limit" | "market" | "conditional"
  >("limit");
  const [price, setPrice] = useState("185.65");
  const [quantity, setQuantity] = useState("0");
  const [orderValue, setOrderValue] = useState("0");
  const [percentage, setPercentage] = useState(0);

  const [base, quote] = market.split("_");

  const handlePercentageChange = (value: number) => {
    setPercentage(value);
  };

  return (
    <div className="flex flex-col h-full bg-[#0e0f14] p-3 pt-2">
      <TradeToggle
        initialSide="buy"
        width="w-full"
        onChange={(s) => setSide(s)}
      />
      <OrderTabs
        initialType="market"
        balance="-"
        onOrderTypeChange={(t) => setOrderType(t)}
      />
      <TradeForm
        price={price}
        setPrice={setPrice}
        quantity={quantity}
        setQuantity={setQuantity}
        percentage={percentage}
        handlePercentageChange={handlePercentageChange}
        orderValue={orderValue}
        setOrderValue={setOrderValue}
      />

      <div className="mt-auto pt-2.5 border-t border-[rgba(42,46,57,0.25)]">
        <span className="text-[9px] text-[#3d4354] uppercase tracking-wider">
          Market Reputation
        </span>
      </div>
    </div>
  );
}
