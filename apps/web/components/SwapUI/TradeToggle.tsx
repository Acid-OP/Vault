import { useState } from "react";

type TradeToggleProps = {
  onChange?: (side: "buy" | "sell") => void;
  initialSide?: "buy" | "sell";
  width?: string;
};

const TradeToggle: React.FC<TradeToggleProps> = ({
  onChange,
  initialSide = "buy",
  width = "w-80",
}) => {
  const [side, setSide] = useState<"buy" | "sell">(initialSide);
  const handleClick = (newSide: "buy" | "sell") => {
    setSide(newSide);
    if (onChange) onChange(newSide);
  };

  return (
    <div className="mb-2.5">
      <div className={`flex bg-[#13141c] rounded-md p-0.5 relative ${width}`}>
        <div
          className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-[5px] transition-all duration-200 ease-out ${
            side === "buy"
              ? "left-0.5 bg-[#00c176]/12"
              : "left-[calc(50%+2px)] bg-[#ea3941]/12"
          }`}
        />
        <button
          onClick={() => handleClick("buy")}
          className={`flex-1 py-1.5 text-[11px] font-semibold rounded-[5px] transition-colors relative z-10 cursor-pointer ${
            side === "buy"
              ? "text-[#00c176]"
              : "text-[#3d4354] hover:text-[#00c176]/70"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => handleClick("sell")}
          className={`flex-1 py-1.5 text-[11px] font-semibold rounded-[5px] transition-colors relative z-10 cursor-pointer ${
            side === "sell"
              ? "text-[#ea3941]"
              : "text-[#3d4354] hover:text-[#ea3941]/70"
          }`}
        >
          Sell
        </button>
      </div>
    </div>
  );
};

export default TradeToggle;
