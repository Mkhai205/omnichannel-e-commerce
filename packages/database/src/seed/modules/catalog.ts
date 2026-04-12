import { faker } from "../faker.js";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import {
    DEFAULT_ACTIVE_RATIO,
    DEFAULT_PRODUCTS_PER_CATEGORY,
    DEFAULT_VARIANTS_MAX,
    DEFAULT_VARIANTS_MIN,
    SEED_IDS,
} from "../constants.js";
import type {
    CatalogSeedOptions,
    CatalogSeedResult,
    ProductReviewSeedInput,
    SeedCategoryRecord,
    VariantSeedInput,
} from "../types.js";
import { formatCents } from "../utils.js";
import {
    randomVietnameseColor,
    randomVietnameseMaterial,
    randomVietnameseProductDescription,
    randomVietnameseProductName,
} from "../vietnamese.js";

type ExtraCatalogBuildInput = {
    categoryRecords: SeedCategoryRecord[];
    productsPerCategory: number;
    variantsMin: number;
    variantsMax: number;
    activeRatio: number;
    skuStartIndex: number;
};

const FALLBACK_CATEGORY_RECORDS: SeedCategoryRecord[] = [
    {
        key: "electronics",
        id: SEED_IDS.categories.electronics,
        slug: "electronics",
        catalogKey: "electronics",
        includeInExtraCatalog: true,
    },
    {
        key: "smartphones",
        id: SEED_IDS.categories.smartphones,
        slug: "smartphones",
        catalogKey: "smartphones",
        includeInExtraCatalog: true,
    },
    {
        key: "mobilePhones",
        id: SEED_IDS.categories.mobilePhones,
        slug: "mobile-phones",
        catalogKey: "mobilePhones",
        includeInExtraCatalog: true,
    },
    {
        key: "laptops",
        id: SEED_IDS.categories.laptops,
        slug: "laptops",
        catalogKey: "laptops",
        includeInExtraCatalog: true,
    },
    {
        key: "menFashion",
        id: SEED_IDS.categories.menFashion,
        slug: "men-fashion",
        catalogKey: "menFashion",
        includeInExtraCatalog: true,
    },
    {
        key: "womenFashion",
        id: SEED_IDS.categories.womenFashion,
        slug: "women-fashion",
        catalogKey: "womenFashion",
        includeInExtraCatalog: true,
    },
    {
        key: "menShoes",
        id: SEED_IDS.categories.menShoes,
        slug: "men-shoes",
        catalogKey: "menShoes",
        includeInExtraCatalog: true,
    },
    {
        key: "womenShoes",
        id: SEED_IDS.categories.womenShoes,
        slug: "women-shoes",
        catalogKey: "womenShoes",
        includeInExtraCatalog: true,
    },
    {
        key: "beautyHealth",
        id: SEED_IDS.categories.beautyHealth,
        slug: "beauty-health",
        catalogKey: "beautyHealth",
        includeInExtraCatalog: true,
    },
    {
        key: "carMoto",
        id: SEED_IDS.categories.carMoto,
        slug: "car-moto",
        catalogKey: "carMoto",
        includeInExtraCatalog: true,
    },
    {
        key: "kitchen",
        id: SEED_IDS.categories.kitchen,
        slug: "kitchen",
        catalogKey: "kitchen",
        includeInExtraCatalog: true,
    },
    {
        key: "householdAppliances",
        id: SEED_IDS.categories.householdAppliances,
        slug: "household-appliances",
        catalogKey: "householdAppliances",
        includeInExtraCatalog: true,
    },
    {
        key: "jewelryAccessories",
        id: SEED_IDS.categories.jewelryAccessories,
        slug: "jewelry-accessories",
        catalogKey: "jewelryAccessories",
        includeInExtraCatalog: true,
    },
    {
        key: "pets",
        id: SEED_IDS.categories.pets,
        slug: "pets",
        catalogKey: "pets",
        includeInExtraCatalog: true,
    },
    {
        key: "sports",
        id: SEED_IDS.categories.sports,
        slug: "sports",
        catalogKey: "sports",
        includeInExtraCatalog: true,
    },
    {
        key: "toys",
        id: SEED_IDS.categories.toys,
        slug: "toys",
        catalogKey: "toys",
        includeInExtraCatalog: true,
    },
    {
        key: "books",
        id: SEED_IDS.categories.books,
        slug: "books",
        catalogKey: "books",
        includeInExtraCatalog: true,
    },
    {
        key: "vouchers",
        id: SEED_IDS.categories.vouchers,
        slug: "vouchers",
        catalogKey: "vouchers",
        includeInExtraCatalog: true,
    },
];

const REVIEWER_USER_IDS = [
    SEED_IDS.users.customerA,
    SEED_IDS.users.customerB,
    SEED_IDS.users.customerC,
    SEED_IDS.users.customerD,
] as const;

