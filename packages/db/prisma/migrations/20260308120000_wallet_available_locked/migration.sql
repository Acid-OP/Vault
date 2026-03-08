-- Rename balance -> available and add locked column
ALTER TABLE "Wallet" RENAME COLUMN "balance" TO "available";
ALTER TABLE "Wallet" ADD COLUMN "locked" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- Add unique constraint for upserts
CREATE UNIQUE INDEX "Wallet_userId_asset_key" ON "Wallet"("userId", "asset");
