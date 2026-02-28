import express from "express";
import dotenv from "dotenv";
import "./Engine/main/dequeue";
import cors from "cors";
import { Manager } from "./RedisClient";
import { CANCEL_ORDER, CREATE_ORDER } from "./types/orders";
import { logger } from "./utils/logger.js";
import {
  balanceQuerySchema,
  cancelOrderSchema,
  createOrderSchema,
  klineQuerySchema,
  symbolQuerySchema,
} from "./validation";
import {
  getEngine,
  stopDequeue,
  startDepthSnapshotTimer,
  stopDepthSnapshotTimer,
} from "./Engine/main/dequeue";
import { RedisManager } from "./Engine/RedisManager";
import { DbBatcher } from "@repo/db-writer";

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
const PORT = process.env.HTTP_PORT;

// Simple in-memory rate limiter for order routes (per userId)
const ORDER_RATE_LIMIT = 10; // max requests per window
const ORDER_RATE_WINDOW_MS = 1_000; // 1 second window
const orderRateMap = new Map<string, { count: number; resetAt: number }>();

function checkOrderRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = orderRateMap.get(userId);
  if (!entry || now > entry.resetAt) {
    orderRateMap.set(userId, { count: 1, resetAt: now + ORDER_RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= ORDER_RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// Clean up stale entries every 60s
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of orderRateMap) {
    if (now > entry.resetAt) orderRateMap.delete(key);
  }
}, 60_000);

app.post("/order", async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.issues });
    return;
  }
  const { market, price, quantity, side, userId } = parsed.data;
  if (!checkOrderRateLimit(userId)) {
    res.status(429).json({ error: "Rate limit exceeded" });
    return;
  }
  logger.info("http.post_order", { market, price, quantity, side, userId });
  try {
    const data = {
      type: CREATE_ORDER,
      data: {
        market,
        price,
        quantity,
        side,
        userId,
      },
    };
    const response = await Manager.getInstance().Enqueue(data);
    logger.info("order.response", { payload: response.payload });
    res.json(response.payload);
  } catch (err) {
    logger.error("order.queue_failed", { error: err });
    res.status(500).json({ error: "Failed to queue order" });
  }
});

app.delete("/order", async (req, res) => {
  const parsed = cancelOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.issues });
    return;
  }
  const { orderId, market } = parsed.data;
  if (!checkOrderRateLimit(orderId)) {
    res.status(429).json({ error: "Rate limit exceeded" });
    return;
  }
  logger.info("http.delete_order", { orderId, market });
  try {
    const response = await Manager.getInstance().Enqueue({
      type: CANCEL_ORDER,
      data: {
        orderId,
        market,
      },
    });
    logger.info("order.cancel_response", { payload: response.payload });
    res.json(response.payload);
  } catch (e) {
    logger.error("order.cancel_failed", { error: e });
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

app.get("/depth", async (req, res) => {
  const parsed = symbolQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.issues });
    return;
  }
  const { symbol } = parsed.data;
  logger.info("http.get_depth", { symbol });
  try {
    const engine = getEngine();
    if (!engine) {
      res.status(503).json({ error: "Engine not ready" });
      return;
    }
    const depth = engine.getDepthDirect(symbol);
    res.json(depth);
  } catch (e) {
    logger.error("depth.failed", { error: e });
    res.status(500).json({ error: "Failed to get depth" });
  }
});

app.get("/tickers", async (req, res) => {
  const parsed = symbolQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.issues });
    return;
  }
  const { symbol } = parsed.data;
  logger.info("http.get_tickers", { symbol });
  try {
    const engine = getEngine();
    if (!engine) {
      res.status(503).json({ error: "Engine not ready" });
      return;
    }
    const ticker = engine.getTickerDirect(symbol);
    res.json(ticker);
  } catch (e) {
    logger.error("ticker.failed", { error: e });
    res.status(500).json({ error: "Failed to get ticker" });
  }
});

app.get("/klines", async (req, res) => {
  const parsed = klineQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.issues });
    return;
  }
  const { symbol, interval, limit } = parsed.data;
  logger.info("http.get_klines", { symbol, interval, limit });
  try {
    const engine = getEngine();
    if (!engine) {
      res.status(503).json({ error: "Engine not ready" });
      return;
    }
    const klines = engine.getKlineDirect(symbol, interval, limit);
    res.json(klines);
  } catch (e) {
    logger.error("klines.failed", { error: e });
    res.status(500).json({ error: "Failed to get klines" });
  }
});

app.get("/balance", async (req, res) => {
  const parsed = balanceQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.issues });
    return;
  }
  const { userId } = parsed.data;
  try {
    const engine = getEngine();
    if (!engine) {
      res.status(503).json({ error: "Engine not ready" });
      return;
    }
    const balance = engine.getBalanceDirect(userId);
    res.json({ userId, balances: balance });
  } catch (e) {
    logger.error("balance.failed", { error: e });
    res.status(500).json({ error: "Failed to get balance" });
  }
});

let server: ReturnType<typeof app.listen>;
let batcher: DbBatcher | null = null;

async function start() {
  await Manager.waitForReady();
  logger.info("redis.ready");

  batcher = new DbBatcher();
  await batcher.start();
  logger.info("db_batcher.started");

  startDepthSnapshotTimer();

  server = app.listen(PORT, () => {
    logger.info("http.server_started", { port: PORT });
  });
}

async function shutdown(signal: string) {
  logger.info("http.shutdown_started", { signal });

  server?.close();
  stopDepthSnapshotTimer();
  stopDequeue();

  if (batcher) {
    await batcher.stop();
  }

  await Manager.getInstance().cleanup();
  await RedisManager.getInstance().cleanup();

  logger.info("http.shutdown_complete");
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

start().catch((err) => {
  logger.error("http.startup_failed", { error: err });
  process.exit(1);
});