const REVIEW_COMMENTS = [
    "Chất lượng rất tốt, đúng mô tả.",
    "Giao hàng nhanh, đóng gói chắc chắn.",
    "Giá hợp lý so với chất lượng.",
    "Sẽ ủng hộ shop thêm lần sau.",
    "Sản phẩm dùng ổn định và đáng mua.",
] as const;

function normalizePositiveInteger(rawValue: number | undefined, fallbackValue: number): number {
    if (!rawValue || !Number.isFinite(rawValue) || rawValue < 1) {
        return fallbackValue;
    }

    return Math.floor(rawValue);
}

function normalizeVariantRange(
    variantsMinRaw: number | undefined,
    variantsMaxRaw: number | undefined,
): { min: number; max: number } {
    const min = normalizePositiveInteger(variantsMinRaw, DEFAULT_VARIANTS_MIN);
    const max = normalizePositiveInteger(variantsMaxRaw, DEFAULT_VARIANTS_MAX);

    if (min <= max) {
        return { min, max };
    }

    return {
        min: max,
        max: min,
    };
}

function normalizeActiveRatio(rawValue: number | undefined): number {
    if (rawValue === undefined || !Number.isFinite(rawValue)) {
        return DEFAULT_ACTIVE_RATIO;
    }

    return Math.min(Math.max(rawValue, 0), 1);
}

function resolveCategoryRecords(
    categoryRecords: SeedCategoryRecord[] | undefined,
): SeedCategoryRecord[] {
    if (!categoryRecords || categoryRecords.length === 0) {
        return FALLBACK_CATEGORY_RECORDS;
    }

    return categoryRecords;
}

function pickProductStatus(activeRatio: number): "ACTIVE" | "DRAFT" | "HIDDEN" {
    if (faker.number.float({ min: 0, max: 1 }) <= activeRatio) {
        return "ACTIVE";
    }

    return faker.helpers.arrayElement(["DRAFT", "HIDDEN"] as const);
}

function buildGeneratedSku(
    categorySlug: string,
    variantSequence: number,
    variantIndex: number,
): string {
    const compactCategorySlug = categorySlug
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 10);
    const suffix = faker.string.alphanumeric(4).toUpperCase();

    return `SEED-EXT-${compactCategorySlug}-${String(variantSequence).padStart(6, "0")}-${variantIndex}-${suffix}`;
}

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
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.products.smartphoneB,
            shopId: SEED_IDS.shops.approved,
            categoryId: SEED_IDS.categories.smartphones,
            name: randomVietnameseProductName("smartphones"),
            description: randomVietnameseProductDescription(),
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.products.laptopA,
            shopId: SEED_IDS.shops.approved,
            categoryId: SEED_IDS.categories.laptops,
            name: randomVietnameseProductName("laptops"),
            description: randomVietnameseProductDescription(),
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.products.jacketA,
            shopId: SEED_IDS.shops.approved,
            categoryId: SEED_IDS.categories.menFashion,
            name: randomVietnameseProductName("menFashion"),
            description: randomVietnameseProductDescription(),
            status: "DRAFT",
        },
        {
            id: SEED_IDS.products.blenderA,
            shopId: SEED_IDS.shops.approved,
            categoryId: SEED_IDS.categories.kitchen,
            name: randomVietnameseProductName("kitchen"),
            description: randomVietnameseProductDescription(),
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.products.speakerA,
            shopId: SEED_IDS.shops.approved,
            categoryId: SEED_IDS.categories.electronics,
            name: randomVietnameseProductName("electronics"),
            description: randomVietnameseProductDescription(),
            status: "HIDDEN",
        },
    ];

    const variants: VariantSeedInput[] = [
        {
            id: SEED_IDS.variants.smartphoneA128,
            productId: SEED_IDS.products.smartphoneA,
            sku: "SEED-SMARTA-128",
            attributes: { color: randomVietnameseColor(), storage: "128GB" },
            price: "9990000.00",
            stockQuantity: 30,
        },
        {
            id: SEED_IDS.variants.smartphoneA256,
            productId: SEED_IDS.products.smartphoneA,
            sku: "SEED-SMARTA-256",
            attributes: { color: randomVietnameseColor(), storage: "256GB" },
            price: "11990000.00",
            stockQuantity: 24,
        },
        {
            id: SEED_IDS.variants.smartphoneB128,
            productId: SEED_IDS.products.smartphoneB,
            sku: "SEED-SMARTB-128",
            attributes: { color: randomVietnameseColor(), storage: "128GB" },
            price: "8990000.00",
            stockQuantity: 28,
        },
        {
            id: SEED_IDS.variants.smartphoneB256,
            productId: SEED_IDS.products.smartphoneB,
            sku: "SEED-SMARTB-256",
            attributes: { color: randomVietnameseColor(), storage: "256GB" },
            price: "10990000.00",
            stockQuantity: 20,
        },
        {
            id: SEED_IDS.variants.laptopA16,
            productId: SEED_IDS.products.laptopA,
            sku: "SEED-LAPTOPA-16GB",
            attributes: { ram: "16GB", storage: "512GB SSD" },
            price: "16990000.00",
            stockQuantity: 15,
        },
        {
            id: SEED_IDS.variants.laptopA32,
            productId: SEED_IDS.products.laptopA,
            sku: "SEED-LAPTOPA-32GB",
            attributes: { ram: "32GB", storage: "1TB SSD" },
            price: "19990000.00",
            stockQuantity: 9,
        },
        {
            id: SEED_IDS.variants.jacketAM,
            productId: SEED_IDS.products.jacketA,
            sku: "SEED-JACKETA-M",
            attributes: { size: "M", color: randomVietnameseColor() },
            price: "1290000.00",
            stockQuantity: 40,
        },
        {
            id: SEED_IDS.variants.jacketAL,
            productId: SEED_IDS.products.jacketA,
            sku: "SEED-JACKETA-L",
            attributes: { size: "L", color: randomVietnameseColor() },
            price: "1290000.00",
            stockQuantity: 35,
        },
        {
            id: SEED_IDS.variants.blenderAWhite,
            productId: SEED_IDS.products.blenderA,
            sku: "SEED-BLENDERA-WHITE",
            attributes: { color: "Trắng", power: "600W" },
            price: "1590000.00",
            stockQuantity: 21,
        },
        {
            id: SEED_IDS.variants.blenderABlack,
            productId: SEED_IDS.products.blenderA,
            sku: "SEED-BLENDERA-BLACK",
            attributes: { color: "Đen", power: "600W" },
            price: "1590000.00",
            stockQuantity: 19,
        },
        {
            id: SEED_IDS.variants.speakerABlack,
            productId: SEED_IDS.products.speakerA,
            sku: "SEED-SPEAKERA-BLACK",
            attributes: { color: "Đen", connectivity: "Bluetooth 5.3" },
            price: "890000.00",
            stockQuantity: 50,
        },
        {
            id: SEED_IDS.variants.speakerABlue,
            productId: SEED_IDS.products.speakerA,
            sku: "SEED-SPEAKERA-BLUE",
            attributes: { color: "Xanh dương", connectivity: "Bluetooth 5.3" },
            price: "890000.00",
            stockQuantity: 44,
        },
    ];

    return {
        products,
        variants,
    };
}

