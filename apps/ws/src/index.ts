import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import { UserManager } from "./UserManager.js";
import { Subscription } from "./subscription.js";
import { logger } from "./utils/logger.js";

dotenv.config();
const PORT = Number(process.env.WS_PORT);

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
  logger.info("ws.connection", {
    message: "New WebSocket connection established",
  });
  UserManager.getInstance().addUsers(ws);
});

wss.on("error", (err) => {
  logger.error("ws.server.error", { error: err.message });
});

async function shutdown(signal: string) {
  logger.info("ws.shutdown_started", { signal });

  wss.close();
  await Subscription.getInstance().cleanup();

  logger.info("ws.shutdown_complete");
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

logger.info("ws.server.started", { port: PORT });
