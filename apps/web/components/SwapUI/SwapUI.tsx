import React, { useState } from 'react';
import TradeToggle from './TradeToggle';
import OrderTabs from './OrderTypeTabs';
import TradeForm from './TradeForm';

export function SwapUI({ market }: { market: string }) {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market' | 'conditional'>('limit');
  const [price, setPrice] = useState('185.65');
  const [quantity, setQuantity] = useState('0');
  const [orderValue, setOrderValue] = useState('0');
  const [percentage, setPercentage] = useState(0);

  const [base, quote] = market.split('_');

  const handlePercentageChange = (value: number) => {
    setPercentage(value);
    // Calculate quantity based on percentage
  };

  return (
    <div className="flex flex-col h-full bg-[#14151b] p-3 pt-2.5">
      <TradeToggle initialSide="buy" width="w-full" onChange={(side) => console.log("Selected side:", side)} />
      <OrderTabs initialType="market" balance="-" onOrderTypeChange={(type) => console.log("Selected type:", type)} />
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

      <div className="mt-auto pt-3 border-t border-[#1a1b24]">
        <span className="text-[11px] text-[#4a5068]">Market Reputation</span>
      </div>
    </div>
  );
}