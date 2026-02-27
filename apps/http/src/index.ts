import express from "express";
import dotenv from "dotenv";
import "./Engine/main/dequeue";
import cors from "cors";
import { Manager } from "./RedisClient";
import {
  CANCEL_ORDER,
  CREATE_ORDER,
  GET_DEPTH,
  GET_KLINE,
  GET_TICKER,
} from "./types/orders";
import { logger } from "./utils/logger.js";

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

app.post("/order", async (req, res) => {
  const { market, price, quantity, side, userId } = req.body;
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
    res.status(500).send({ error: "Failed to queue order" });
  }
});

app.delete("/order", async (req, res) => {
  const { orderId, market } = req.body;
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
  }
});

app.get("/depth", async (req, res) => {
  const { symbol } = req.query;
  logger.info("http.get_depth", { symbol });
  try {
    const response = await Manager.getInstance().Enqueue({
      type: GET_DEPTH,
      data: {
        market: symbol as string,
      },
    });
    logger.info("depth.response", { payload: response.payload });
    res.json(response.payload);
  } catch (e) {
    logger.error("depth.failed", { error: e });
  }
});

app.get("/tickers", async (req, res) => {
  const { symbol } = req.query;
  logger.info("http.get_tickers", { symbol });
  try {
    const response = await Manager.getInstance().Enqueue({
      type: GET_TICKER,
      data: {
        market: symbol as string,
      },
    });
    logger.info("ticker.response", { payload: response.payload });
    res.json(response.payload);
  } catch (e) {
    logger.error("ticker.failed", { error: e });
  }
});

app.get("/klines", async (req, res) => {
  const { symbol, interval, limit } = req.query;
  logger.info("http.get_klines", { symbol, interval, limit });
  try {
    const response = await Manager.getInstance().Enqueue({
      type: GET_KLINE,
      data: {
        market: symbol as string,
        interval: (interval as string) || "1m",
        limit: limit ? parseInt(limit as string) : 500,
      },
    });
    res.json(response.payload);
  } catch (e) {
    logger.error("klines.failed", { error: e });
    res.status(500).send({ error: "Failed to get klines" });
  }
});

app.listen(PORT, () => {
  logger.info("http.server_started", { port: PORT });
});
