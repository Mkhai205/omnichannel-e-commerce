-- CreateEnum
CREATE TYPE "SalesChannelType" AS ENUM ('WEB', 'TIKTOK_MOCK', 'SHOPEE_MOCK');

-- CreateEnum
CREATE TYPE "ChannelConnectionStatus" AS ENUM ('CONNECTED', 'DISCONNECTED', 'EXPIRED', 'ERROR');

-- CreateEnum
CREATE TYPE "ChannelSyncDirection" AS ENUM ('IMPORT_ORDERS', 'EXPORT_PRODUCTS', 'EXPORT_INVENTORY');

-- CreateEnum
CREATE TYPE "ChannelSyncTrigger" AS ENUM ('MANUAL', 'CRON');

-- CreateEnum
CREATE TYPE "ChannelSyncStatus" AS ENUM ('SUCCESS', 'PARTIAL', 'FAILED');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "source_channel_connection_id" UUID,
ADD COLUMN     "source_channel_type" "SalesChannelType" NOT NULL DEFAULT 'WEB';

-- CreateTable
CREATE TABLE "seller_channel_connections" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "channel_type" "SalesChannelType" NOT NULL,
    "status" "ChannelConnectionStatus" NOT NULL DEFAULT 'DISCONNECTED',
    "external_shop_id" VARCHAR(100),
    "access_token" VARCHAR(500),
    "refresh_token" VARCHAR(500),
    "token_expires_at" TIMESTAMP(3),
    "last_synced_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_channel_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_channel_product_mappings" (
    "id" UUID NOT NULL,
    "connection_id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "external_product_id" VARCHAR(120) NOT NULL,
    "external_sku" VARCHAR(120) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_synced_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_channel_product_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_channel_order_mappings" (
    "id" UUID NOT NULL,
    "connection_id" UUID NOT NULL,
    "external_order_id" VARCHAR(120) NOT NULL,
    "order_id" UUID NOT NULL,
    "raw_payload" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_channel_order_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_channel_sync_runs" (
    "id" UUID NOT NULL,
    "connection_id" UUID NOT NULL,
    "direction" "ChannelSyncDirection" NOT NULL,
    "trigger" "ChannelSyncTrigger" NOT NULL DEFAULT 'MANUAL',
    "status" "ChannelSyncStatus" NOT NULL,
    "total_count" INTEGER NOT NULL DEFAULT 0,
    "created_count" INTEGER NOT NULL DEFAULT 0,
    "updated_count" INTEGER NOT NULL DEFAULT 0,
    "failed_count" INTEGER NOT NULL DEFAULT 0,
    "message" VARCHAR(500),
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_channel_sync_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "seller_channel_connections_shop_id_status_idx" ON "seller_channel_connections"("shop_id", "status");

-- CreateIndex
CREATE INDEX "seller_channel_connections_channel_type_status_idx" ON "seller_channel_connections"("channel_type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "seller_channel_connections_shop_id_channel_type_key" ON "seller_channel_connections"("shop_id", "channel_type");

-- CreateIndex
CREATE INDEX "seller_channel_product_mappings_variant_id_idx" ON "seller_channel_product_mappings"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "seller_channel_product_mappings_connection_id_variant_id_key" ON "seller_channel_product_mappings"("connection_id", "variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "seller_channel_product_mappings_connection_id_external_sku_key" ON "seller_channel_product_mappings"("connection_id", "external_sku");

-- CreateIndex
CREATE INDEX "seller_channel_order_mappings_order_id_idx" ON "seller_channel_order_mappings"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "seller_channel_order_mappings_connection_id_external_order__key" ON "seller_channel_order_mappings"("connection_id", "external_order_id");

-- CreateIndex
CREATE INDEX "seller_channel_sync_runs_connection_id_direction_created_at_idx" ON "seller_channel_sync_runs"("connection_id", "direction", "created_at");

-- CreateIndex
CREATE INDEX "seller_channel_sync_runs_status_created_at_idx" ON "seller_channel_sync_runs"("status", "created_at");

-- CreateIndex
CREATE INDEX "orders_source_channel_type_idx" ON "orders"("source_channel_type");

-- CreateIndex
CREATE INDEX "orders_source_channel_connection_id_idx" ON "orders"("source_channel_connection_id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_source_channel_connection_id_fkey" FOREIGN KEY ("source_channel_connection_id") REFERENCES "seller_channel_connections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_channel_connections" ADD CONSTRAINT "seller_channel_connections_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_channel_product_mappings" ADD CONSTRAINT "seller_channel_product_mappings_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "seller_channel_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_channel_product_mappings" ADD CONSTRAINT "seller_channel_product_mappings_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_channel_order_mappings" ADD CONSTRAINT "seller_channel_order_mappings_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "seller_channel_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_channel_order_mappings" ADD CONSTRAINT "seller_channel_order_mappings_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_channel_sync_runs" ADD CONSTRAINT "seller_channel_sync_runs_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "seller_channel_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
