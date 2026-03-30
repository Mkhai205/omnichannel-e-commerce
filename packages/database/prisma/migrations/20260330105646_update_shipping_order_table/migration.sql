-- CreateEnum
CREATE TYPE "SettlementStatus" AS ENUM ('PENDING', 'SETTLED');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "delivered_at" TIMESTAMP(3),
ADD COLUMN     "settled_at" TIMESTAMP(3),
ADD COLUMN     "settlement_status" "SettlementStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "shipped_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "orders_shipped_at_idx" ON "orders"("shipped_at");

-- CreateIndex
CREATE INDEX "orders_settlement_status_idx" ON "orders"("settlement_status");
