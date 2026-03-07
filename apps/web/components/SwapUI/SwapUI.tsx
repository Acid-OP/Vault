import React, { useState, useEffect, useCallback } from "react";
import TradeToggle from "./TradeToggle";
import OrderTabs from "./OrderTypeTabs";
import TradeForm from "./TradeForm";
import { getBalance, placeOrder } from "../../utils/httpClient";

// Temp userId until auth is implemented
const USER_ID = "default-user";

export function SwapUI({ market }: { market: string }) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<
    "limit" | "market" | "conditional"
  >("limit");
  const [price, setPrice] = useState("185.65");
  const [quantity, setQuantity] = useState("0");
  const [orderValue, setOrderValue] = useState("0");
  const [percentage, setPercentage] = useState(0);
  const [balanceStr, setBalanceStr] = useState("-");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [base, quote] = market.split("_");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balances = await getBalance(USER_ID);
        const asset = side === "buy" ? quote : base;
        const bal = asset ? balances[asset] : null;
        if (bal) {
          setBalanceStr(`${bal.available.toFixed(2)} ${asset}`);
        }
      } catch {
        setBalanceStr("-");
      }
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, [side, base, quote]);

  const handlePercentageChange = (value: number) => {
    setPercentage(value);
  };

  const handleSubmit = useCallback(async () => {
    const numPrice = parseFloat(price);
    const numQty = parseFloat(quantity);

    if (isNaN(numPrice) || numPrice <= 0) {
      setFeedback({ type: "error", message: "Invalid price" });
      return;
    }
    if (isNaN(numQty) || numQty <= 0) {
      setFeedback({ type: "error", message: "Invalid quantity" });
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const result = await placeOrder({
        market,
        price: numPrice,
        quantity: numQty,
        side,
        userId: USER_ID,
      });
      setFeedback({
        type: "success",
        message: `Order placed — filled ${result.executedQty} of ${numQty}`,
      });
      setQuantity("0");
      setPercentage(0);
      setOrderValue("0");
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || "Order failed";
      setFeedback({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }, [market, price, quantity, side]);

  return (
    <div className="flex flex-col h-full bg-[#0e0f14] p-3 pt-2">
      <TradeToggle
        initialSide="buy"
        width="w-full"
        onChange={(s) => setSide(s)}
      />
      <OrderTabs
        initialType="market"
        balance={balanceStr}
        onOrderTypeChange={(t) => setOrderType(t)}
      />
      <TradeForm
        side={side}
        price={price}
        setPrice={setPrice}
        quantity={quantity}
        setQuantity={setQuantity}
        percentage={percentage}
        handlePercentageChange={handlePercentageChange}
        orderValue={orderValue}
        setOrderValue={setOrderValue}
        onSubmit={handleSubmit}
        loading={loading}
        feedback={feedback}
      />

      <div className="mt-auto pt-2.5 border-t border-[rgba(42,46,57,0.25)]">
        <span className="text-[9px] text-[#3d4354] uppercase tracking-wider">
          Market Reputation
        </span>
      </div>
    </div>
  );
}
