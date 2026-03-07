/*
  Warnings:

  - The primary key for the `ohlcv_candles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ohlcv_candles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."ohlcv_candles_symbol_interval_openTime_key";

-- AlterTable
ALTER TABLE "public"."ohlcv_candles" DROP CONSTRAINT "ohlcv_candles_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ohlcv_candles_pkey" PRIMARY KEY ("symbol", "interval", "openTime");

-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Convert to hypertable partitioned by openTime (1 day chunks)
SELECT create_hypertable(
  'ohlcv_candles',
  by_range('openTime', 86400000)
);

-- Register integer_now function so TimescaleDB knows "now" for integer time columns
CREATE OR REPLACE FUNCTION ohlcv_now() RETURNS BIGINT
LANGUAGE SQL STABLE AS $$ SELECT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT $$;

SELECT set_integer_now_func('ohlcv_candles', 'ohlcv_now');

-- Compress chunks older than 7 days
ALTER TABLE ohlcv_candles SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'symbol,interval',
  timescaledb.compress_orderby = '"openTime" DESC'
);

SELECT add_compression_policy('ohlcv_candles', BIGINT '604800000');

-- Auto-drop data older than 90 days
SELECT add_retention_policy('ohlcv_candles', BIGINT '7776000000');
