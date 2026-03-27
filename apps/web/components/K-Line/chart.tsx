"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
  ColorType,
  CrosshairMode,
  LogicalRange,
} from "lightweight-charts";
import { SignalingManager } from "../../utils/Manager";

const INTERVALS = ["1m", "5m", "15m", "1h", "4h", "1d"] as const;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const HISTORY_FETCH_LIMIT = 300;
const SCROLL_THRESHOLD = 15;

interface VolumeData {
  time: Time;
  value: number;
  color: string;
}

interface KLineChartProps {
  market: string;
}

function volumeColor(open: number, close: number): string {
  return close >= open ? "rgba(0, 193, 118, 0.08)" : "rgba(234, 57, 65, 0.08)";
}

export default function KLineChart({ market }: KLineChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const lastCandleTimeRef = useRef<number>(0);

  const allCandlesRef = useRef<CandlestickData<Time>[]>([]);
  const allVolumesRef = useRef<VolumeData[]>([]);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const oldestTimeRef = useRef<number>(0);

  const [interval, setInterval] = useState<string>("5m");

  const initChart = useCallback(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    }

    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: "#0e0f14" },
        textColor: "#3d4354",
        fontSize: 10,
      },
      grid: {
        vertLines: { color: "rgba(42, 46, 57, 0.25)" },
        horzLines: { color: "rgba(42, 46, 57, 0.25)" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "rgba(120, 130, 155, 0.4)",
          width: 1,
          style: 2,
          labelBackgroundColor: "#1c1e2c",
        },
        horzLine: {
          color: "rgba(120, 130, 155, 0.4)",
          width: 1,
          style: 2,
          labelBackgroundColor: "#1c1e2c",
        },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.38, bottom: 0.38 },
        entireTextOnly: true,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 6,
        minBarSpacing: 1,
        rightOffset: 12,
        fixLeftEdge: false,
        fixRightEdge: false,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
      handleScale: {
        axisPressedMouseMove: { time: true, price: false },
        mouseWheel: true,
        pinch: true,
      },
      width: container.clientWidth,
      height: container.clientHeight,
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#00c176",
      downColor: "#ea3941",
      borderDownColor: "#ea3941",
      borderUpColor: "#00c176",
      wickDownColor: "#ea394150",
      wickUpColor: "#00c17650",
    });

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    return chart;
  }, []);

  useEffect(() => {
    const chart = initChart();
    if (!chart || !candleSeriesRef.current || !volumeSeriesRef.current) return;

    let cancelled = false;
    const abortController = new AbortController();

    allCandlesRef.current = [];
    allVolumesRef.current = [];
    isFetchingRef.current = false;
    hasMoreRef.current = true;
    oldestTimeRef.current = 0;

    const fetchKlines = async () => {
      try {
        const res = await fetch(
          `${API_URL}/klines?symbol=${market}&interval=${interval}&limit=500`,
          { signal: abortController.signal },
        );
        const data = await res.json();
        if (
          cancelled ||
          !data.candles ||
          !candleSeriesRef.current ||
          !volumeSeriesRef.current
        )
          return;

        const candles: CandlestickData<Time>[] = data.candles.map((c: any) => ({
          time: Math.floor(c.timestamp / 1000) as Time,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }));

        const volumes: VolumeData[] = data.candles.map((c: any) => ({
          time: Math.floor(c.timestamp / 1000) as Time,
          value: c.volume,
          color: volumeColor(c.open, c.close),
        }));

        if (candles.length > 0) {
          allCandlesRef.current = candles;
          allVolumesRef.current = volumes;
          oldestTimeRef.current = candles[0]!.time as number;
          const lastCandle = candles[candles.length - 1]!;
          lastCandleTimeRef.current = lastCandle.time as number;

          candleSeriesRef.current.setData(candles);
          volumeSeriesRef.current.setData(volumes);

          const ts = chart.timeScale();
          if (candles.length < 10) {
            ts.fitContent();
          } else {
            const barsToShow = Math.min(candles.length, 80);
            ts.setVisibleLogicalRange({
              from: candles.length - barsToShow,
              to: candles.length + 8,
            });
          }
        }
      } catch (err) {
        if (!cancelled) console.error("Failed to fetch klines:", err);
      }
    };

    const fetchOlderCandles = async () => {
      if (
        isFetchingRef.current ||
        !hasMoreRef.current ||
        !oldestTimeRef.current ||
        cancelled
      )
        return;
      isFetchingRef.current = true;

      try {
        const endTimeMs = oldestTimeRef.current * 1000;
        const res = await fetch(
          `${API_URL}/klines?symbol=${market}&interval=${interval}&limit=${HISTORY_FETCH_LIMIT}&endTime=${endTimeMs}`,
          { signal: abortController.signal },
        );
        const data = await res.json();
        if (
          cancelled ||
          !data.candles ||
          !candleSeriesRef.current ||
          !volumeSeriesRef.current
        )
          return;

        if (data.candles.length === 0) {
          hasMoreRef.current = false;
          return;
        }

        const olderCandles: CandlestickData<Time>[] = data.candles.map(
          (c: any) => ({
            time: Math.floor(c.timestamp / 1000) as Time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
          }),
        );

        const olderVolumes: VolumeData[] = data.candles.map((c: any) => ({
          time: Math.floor(c.timestamp / 1000) as Time,
          value: c.volume,
          color: volumeColor(c.open, c.close),
        }));

        const existingTimes = new Set(
          allCandlesRef.current.map((c) => c.time as number),
        );
        const newCandles = olderCandles.filter(
          (c) => !existingTimes.has(c.time as number),
        );
        const newVolumes = olderVolumes.filter(
          (v) => !existingTimes.has(v.time as number),
        );

        if (newCandles.length === 0) {
          hasMoreRef.current = false;
          return;
        }

        const visibleRange = chart.timeScale().getVisibleLogicalRange();
        const prependCount = newCandles.length;

        allCandlesRef.current = [...newCandles, ...allCandlesRef.current];
        allVolumesRef.current = [...newVolumes, ...allVolumesRef.current];
        oldestTimeRef.current = allCandlesRef.current[0]!.time as number;

        candleSeriesRef.current.setData(allCandlesRef.current);
        volumeSeriesRef.current.setData(allVolumesRef.current);

        if (visibleRange) {
          chart.timeScale().setVisibleLogicalRange({
            from: visibleRange.from + prependCount,
            to: visibleRange.to + prependCount,
          });
        }

        if (data.candles.length < HISTORY_FETCH_LIMIT) {
          hasMoreRef.current = false;
        }
      } catch (err) {
        if (!cancelled) console.error("Failed to fetch older klines:", err);
      } finally {
        isFetchingRef.current = false;
      }
    };

    fetchKlines();

    const onVisibleRangeChange = (range: LogicalRange | null) => {
      if (!range || cancelled) return;
      if (range.from <= SCROLL_THRESHOLD && hasMoreRef.current) {
        fetchOlderCandles();
      }
    };

    chart.timeScale().subscribeVisibleLogicalRangeChange(onVisibleRangeChange);

    const manager = SignalingManager.getInstance();
    const callbackId = `kline-chart-${market}-${interval}`;

    manager.sendRaw({
      method: "SUBSCRIBE",
      params: [`kline@${market}@${interval}`],
    });

    manager.registerCallback(
      "kline" as any,
      (data: any) => {
        if (
          cancelled ||
          !data?.kline ||
          !candleSeriesRef.current ||
          !volumeSeriesRef.current
        )
          return;
        if (data.symbol !== market || data.interval !== interval) return;

        const k = data.kline;
        const time = Math.floor(k.timestamp / 1000) as Time;
        const timeNum = time as number;
        const isNewCandle = timeNum !== lastCandleTimeRef.current;
        lastCandleTimeRef.current = timeNum;

        const candleUpdate: CandlestickData<Time> = {
          time,
          open: k.open,
          high: k.high,
          low: k.low,
          close: k.close,
        };
        const volumeUpdate: VolumeData = {
          time,
          value: k.volume,
          color: volumeColor(k.open, k.close),
        };

        if (isNewCandle) {
          allCandlesRef.current.push(candleUpdate);
          allVolumesRef.current.push(volumeUpdate);
        } else {
          const last = allCandlesRef.current[allCandlesRef.current.length - 1];
          if (last && (last.time as number) === timeNum) {
            allCandlesRef.current[allCandlesRef.current.length - 1] =
              candleUpdate;
            allVolumesRef.current[allVolumesRef.current.length - 1] =
              volumeUpdate;
          }
        }

        candleSeriesRef.current.update(candleUpdate);
        volumeSeriesRef.current.update(volumeUpdate);

        if (isNewCandle && chartRef.current) {
          chartRef.current.timeScale().scrollToRealTime();
        }
      },
      callbackId,
    );

    const container = chartContainerRef.current!;
    const ro = new ResizeObserver((entries) => {
      if (cancelled || !entries[0]) return;
      const { width, height } = entries[0].contentRect;
      chart.applyOptions({ width, height });
    });
    ro.observe(container);

    return () => {
      cancelled = true;
      abortController.abort();
      ro.disconnect();
      chart
        .timeScale()
        .unsubscribeVisibleLogicalRangeChange(onVisibleRangeChange);
      manager.deRegisterCallback("kline" as any, callbackId);
      manager.sendRaw({
        method: "UNSUBSCRIBE",
        params: [`kline@${market}@${interval}`],
      });
      lastCandleTimeRef.current = 0;
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, [market, interval, initChart]);

  return (
    <div className="flex flex-col h-full bg-[#0e0f14] rounded-lg overflow-hidden">
      <div className="flex items-center gap-0.5 px-2.5 py-1.5">
        {INTERVALS.map((iv) => (
          <button
            key={iv}
            onClick={() => setInterval(iv)}
            className={`px-2 py-0.5 text-[10px] font-medium rounded transition-all duration-200 ${
              interval === iv
                ? "bg-[#1c1e2c] text-[#f0b90b]"
                : "text-[#3d4354] hover:text-[#6b7280]"
            }`}
          >
            {iv}
          </button>
        ))}
      </div>
      <div
        ref={chartContainerRef}
        className="flex-1 min-h-0"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
