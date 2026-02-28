import React, { useState, useEffect, useRef, useCallback } from "react";
import { Tabs } from "./Tabs";
import { ViewToggle } from "./ViewToggle";
import { OrderbookHeader } from "./OrderbookHeader";
import BuySellPressure from "./BuySellPressure";
import BidOrders from "./BidOrders";
import CurrentPrice from "./CurrentPrice";
import AskOrders from "./AskOrders";
import { SignalingManager, DepthUpdate } from "../../utils/Manager";
import { getDepth } from "../../utils/httpClient";

interface Order {
  price: string;
  size: string;
  total: string;
}

interface OrderbookProps {
  market: string;
  baseAsset: string;
  quoteAsset: string;
}

const Orderbook: React.FC<OrderbookProps> = ({
  market,
  baseAsset,
  quoteAsset,
}) => {
  const [activeTab, setActiveTab] = useState<"book" | "trades">("book");
  const [viewMode, setViewMode] = useState<"both" | "buy" | "sell">("both");
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [buyPercentage, setBuyPercentage] = useState(50);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [flashBids, setFlashBids] = useState<Set<string>>(new Set());
  const [flashAsks, setFlashAsks] = useState<Set<string>>(new Set());
  const prevBidsRef = useRef<Map<string, string>>(new Map());
  const prevAsksRef = useRef<Map<string, string>>(new Map());
  const flashTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const detectChanges = useCallback(
    (newOrders: Order[], prevMap: Map<string, string>): Set<string> => {
      const changed = new Set<string>();
      newOrders.forEach((order) => {
        const prev = prevMap.get(order.price);
        if (prev === undefined || prev !== order.size) {
          changed.add(order.price);
        }
      });
      return changed;
    },
    [],
  );

  const updateOrders = useCallback(
    (newBids: Order[], newAsks: Order[]) => {
      const bidChanges = detectChanges(newBids, prevBidsRef.current);
      const askChanges = detectChanges(newAsks, prevAsksRef.current);

      if (bidChanges.size > 0) setFlashBids(bidChanges);
      if (askChanges.size > 0) setFlashAsks(askChanges);

      prevBidsRef.current = new Map(newBids.map((b) => [b.price, b.size]));
      prevAsksRef.current = new Map(newAsks.map((a) => [a.price, a.size]));

      setBids(newBids);
      setAsks(newAsks);

      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => {
        setFlashBids(new Set());
        setFlashAsks(new Set());
      }, 400);
    },
    [detectChanges],
  );

  useEffect(() => {
    const manager = SignalingManager.getInstance();
    const depthCallbackId = `orderbook-depth-${market}`;
    const tickerCallbackId = `orderbook-ticker-${market}`;

    manager.subscribe(market);

    getDepth(market)
      .then((depth) => {
        if (depth && depth.bids && depth.asks) {
          const validBids = depth.bids.filter(
            ([, size]: [string, string]) => parseFloat(size) > 0,
          );
          const validAsks = depth.asks.filter(
            ([, size]: [string, string]) => parseFloat(size) > 0,
          );
          let bidTotal = 0;
          const b = validBids.map(([price, size]: [string, string]) => {
            bidTotal += parseFloat(size);
            return {
              price: parseFloat(price).toFixed(2),
              size: parseFloat(size).toFixed(2),
              total: bidTotal.toFixed(2),
            };
          });
          let askTotal = 0;
          const a = validAsks.map(([price, size]: [string, string]) => {
            askTotal += parseFloat(size);
            return {
              price: parseFloat(price).toFixed(2),
              size: parseFloat(size).toFixed(2),
              total: askTotal.toFixed(2),
            };
          });
          updateOrders(b, a);
          const total = bidTotal + askTotal;
          if (total > 0) setBuyPercentage((bidTotal / total) * 100);
        }
      })
      .catch((err) => console.error("Failed to fetch initial depth:", err));

    manager.registerCallback(
      "depth",
      (depth: DepthUpdate) => {
        if (depth.symbol !== market) return;

        const validBids = depth.bids.filter(([, size]) => parseFloat(size) > 0);
        const validAsks = depth.asks.filter(([, size]) => parseFloat(size) > 0);

        let askRunningTotal = 0;
        const transformedAsks: Order[] = validAsks.map(([price, size]) => {
          askRunningTotal += parseFloat(size);
          return {
            price: parseFloat(price).toFixed(2),
            size: parseFloat(size).toFixed(2),
            total: askRunningTotal.toFixed(2),
          };
        });

        let bidRunningTotal = 0;
        const transformedBids: Order[] = validBids.map(([price, size]) => {
          bidRunningTotal += parseFloat(size);
          return {
            price: parseFloat(price).toFixed(2),
            size: parseFloat(size).toFixed(2),
            total: bidRunningTotal.toFixed(2),
          };
        });

        updateOrders(transformedBids, transformedAsks);

        const totalVolume = bidRunningTotal + askRunningTotal;
        if (totalVolume > 0) {
          setBuyPercentage((bidRunningTotal / totalVolume) * 100);
        }
      },
      depthCallbackId,
    );

    manager.registerCallback(
      "ticker",
      (ticker) => {
        if (ticker.symbol !== market) return;
        setCurrentPrice(parseFloat(ticker.lastPrice));
        setPriceChange(parseFloat(ticker.priceChange));
      },
      tickerCallbackId,
    );

    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      manager.deRegisterCallback("depth", depthCallbackId);
      manager.deRegisterCallback("ticker", tickerCallbackId);
      manager.unsubscribe(market);
    };
  }, [market, updateOrders]);

  const calculateBarWidth = (total: string, maxTotal: number): number => {
    if (maxTotal === 0) return 0;
    return (parseFloat(total) / maxTotal) * 100;
  };

  const calculateSizeBarWidth = (size: string, maxTotal: number): number => {
    if (maxTotal === 0) return 0;
    return (parseFloat(size) / maxTotal) * 100;
  };

  const maxTotal: number = Math.max(
    ...asks.map((a) => parseFloat(a.total)),
    ...bids.map((b) => parseFloat(b.total)),
    1,
  );

  return (
    <div className="flex flex-col h-full text-[#b7bdc6] text-xs select-none bg-[#0e0f14]">
      <div className="flex-shrink-0">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex items-center justify-between px-3 py-0.5">
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        <OrderbookHeader baseAsset={baseAsset} quoteAsset={quoteAsset} />
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col justify-end overflow-hidden">
          <div className="overflow-y-auto scrollbar-none flex flex-col-reverse">
            <AskOrders
              asks={asks}
              maxTotal={maxTotal}
              calculateBarWidth={calculateBarWidth}
              calculateSizeBarWidth={calculateSizeBarWidth}
              flashPrices={flashAsks}
            />
          </div>
        </div>

        <div className="flex-shrink-0">
          <CurrentPrice currentPrice={currentPrice} priceChange={priceChange} />
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="overflow-y-auto scrollbar-none h-full">
            <BidOrders
              bids={bids}
              maxTotal={maxTotal}
              calculateBarWidth={calculateBarWidth}
              calculateSizeBarWidth={calculateSizeBarWidth}
              flashPrices={flashBids}
            />
          </div>
        </div>
      </div>

      <div className="flex-shrink-0">
        <BuySellPressure buyPercentage={buyPercentage} />
      </div>
    </div>
  );
};

export default Orderbook;
