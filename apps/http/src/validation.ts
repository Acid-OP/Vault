import { z } from "zod";

export const createOrderSchema = z.object({
  market: z.string().regex(/^[A-Z0-9]+_[A-Z]+$/),
  price: z
    .union([z.string(), z.number()])
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
      message: "Price must be a positive number",
    }),
  quantity: z
    .union([z.string(), z.number()])
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
      message: "Quantity must be a positive number",
    }),
  side: z.enum(["buy", "sell"]),
  userId: z.string().min(1),
});

export const cancelOrderSchema = z.object({
  orderId: z.string().min(1),
  market: z.string().regex(/^[A-Z0-9]+_[A-Z]+$/),
});

export const symbolQuerySchema = z.object({
  symbol: z.string().regex(/^[A-Z0-9]+_[A-Z]+$/),
});

export const klineQuerySchema = z.object({
  symbol: z.string().regex(/^[A-Z0-9]+_[A-Z]+$/),
  interval: z
    .enum(["1m", "5m", "15m", "1h", "4h", "1d"])
    .optional()
    .default("1m"),
  limit: z.coerce.number().int().min(1).max(1000).optional().default(500),
});
