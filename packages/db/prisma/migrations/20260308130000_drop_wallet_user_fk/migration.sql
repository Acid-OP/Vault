-- Drop foreign key constraint on Wallet.userId -> User.id
-- Auth is not yet implemented, so userIds are arbitrary strings
ALTER TABLE "Wallet" DROP CONSTRAINT IF EXISTS "Wallet_userId_fkey";
