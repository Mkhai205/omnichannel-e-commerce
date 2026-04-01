import { faker } from "../faker.js";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { EXTRA_PRODUCT_COUNT, SEED_IDS } from "../constants.js";
import type { CatalogSeedResult, VariantSeedInput } from "../types.js";
import { formatCents } from "../utils.js";
import {
    randomVietnameseColor,
    randomVietnameseMaterial,
    randomVietnameseProductDescription,
    randomVietnameseProductName,
} from "../vietnamese.js";

const CATEGORY_KEY_BY_ID: Record<string, string> = {
    [SEED_IDS.categories.electronics]: "electronics",
    [SEED_IDS.categories.smartphones]: "smartphones",
    [SEED_IDS.categories.laptops]: "laptops",
    [SEED_IDS.categories.menFashion]: "menFashion",
    [SEED_IDS.categories.kitchen]: "kitchen",
    [SEED_IDS.categories.homeLiving]: "homeLiving",
};

function buildFixedCatalog(): {
    products: Prisma.ProductCreateManyInput[];
    variants: VariantSeedInput[];
} {
    const products: Prisma.ProductCreateManyInput[] = [
        {
            id: SEED_IDS.products.smartphoneA,
            shopId: SEED_IDS.shops.approved,
            categoryId: SEED_IDS.categories.smartphones,
            name: randomVietnameseProductName("smartphones"),
            description: randomVietnameseProductDescription(),
            imageKey: `products/${SEED_IDS.products.smartphoneA}/main.jpg`,
            omnichannelSyncStatus: { tiktok: "pending", lazada: "success" },
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.products.smartphoneB,
            shopId: SEED_IDS.shops.approved,
            categoryId: SEED_IDS.categories.smartphones,
            name: randomVietnameseProductName("smartphones"),
            description: randomVietnameseProductDescription(),
            imageKey: `products/${SEED_IDS.products.smartphoneB}/main.jpg`,
            omnichannelSyncStatus: { tiktok: "success", shopee: "pending" },
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.products.laptopA,
            shopId: SEED_IDS.shops.approved,
            categoryId: SEED_IDS.categories.laptops,
            name: randomVietnameseProductName("laptops"),
            description: randomVietnameseProductDescription(),
            imageKey: `products/${SEED_IDS.products.laptopA}/main.jpg`,
            omnichannelSyncStatus: { tiktok: "disabled" },
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.products.jacketA,
            shopId: SEED_IDS.shops.approved,
            categoryId: SEED_IDS.categories.menFashion,
            name: randomVietnameseProductName("menFashion"),
            description: randomVietnameseProductDescription(),
            imageKey: `products/${SEED_IDS.products.jacketA}/main.jpg`,
            omnichannelSyncStatus: {},
            status: "DRAFT",
        },
        {
            id: SEED_IDS.products.blenderA,
            shopId: SEED_IDS.shops.approved,
            categoryId: SEED_IDS.categories.kitchen,
            name: randomVietnameseProductName("kitchen"),
            description: randomVietnameseProductDescription(),
            imageKey: `products/${SEED_IDS.products.blenderA}/main.jpg`,
            omnichannelSyncStatus: { lazada: "pending" },
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.products.speakerA,
            shopId: SEED_IDS.shops.approved,
            categoryId: SEED_IDS.categories.electronics,
            name: randomVietnameseProductName("electronics"),
            description: randomVietnameseProductDescription(),
            imageKey: `products/${SEED_IDS.products.speakerA}/main.jpg`,
            omnichannelSyncStatus: {},
            status: "HIDDEN",
        },
    ];

    const variants: VariantSeedInput[] = [
        {
            id: SEED_IDS.variants.smartphoneA128,
            productId: SEED_IDS.products.smartphoneA,
            sku: "SEED-SMARTA-128",
            attributes: { color: randomVietnameseColor(), storage: "128GB" },
            price: "999.00",
            imageKey: `products/${SEED_IDS.products.smartphoneA}/variants/${SEED_IDS.variants.smartphoneA128}.jpg`,
            stockQuantity: 30,
        },
        {
            id: SEED_IDS.variants.smartphoneA256,
            productId: SEED_IDS.products.smartphoneA,
            sku: "SEED-SMARTA-256",
            attributes: { color: randomVietnameseColor(), storage: "256GB" },
            price: "1199.00",
            imageKey: `products/${SEED_IDS.products.smartphoneA}/variants/${SEED_IDS.variants.smartphoneA256}.jpg`,
            stockQuantity: 24,
        },
        {
            id: SEED_IDS.variants.smartphoneB128,
            productId: SEED_IDS.products.smartphoneB,
            sku: "SEED-SMARTB-128",
            attributes: { color: randomVietnameseColor(), storage: "128GB" },
            price: "899.00",
            imageKey: `products/${SEED_IDS.products.smartphoneB}/variants/${SEED_IDS.variants.smartphoneB128}.jpg`,
            stockQuantity: 28,
        },
        {
            id: SEED_IDS.variants.smartphoneB256,
            productId: SEED_IDS.products.smartphoneB,
            sku: "SEED-SMARTB-256",
            attributes: { color: randomVietnameseColor(), storage: "256GB" },
            price: "1099.00",
            imageKey: `products/${SEED_IDS.products.smartphoneB}/variants/${SEED_IDS.variants.smartphoneB256}.jpg`,
            stockQuantity: 20,
        },
        {
            id: SEED_IDS.variants.laptopA16,
            productId: SEED_IDS.products.laptopA,
            sku: "SEED-LAPTOPA-16GB",
            attributes: { ram: "16GB", storage: "512GB SSD" },
            price: "1699.00",
            imageKey: `products/${SEED_IDS.products.laptopA}/variants/${SEED_IDS.variants.laptopA16}.jpg`,
            stockQuantity: 15,
        },
        {
            id: SEED_IDS.variants.laptopA32,
            productId: SEED_IDS.products.laptopA,
            sku: "SEED-LAPTOPA-32GB",
            attributes: { ram: "32GB", storage: "1TB SSD" },
            price: "1999.00",
            imageKey: `products/${SEED_IDS.products.laptopA}/variants/${SEED_IDS.variants.laptopA32}.jpg`,
            stockQuantity: 9,
        },
        {
            id: SEED_IDS.variants.jacketAM,
            productId: SEED_IDS.products.jacketA,
            sku: "SEED-JACKETA-M",
            attributes: { size: "M", color: randomVietnameseColor() },
            price: "129.00",
            imageKey: `products/${SEED_IDS.products.jacketA}/variants/${SEED_IDS.variants.jacketAM}.jpg`,
            stockQuantity: 40,
        },
        {
            id: SEED_IDS.variants.jacketAL,
            productId: SEED_IDS.products.jacketA,
            sku: "SEED-JACKETA-L",
            attributes: { size: "L", color: randomVietnameseColor() },
            price: "129.00",
            imageKey: `products/${SEED_IDS.products.jacketA}/variants/${SEED_IDS.variants.jacketAL}.jpg`,
            stockQuantity: 35,
        },
        {
            id: SEED_IDS.variants.blenderAWhite,
            productId: SEED_IDS.products.blenderA,
            sku: "SEED-BLENDERA-WHITE",
            attributes: { color: "Trắng", power: "600W" },
            price: "159.00",
            imageKey: `products/${SEED_IDS.products.blenderA}/variants/${SEED_IDS.variants.blenderAWhite}.jpg`,
            stockQuantity: 21,
        },
        {
            id: SEED_IDS.variants.blenderABlack,
            productId: SEED_IDS.products.blenderA,
            sku: "SEED-BLENDERA-BLACK",
            attributes: { color: "Đen", power: "600W" },
            price: "159.00",
            imageKey: `products/${SEED_IDS.products.blenderA}/variants/${SEED_IDS.variants.blenderABlack}.jpg`,
            stockQuantity: 19,
        },
        {
            id: SEED_IDS.variants.speakerABlack,
            productId: SEED_IDS.products.speakerA,
            sku: "SEED-SPEAKERA-BLACK",
            attributes: { color: "Đen", connectivity: "Bluetooth 5.3" },
            price: "89.00",
            imageKey: `products/${SEED_IDS.products.speakerA}/variants/${SEED_IDS.variants.speakerABlack}.jpg`,
            stockQuantity: 50,
        },
        {
            id: SEED_IDS.variants.speakerABlue,
            productId: SEED_IDS.products.speakerA,
            sku: "SEED-SPEAKERA-BLUE",
            attributes: { color: "Xanh dương", connectivity: "Bluetooth 5.3" },
            price: "89.00",
            imageKey: `products/${SEED_IDS.products.speakerA}/variants/${SEED_IDS.variants.speakerABlue}.jpg`,
            stockQuantity: 44,
        },
    ];

    return {
        products,
        variants,
    };
}

