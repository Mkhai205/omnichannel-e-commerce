-- AlterTable
ALTER TABLE "categories"
ADD COLUMN "image_key" VARCHAR(500);

-- AlterTable
ALTER TABLE "products"
ADD COLUMN "image_key" VARCHAR(500);

-- AlterTable
ALTER TABLE "product_variants"
ADD COLUMN "image_key" VARCHAR(500);
