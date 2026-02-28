"use client";
import { useParams } from "next/navigation";
import { MarketBar } from "../../../components/Ticker/MarketBar";
import { SwapUI } from "../../../components/SwapUI/SwapUI";
import Orderbook from "../../../components/depth/Depth";
import KLineChart from "../../../components/K-Line/chart";

export default function Home() {
  const { market } = useParams();
  const [baseAsset, quoteAsset] = (market?.toString() || "BTC-USDT").split("_");
  const base = baseAsset as string;
  const quote = quoteAsset as string;
  return (
    <div className="flex flex-row h-full bg-[#0e0f14] gap-1 p-1.5 overflow-hidden">
      <div className="flex flex-col flex-1 min-w-0 min-h-0 gap-1">
        <div className="shrink-0">
          <MarketBar market={market as string} />
        </div>
        <div className="flex flex-row flex-1 min-h-0 gap-1">
          <div className="flex-1 min-w-0 min-h-0">
            <KLineChart market={market as string} />
          </div>
          <div className="w-[270px] shrink-0 bg-[#0e0f14] rounded-lg overflow-hidden border border-[rgba(42,46,57,0.2)]">
            <Orderbook
              market={market as string}
              baseAsset={base}
              quoteAsset={quote}
            />
          </div>
        </div>
      </div>
      <div className="w-[270px] shrink-0">
        <div className="flex flex-col h-full bg-[#0e0f14] rounded-lg overflow-hidden border border-[rgba(42,46,57,0.2)]">
          <SwapUI market={market as string} />
        </div>
      </div>
    </div>
  );
}