function buildExtraCatalog(): {
    products: Prisma.ProductCreateManyInput[];
    variants: VariantSeedInput[];
} {
    const products: Prisma.ProductCreateManyInput[] = [];
    const variants: VariantSeedInput[] = [];

    const categoryPool = [
        SEED_IDS.categories.electronics,
        SEED_IDS.categories.smartphones,
        SEED_IDS.categories.laptops,
        SEED_IDS.categories.menFashion,
        SEED_IDS.categories.kitchen,
        SEED_IDS.categories.homeLiving,
    ] as const;

    for (let productIndex = 1; productIndex <= EXTRA_PRODUCT_COUNT; productIndex += 1) {
        const productId = faker.string.uuid();
        const categoryId = faker.helpers.arrayElement(categoryPool);
        const categoryKey = CATEGORY_KEY_BY_ID[categoryId] ?? "electronics";
        const productStatus = faker.helpers.weightedArrayElement([
            { value: "ACTIVE" as const, weight: 8 },
            { value: "DRAFT" as const, weight: 1 },
            { value: "HIDDEN" as const, weight: 1 },
        ]);

        products.push({
            id: productId,
            shopId: SEED_IDS.shops.approved,
            categoryId,
            name: randomVietnameseProductName(categoryKey),
            description: randomVietnameseProductDescription(),
            imageKey: `products/${productId}/main.jpg`,
            omnichannelSyncStatus: {
                tiktok: faker.helpers.arrayElement(["pending", "success", "failed"]),
                lazada: faker.helpers.arrayElement(["pending", "success", "disabled"]),
            },
            status: productStatus,
        });

        const variantCount = faker.number.int({ min: 2, max: 3 });

        for (let variantIndex = 1; variantIndex <= variantCount; variantIndex += 1) {
            const variantId = faker.string.uuid();
            const stockQuantity = faker.number.int({ min: 8, max: 160 });
            const priceCents = faker.number.int({ min: 7900, max: 459900 });
            const sku = `SEED-EXT-${String(productIndex).padStart(3, "0")}-${variantIndex}`;

            variants.push({
                id: variantId,
                productId,
                sku,
                attributes: {
                    color: randomVietnameseColor(),
                    size: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
                    material: randomVietnameseMaterial(),
                },
                price: formatCents(BigInt(priceCents)),
                imageKey: `products/${productId}/variants/${variantId}.jpg`,
                stockQuantity,
            });
        }
    }

    return {
        products,
        variants,
    };
}

