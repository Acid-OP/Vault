import { randomUUID } from "node:crypto";
import { WebSocket } from "ws";
import { Users } from "./Users.js";
import { Subscription } from "./subscription.js";
import { logger } from "./utils/logger.js";

export class UserManager {
  private static instance: UserManager;
  private users: Map<string, Users> = new Map();

  constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new UserManager();
    }
    return this.instance;
  }

  public addUsers(ws: WebSocket) {
    const id = this.getRandomId();
    const user = new Users(id, ws);
    this.users.set(id, user);
    logger.info("user.connected", { userId: id });
    this.registerOnClose(ws, id);
    return user;
  }

  private registerOnClose(ws: WebSocket, id: string) {
    ws.on("close", () => {
      this.users.delete(id);
      logger.info("user.disconnected", { userId: id });
      Subscription.getInstance().userLeft(id);
    });
  }

  public getUser(id: string) {
    return this.users.get(id);
  }

  private getRandomId() {
    return randomUUID();
  }
}
