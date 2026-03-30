-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('VNPAY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "txn_ref" VARCHAR(100) NOT NULL,
    "gateway_transaction_no" VARCHAR(100),
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'VND',
    "bank_code" VARCHAR(50),
    "order_info" VARCHAR(500) NOT NULL,
    "paid_at" TIMESTAMP(3),
    "failed_reason" VARCHAR(500),
    "request_payload" JSONB NOT NULL DEFAULT '{}',
    "response_payload" JSONB NOT NULL DEFAULT '{}',
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_orders" (
    "id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_webhook_logs" (
    "id" UUID NOT NULL,
    "payment_id" UUID,
    "provider" "PaymentProvider" NOT NULL,
    "event_key" VARCHAR(255) NOT NULL,
    "txn_ref" VARCHAR(100) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_success" BOOLEAN NOT NULL DEFAULT false,
    "response_code" VARCHAR(20),
    "message" VARCHAR(500),
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_webhook_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_txn_ref_key" ON "payments"("txn_ref");

-- CreateIndex
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_provider_status_idx" ON "payments"("provider", "status");

-- CreateIndex
CREATE INDEX "payments_created_at_idx" ON "payments"("created_at");

-- CreateIndex
CREATE INDEX "payment_orders_payment_id_idx" ON "payment_orders"("payment_id");

-- CreateIndex
CREATE INDEX "payment_orders_order_id_idx" ON "payment_orders"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_orders_payment_id_order_id_key" ON "payment_orders"("payment_id", "order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_webhook_logs_event_key_key" ON "payment_webhook_logs"("event_key");

-- CreateIndex
CREATE INDEX "payment_webhook_logs_payment_id_idx" ON "payment_webhook_logs"("payment_id");

-- CreateIndex
CREATE INDEX "payment_webhook_logs_provider_txn_ref_idx" ON "payment_webhook_logs"("provider", "txn_ref");

-- CreateIndex
CREATE INDEX "payment_webhook_logs_created_at_idx" ON "payment_webhook_logs"("created_at");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_webhook_logs" ADD CONSTRAINT "payment_webhook_logs_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
