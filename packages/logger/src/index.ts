import * as winston from "winston";
import { CreateLoggerOptions } from "./types.js";

export function createLogger(options: CreateLoggerOptions) {
  const { service, level = process.env.LOG_LEVEL || "info" } = options;

  return winston.createLogger({
    level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    defaultMeta: {
      service,
      pid: process.pid,
    },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const metaStr =
              Object.keys(meta).length > 0 ? JSON.stringify(meta) : "";
            return `${timestamp} [${level}] [${service}] ${message} ${metaStr}`;
          }),
        ),
      }),
    ],
  });
}

export type Logger = winston.Logger;
export type { CreateLoggerOptions } from "./types.js";
