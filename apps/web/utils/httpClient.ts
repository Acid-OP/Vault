import axios from "axios";
import { Depth, KLine, Ticker, Trade } from "./type";

const BASE_URL = "http://localhost:3001";

export async function getTicker(market: string): Promise<Ticker> {
  const response = await axios.get(`${BASE_URL}/tickers?symbol=${market}`);
  return response.data;
}

export async function getTickers(): Promise<Ticker[]> {
  const response = await axios.get(`${BASE_URL}/tickers`);
  return response.data;
}

export async function getDepth(market: string): Promise<Depth> {
  const response = await axios.get(`${BASE_URL}/depth?symbol=${market}`);
  return response.data;
}

export async function getTrades(market: string): Promise<Trade[]> {
  const response = await axios.get(
    `${BASE_URL}/trades?symbol=${market}&limit=100`,
  );
  return response.data;
}

export async function getBalance(
  userId: string,
): Promise<Record<string, { available: number; locked: number }>> {
  const response = await axios.get(`${BASE_URL}/balance?userId=${userId}`);
  return response.data.balances;
}

export async function getKlines(
  market: string,
  interval: string,
  startTime: number,
  endTime: number,
): Promise<KLine[]> {
  const response = await axios.get(
    `${BASE_URL}/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`,
  );
  const data: KLine[] = response.data;
  return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}
