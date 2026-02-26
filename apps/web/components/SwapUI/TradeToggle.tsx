import { useState } from "react";

type TradeToggleProps = {
  onChange?: (side: "buy" | "sell") => void;
  initialSide?: "buy" | "sell";
  width?: string; 
};

const TradeToggle: React.FC<TradeToggleProps> = ({onChange, initialSide = "buy", width = "w-80",}) => {
  const [side, setSide] = useState<"buy" | "sell">(initialSide);
  const handleClick = (newSide: "buy" | "sell") => {
    setSide(newSide);
    if (onChange) onChange(newSide);
  };

  return (
    <div className="mb-3">
      <div className={`flex bg-[#1a1b24] rounded-lg p-0.5 relative ${width}`}>
        <div
          className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-md transition-all duration-200 ease-out ${
            side === "buy" ? "left-0.5 bg-[#0e2d23]" : "left-[calc(50%+2px)] bg-[#2d1a1e]"
          }`}
        />
        <button
          onClick={() => handleClick("buy")}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors relative z-10 cursor-pointer ${
            side === "buy" ? "text-[#0ecb81]" : "text-[#4a5068] hover:text-[#0ecb81]"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => handleClick("sell")}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors relative z-10 cursor-pointer ${
            side === "sell" ? "text-[#f6465d]" : "text-[#4a5068] hover:text-[#f6465d]"
          }`}
        >
          Sell
        </button>
      </div>
    </div>
  );
};

export default TradeToggle;
