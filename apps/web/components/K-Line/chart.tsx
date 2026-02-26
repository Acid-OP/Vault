'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time, ColorType } from 'lightweight-charts';
import { SignalingManager } from '../../utils/Manager';

const INTERVALS = ['1m', '5m', '15m', '1h', '4h', '1d'] as const;

interface KLineChartProps {
  market: string;
}

export default function KLineChart({ market }: KLineChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const [interval, setInterval] = useState<string>('1m');

  // Fetch initial kline data
  useEffect(() => {
    const fetchKlines = async () => {
      try {
        const res = await fetch(`http://localhost:3001/klines?symbol=${market}&interval=${interval}&limit=500`);
        const data = await res.json();

        if (!data.candles || !candlestickSeriesRef.current || !volumeSeriesRef.current) return;

        const candles: CandlestickData<Time>[] = data.candles.map((c: any) => ({
          time: (Math.floor(c.timestamp / 1000)) as Time,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }));

        const volumes = data.candles.map((c: any) => ({
          time: (Math.floor(c.timestamp / 1000)) as Time,
          value: c.volume,
          color: c.close >= c.open ? 'rgba(14, 203, 129, 0.2)' : 'rgba(246, 70, 93, 0.2)',
        }));

        if (candles.length > 0) {
          candlestickSeriesRef.current.setData(candles);
          volumeSeriesRef.current.setData(volumes);

          if (chartRef.current) {
            const ts = chartRef.current.timeScale();
            const visibleBars = 80;
            ts.setVisibleLogicalRange({
              from: candles.length - visibleBars,
              to: candles.length + 5,
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch klines:', err);
      }
    };

    fetchKlines();
  }, [market, interval]);

  // Subscribe to real-time kline updates via WebSocket
  useEffect(() => {
    const manager = SignalingManager.getInstance();
    const callbackId = `kline-chart-${market}-${interval}`;

    manager.sendRaw({
      method: "SUBSCRIBE",
      params: [`kline@${market}@${interval}`]
    });

    manager.registerCallback('kline' as any, (data: any) => {
      if (!data || !data.kline || !candlestickSeriesRef.current || !volumeSeriesRef.current) return;
      if (data.symbol !== market || data.interval !== interval) return;

      const k = data.kline;
      const time = (Math.floor(k.timestamp / 1000)) as Time;

      candlestickSeriesRef.current.update({
        time,
        open: k.open,
        high: k.high,
        low: k.low,
        close: k.close,
      });

      volumeSeriesRef.current.update({
        time,
        value: k.volume,
        color: k.close >= k.open ? 'rgba(14, 203, 129, 0.2)' : 'rgba(246, 70, 93, 0.2)',
      });
    }, callbackId);

    return () => {
      manager.deRegisterCallback('kline' as any, callbackId);
      manager.sendRaw({
        method: "UNSUBSCRIBE",
        params: [`kline@${market}@${interval}`]
      });
    };
  }, [market, interval]);

  // Create and manage the chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#14151b' },
        textColor: '#555a68',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: '#1c1d25' },
        horzLines: { color: '#1c1d25' },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          color: '#555a68',
          width: 1,
          style: 3,
          labelBackgroundColor: '#2a2a3a',
        },
        horzLine: {
          color: '#555a68',
          width: 1,
          style: 3,
          labelBackgroundColor: '#2a2a3a',
        },
      },
      rightPriceScale: {
        borderColor: '#1c1d25',
        scaleMargins: { top: 0.15, bottom: 0.25 },
      },
      timeScale: {
        borderColor: '#1c1d25',
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 6,
        minBarSpacing: 1,
        rightOffset: 5,
        fixLeftEdge: false,
        fixRightEdge: false,
      },
      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
      handleScale: {
        axisPressedMouseMove: { time: true, price: false },
        mouseWheel: true,
        pinch: true,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#0ecb81',
      downColor: '#f6465d',
      borderDownColor: '#f6465d',
      borderUpColor: '#0ecb81',
      wickDownColor: '#f6465d',
      wickUpColor: '#0ecb81',
    });

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width, height } = entries[0].contentRect;
      chart.applyOptions({ width, height });
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candlestickSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#14151b] rounded-lg overflow-hidden">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-[#1c1d25]">
        {INTERVALS.map((iv) => (
          <button
            key={iv}
            onClick={() => setInterval(iv)}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
              interval === iv
                ? 'bg-[#2a2b35] text-[#f0b90b]'
                : 'text-[#555a68] hover:text-[#848e9c]'
            }`}
          >
            {iv}
          </button>
        ))}
      </div>
      <div ref={chartContainerRef} className="flex-1 min-h-0" style={{ touchAction: 'none' }} />
    </div>
  );
}
