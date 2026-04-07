/*
  Warnings:

  - You are about to drop the `inventory_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `variant_warehouse_inventories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `warehouses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "inventory_logs" DROP CONSTRAINT "inventory_logs_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_logs" DROP CONSTRAINT "inventory_logs_warehouse_id_fkey";

-- DropForeignKey
ALTER TABLE "variant_warehouse_inventories" DROP CONSTRAINT "variant_warehouse_inventories_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "variant_warehouse_inventories" DROP CONSTRAINT "variant_warehouse_inventories_warehouse_id_fkey";

-- DropForeignKey
ALTER TABLE "warehouses" DROP CONSTRAINT "warehouses_shop_id_fkey";

-- DropTable
DROP TABLE "inventory_logs";

-- DropTable
DROP TABLE "variant_warehouse_inventories";

-- DropTable
DROP TABLE "warehouses";

-- DropEnum
DROP TYPE "InventoryLogType";
