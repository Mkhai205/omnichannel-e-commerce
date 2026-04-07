-- CreateTable
CREATE TABLE "warehouses" (
    "id" UUID NOT NULL,
    "shop_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variant_warehouse_inventories" (
    "id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "variant_warehouse_inventories_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "inventory_logs"
ADD COLUMN "warehouse_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_shop_id_code_key" ON "warehouses"("shop_id", "code");

-- CreateIndex
CREATE INDEX "warehouses_shop_id_idx" ON "warehouses"("shop_id");

-- CreateIndex
CREATE INDEX "warehouses_shop_id_is_default_idx" ON "warehouses"("shop_id", "is_default");

-- CreateIndex
CREATE UNIQUE INDEX "variant_warehouse_inventories_variant_id_warehouse_id_key" ON "variant_warehouse_inventories"("variant_id", "warehouse_id");

-- CreateIndex
CREATE INDEX "variant_warehouse_inventories_variant_id_idx" ON "variant_warehouse_inventories"("variant_id");

-- CreateIndex
CREATE INDEX "variant_warehouse_inventories_warehouse_id_idx" ON "variant_warehouse_inventories"("warehouse_id");

-- CreateIndex
CREATE INDEX "inventory_logs_warehouse_id_idx" ON "inventory_logs"("warehouse_id");

-- AddForeignKey
ALTER TABLE "warehouses"
ADD CONSTRAINT "warehouses_shop_id_fkey"
FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_warehouse_inventories"
ADD CONSTRAINT "variant_warehouse_inventories_variant_id_fkey"
FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_warehouse_inventories"
ADD CONSTRAINT "variant_warehouse_inventories_warehouse_id_fkey"
FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: create one default warehouse per seller shop
INSERT INTO "warehouses" (
    "id",
    "shop_id",
    "name",
    "code",
    "is_default",
    "created_at",
    "updated_at"
)
SELECT
    gen_random_uuid(),
    s."id",
    'Kho mac dinh',
    'DEFAULT',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "shops" s;

-- Backfill: move current variant total stock into the default warehouse
INSERT INTO "variant_warehouse_inventories" (
    "id",
    "variant_id",
    "warehouse_id",
    "stock_quantity",
    "created_at",
    "updated_at"
)
SELECT
    gen_random_uuid(),
    pv."id",
    w."id",
    pv."stock_quantity",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "product_variants" pv
JOIN "products" p ON p."id" = pv."product_id"
JOIN "warehouses" w ON w."shop_id" = p."shop_id" AND w."is_default" = true;

-- Backfill inventory logs to the corresponding default warehouse of each seller
UPDATE "inventory_logs" il
SET "warehouse_id" = w."id"
FROM "product_variants" pv
JOIN "products" p ON p."id" = pv."product_id"
JOIN "warehouses" w ON w."shop_id" = p."shop_id" AND w."is_default" = true
WHERE il."variant_id" = pv."id";

-- Enforce warehouse ownership on inventory logs after backfill
ALTER TABLE "inventory_logs"
ALTER COLUMN "warehouse_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "inventory_logs"
ADD CONSTRAINT "inventory_logs_warehouse_id_fkey"
FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