function buildExtraCatalog(input: ExtraCatalogBuildInput): {
    products: Prisma.ProductCreateManyInput[];
    variants: VariantSeedInput[];
} {
    const products: Prisma.ProductCreateManyInput[] = [];
    const variants: VariantSeedInput[] = [];

    const extraCatalogCategories = input.categoryRecords.filter(
        (record) => record.includeInExtraCatalog,
    );

    let productSequence = 0;
    let variantSequence = input.skuStartIndex;

    for (const category of extraCatalogCategories) {
        for (
            let productIndexInCategory = 1;
            productIndexInCategory <= input.productsPerCategory;
            productIndexInCategory += 1
        ) {
            productSequence += 1;

            const productId = faker.string.uuid();

            products.push({
                id: productId,
                shopId: SEED_IDS.shops.approved,
                categoryId: category.id,
                name: randomVietnameseProductName(category.catalogKey),
                description: randomVietnameseProductDescription(),
                status: pickProductStatus(input.activeRatio),
            });

            const variantCount = faker.number.int({
                min: input.variantsMin,
                max: input.variantsMax,
            });

            for (let variantIndex = 1; variantIndex <= variantCount; variantIndex += 1) {
                variantSequence += 1;
                const stockQuantity = faker.number.int({ min: 8, max: 160 });
                const priceVnd = faker.number.int({ min: 1001, max: 4599000 });
                const priceCents = BigInt(priceVnd) * 100n;

                variants.push({
                    id: faker.string.uuid(),
                    productId,
                    sku: buildGeneratedSku(category.slug, variantSequence, variantIndex),
                    attributes: {
                        color: randomVietnameseColor(),
                        size: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
                        material: randomVietnameseMaterial(),
                        tier: `${category.key}-${productSequence}`,
                    },
                    price: formatCents(priceCents),
                    stockQuantity,
                });
            }
        }
    }

    return {
        products,
        variants,
    };
}

function pickReviewRating(): number {
    const score = faker.number.int({ min: 1, max: 100 });

    if (score <= 5) {
        return 1;
    }

    if (score <= 15) {
        return 2;
    }

    if (score <= 35) {
        return 3;
    }

    if (score <= 65) {
        return 4;
    }

    return 5;
}

