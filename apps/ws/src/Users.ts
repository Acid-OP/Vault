import { WebSocket } from "ws";
import {
  IncomingMessage,
  OutgoingMessage,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from "./types/Users.js";
import { Subscription } from "./subscription.js";
import { logger } from "./utils/logger.js";

export class Users {
  private id: string;
  private ws: WebSocket;

  constructor(id: string, ws: WebSocket) {
    this.id = id;
    this.ws = ws;
    logger.info("user.created", { userId: id });
    this.Listners();
  }

  emit(message: OutgoingMessage) {
    this.ws.send(JSON.stringify(message));
    logger.info("user.message.sent", { userId: this.id, message });
  }

  private isValidMessage(data: unknown): data is IncomingMessage {
    if (typeof data !== "object" || data === null) return false;
    const msg = data as Record<string, unknown>;
    if (msg.method !== SUBSCRIBE && msg.method !== UNSUBSCRIBE) return false;
    if (!Array.isArray(msg.params)) return false;
    if (msg.params.length === 0 || msg.params.length > 10) return false;
    return msg.params.every(
      (p: unknown) => typeof p === "string" && p.length < 50,
    );
  }

  private Listners() {
    this.ws.on("message", async (message: string) => {
      logger.info("user.message.received", {
        userId: this.id,
        raw: message.toString(),
      });
      try {
        const parsed = JSON.parse(message.toString());

        if (!this.isValidMessage(parsed)) {
          logger.warn("user.message.invalid", { userId: this.id });
          this.ws.send(JSON.stringify({ error: "Invalid message format" }));
          return;
        }

        if (parsed.method === SUBSCRIBE) {
          logger.info("user.subscribing", {
            userId: this.id,
            params: parsed.params,
          });
          for (const sub of parsed.params) {
            await Subscription.getInstance().subscribe(this.id, sub);
            logger.info("user.subscribed", {
              userId: this.id,
              subscription: sub,
            });
          }
        }

        if (parsed.method === UNSUBSCRIBE) {
          logger.info("user.unsubscribing", {
            userId: this.id,
            params: parsed.params,
          });
          for (const sub of parsed.params) {
            await Subscription.getInstance().unsubscribe(this.id, sub);
            logger.info("user.unsubscribed", {
              userId: this.id,
              subscription: sub,
            });
          }
        }
      } catch (error) {
        logger.error("user.message.error", { userId: this.id, error });
        this.ws.send(JSON.stringify({ error: "Malformed JSON" }));
      }
    });

    this.ws.on("error", (error) => {
      logger.error("user.ws.error", { userId: this.id, error });
    });

    this.ws.on("close", () => {
      logger.info("user.ws.closed", { userId: this.id });
    });
  }
}
