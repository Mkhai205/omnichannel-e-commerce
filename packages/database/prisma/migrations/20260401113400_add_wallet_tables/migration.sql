-- CreateEnum
CREATE TYPE "AdminWalletLedgerType" AS ENUM ('PAYMENT_INFLOW', 'SELLER_SETTLEMENT');

-- CreateEnum
CREATE TYPE "SellerSettlementStatus" AS ENUM ('COMPLETED', 'REVERSED');

-- CreateTable
CREATE TABLE "admin_wallets" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "escrow_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "commission_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_inflow" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_released_seller" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_wallet_ledgers" (
    "id" UUID NOT NULL,
    "admin_wallet_id" UUID NOT NULL,
    "payment_id" UUID,
    "order_id" UUID,
    "type" "AdminWalletLedgerType" NOT NULL,
    "idempotency_key" VARCHAR(100) NOT NULL,
    "gross_amount" DECIMAL(12,2) NOT NULL,
    "commission" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "net_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "note" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_wallet_ledgers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_wallets" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "available_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "pending_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_credited" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_settlements" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "seller_wallet_id" UUID NOT NULL,
    "idempotency_key" VARCHAR(100) NOT NULL,
    "status" "SellerSettlementStatus" NOT NULL DEFAULT 'COMPLETED',
    "gross_amount" DECIMAL(12,2) NOT NULL,
    "commission_amount" DECIMAL(12,2) NOT NULL,
    "net_amount" DECIMAL(12,2) NOT NULL,
    "settled_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_settlements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_wallets_code_key" ON "admin_wallets"("code");

-- CreateIndex
CREATE UNIQUE INDEX "admin_wallet_ledgers_idempotency_key_key" ON "admin_wallet_ledgers"("idempotency_key");

-- CreateIndex
CREATE INDEX "admin_wallet_ledgers_admin_wallet_id_idx" ON "admin_wallet_ledgers"("admin_wallet_id");

-- CreateIndex
CREATE INDEX "admin_wallet_ledgers_payment_id_idx" ON "admin_wallet_ledgers"("payment_id");

-- CreateIndex
CREATE INDEX "admin_wallet_ledgers_order_id_idx" ON "admin_wallet_ledgers"("order_id");

-- CreateIndex
CREATE INDEX "admin_wallet_ledgers_type_idx" ON "admin_wallet_ledgers"("type");

-- CreateIndex
CREATE INDEX "admin_wallet_ledgers_created_at_idx" ON "admin_wallet_ledgers"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "seller_wallets_shop_id_key" ON "seller_wallets"("shop_id");

-- CreateIndex
CREATE INDEX "seller_wallets_created_at_idx" ON "seller_wallets"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "seller_settlements_order_id_key" ON "seller_settlements"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "seller_settlements_idempotency_key_key" ON "seller_settlements"("idempotency_key");

-- CreateIndex
CREATE INDEX "seller_settlements_shop_id_idx" ON "seller_settlements"("shop_id");

-- CreateIndex
CREATE INDEX "seller_settlements_seller_wallet_id_idx" ON "seller_settlements"("seller_wallet_id");

-- CreateIndex
CREATE INDEX "seller_settlements_status_idx" ON "seller_settlements"("status");

-- CreateIndex
CREATE INDEX "seller_settlements_created_at_idx" ON "seller_settlements"("created_at");

-- AddForeignKey
ALTER TABLE "admin_wallet_ledgers" ADD CONSTRAINT "admin_wallet_ledgers_admin_wallet_id_fkey" FOREIGN KEY ("admin_wallet_id") REFERENCES "admin_wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_wallet_ledgers" ADD CONSTRAINT "admin_wallet_ledgers_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_wallet_ledgers" ADD CONSTRAINT "admin_wallet_ledgers_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_wallets" ADD CONSTRAINT "seller_wallets_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_settlements" ADD CONSTRAINT "seller_settlements_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_settlements" ADD CONSTRAINT "seller_settlements_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_settlements" ADD CONSTRAINT "seller_settlements_seller_wallet_id_fkey" FOREIGN KEY ("seller_wallet_id") REFERENCES "seller_wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