function buildProductReviews(products: Prisma.ProductCreateManyInput[]): ProductReviewSeedInput[] {
    const reviews: ProductReviewSeedInput[] = [];

    for (const product of products) {
        if (!product.id) {
            continue;
        }

        const reviewerPool = faker.helpers.shuffle([...REVIEWER_USER_IDS]);
        const reviewCount = faker.number.int({ min: 1, max: reviewerPool.length });

        for (let index = 0; index < reviewCount; index += 1) {
            const userId = reviewerPool[index];

            if (!userId) {
                continue;
            }

            const includeComment = faker.number.float({ min: 0, max: 1 }) <= 0.7;

            reviews.push({
                id: faker.string.uuid(),
                productId: product.id,
                userId,
                rating: pickReviewRating(),
                comment: includeComment ? faker.helpers.arrayElement(REVIEW_COMMENTS) : null,
            });
        }
    }

    return reviews;
}

async function refreshProductRatings(prisma: PrismaClient, productIds: string[]): Promise<void> {
    const uniqueProductIds = [...new Set(productIds)];
    const ratingUpdateBatchSize = 100;

    if (uniqueProductIds.length === 0) {
        return;
    }

    const groupedRatings = await prisma.productReview.groupBy({
        by: ["productId"],
        where: {
            productId: {
                in: uniqueProductIds,
            },
        },
        _avg: {
            rating: true,
        },
        _count: {
            _all: true,
        },
    });

    const ratingByProductId = new Map(groupedRatings.map((item) => [item.productId, item]));

    for (let start = 0; start < uniqueProductIds.length; start += ratingUpdateBatchSize) {
        const productIdsBatch = uniqueProductIds.slice(start, start + ratingUpdateBatchSize);

        for (const productId of productIdsBatch) {
            const ratingAggregate = ratingByProductId.get(productId);
            const averageRating = Number(ratingAggregate?._avg.rating ?? 0);
            const normalizedAverage = Number.isFinite(averageRating)
                ? Number(averageRating.toFixed(2))
                : 0;

            await prisma.product.update({
                where: { id: productId },
                data: {
                    ratingAverage: normalizedAverage.toFixed(2),
                    ratingCount: ratingAggregate?._count._all ?? 0,
                },
            });
        }
    }
}

export async function seedCatalog(
    prisma: PrismaClient,
    options: CatalogSeedOptions = {},
): Promise<CatalogSeedResult> {
    const includeFixedProducts = options.includeFixedProducts ?? true;
    const categoryRecords = resolveCategoryRecords(options.categoryRecords);
    const productsPerCategory = normalizePositiveInteger(
        options.productsPerCategory,
        DEFAULT_PRODUCTS_PER_CATEGORY,
    );
    const { min: variantsMin, max: variantsMax } = normalizeVariantRange(
        options.variantsMin,
        options.variantsMax,
    );
    const activeRatio = normalizeActiveRatio(options.activeRatio);

    const fixed = includeFixedProducts
        ? buildFixedCatalog()
        : {
              products: [] as Prisma.ProductCreateManyInput[],
              variants: [] as VariantSeedInput[],
          };

    const existingVariantCount = await prisma.productVariant.count();

    const extra = buildExtraCatalog({
        categoryRecords,
        productsPerCategory,
        variantsMin,
        variantsMax,
        activeRatio,
        skuStartIndex: existingVariantCount + 1,
    });

    const products = [...fixed.products, ...extra.products];
    const variants = [...fixed.variants, ...extra.variants];

    const createdProducts =
        products.length > 0
            ? (
                  await prisma.product.createMany({
                      data: products,
                      skipDuplicates: true,
                  })
              ).count
            : 0;

    const createdVariants =
        variants.length > 0
            ? (
                  await prisma.productVariant.createMany({
                      data: variants.map((variant) => ({
                          id: variant.id,
                          productId: variant.productId,
                          sku: variant.sku,
                          attributes: variant.attributes,
                          price: variant.price,
                          stockQuantity: variant.stockQuantity,
                      })),
                      skipDuplicates: true,
                  })
              ).count
            : 0;

    const reviews = buildProductReviews(products);

    const createdReviews =
        reviews.length > 0
            ? (
                  await prisma.productReview.createMany({
                      data: reviews.map((review) => ({
                          id: review.id,
                          productId: review.productId,
                          userId: review.userId,
                          rating: review.rating,
                          comment: review.comment,
                      })),
                      skipDuplicates: true,
                  })
              ).count
            : 0;

    // Keep product aggregates aligned with the review rows that were just seeded.
    await refreshProductRatings(
        prisma,
        reviews.map((review) => review.productId),
    );

    return {
        products: createdProducts,
        productVariants: createdVariants,
        productReviews: createdReviews,
        variants,
    };
}
