import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";
import { UserManager } from "./UserManager.js";
import { Subscription } from "./subscription.js";
import { logger } from "./utils/logger.js";

dotenv.config();
const PORT = Number(process.env.WS_PORT);
const HEARTBEAT_INTERVAL_MS = 30_000;

const wss = new WebSocketServer({ port: PORT });

const aliveClients = new WeakSet<WebSocket>();

wss.on("connection", (ws) => {
  logger.info("ws.connection", {
    message: "New WebSocket connection established",
  });
  aliveClients.add(ws);
  ws.on("pong", () => aliveClients.add(ws));
  UserManager.getInstance().addUsers(ws);
});

wss.on("error", (err) => {
  logger.error("ws.server.error", { error: err.message });
});

// Heartbeat: ping all clients, terminate those that didn't respond
const heartbeat = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!aliveClients.has(ws)) {
      logger.info("ws.heartbeat.terminate", {
        message: "Dead connection removed",
      });
      ws.terminate();
      return;
    }
    aliveClients.delete(ws);
    ws.ping();
  });
}, HEARTBEAT_INTERVAL_MS);

async function shutdown(signal: string) {
  logger.info("ws.shutdown_started", { signal });

  clearInterval(heartbeat);
  wss.close();
  await Subscription.getInstance().cleanup();

  logger.info("ws.shutdown_complete");
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

logger.info("ws.server.started", { port: PORT });