export async function seedCatalog(prisma: PrismaClient): Promise<CatalogSeedResult> {
    const fixed = buildFixedCatalog();
    const extra = buildExtraCatalog();

    const products = [...fixed.products, ...extra.products];
    const variants = [...fixed.variants, ...extra.variants];

    await prisma.product.createMany({ data: products });

    await prisma.productVariant.createMany({
        data: variants.map((variant) => ({
            id: variant.id,
            productId: variant.productId,
            sku: variant.sku,
            attributes: variant.attributes,
            price: variant.price,
            imageKey: variant.imageKey,
            stockQuantity: variant.stockQuantity,
        })),
    });

    const inventoryLogs: Prisma.InventoryLogCreateManyInput[] = variants.map((variant) => ({
        variantId: variant.id,
        type: "IMPORT",
        quantityChanged: variant.stockQuantity,
        note: "Nhập kho ban đầu từ seed",
    }));

    inventoryLogs.push({
        variantId: SEED_IDS.variants.smartphoneA128,
        type: "ORDER_DEDUCT",
        quantityChanged: -2,
        note: "Mô phỏng trừ tồn khi thanh toán",
    });

    await prisma.inventoryLog.createMany({ data: inventoryLogs });

    return {
        products: products.length,
        productVariants: variants.length,
        inventoryLogs: inventoryLogs.length,
        variants,
    };
}
