import { createLogger, Logger } from "@repo/logger";

export const logger: Logger = createLogger({ service: "http" });
