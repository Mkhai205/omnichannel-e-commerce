import { randomUUID } from "node:crypto";
import { faker } from "../faker.js";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { TARGET_SEED_COUNTS } from "../constants.js";
import type {
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

const REVIEW_COMMENTS = [
    "Đóng gói kỹ, nhận hàng đúng mô tả.",
    "Chất lượng ổn trong tầm giá, sẽ mua lại.",
    "Sản phẩm dùng tốt, giao hàng đúng hẹn.",
] as const;

function buildVariantSku(
    categorySlug: string,
    productInCategory: number,
    variantInProduct: number,
): string {
    const compactSlug = categorySlug
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 10);

    return `SEED-${compactSlug}-${String(productInCategory).padStart(3, "0")}-V${variantInProduct}`;
}

function buildRoundedVndPrice(
    categoryIndex: number,
    productInCategory: number,
    variantInProduct: number,
): string {
    const thousandValue =
        100 + (((categoryIndex + 1) * 137 + productInCategory * 19 + variantInProduct * 7) % 9000);
    const cents = BigInt(thousandValue * 1000) * 100n;

    return formatCents(cents);
}

async function refreshProductRatings(prisma: PrismaClient, productIds: string[]): Promise<void> {
    const groupedRatings = await prisma.productReview.groupBy({
        by: ["productId"],
        where: {
            productId: {
                in: productIds,
            },
        },
        _avg: {
            rating: true,
        },
        _count: {
            _all: true,
        },
    });

    for (const aggregate of groupedRatings) {
        const averageRating = Number(aggregate._avg.rating ?? 0);
        const normalizedAverage = Number.isFinite(averageRating)
            ? Number(averageRating.toFixed(2))
            : 0;

        await prisma.product.update({
            where: {
                id: aggregate.productId,
            },
            data: {
                ratingAverage: normalizedAverage.toFixed(2),
                ratingCount: aggregate._count._all,
            },
        });
    }
}

export async function seedCatalog(
    prisma: PrismaClient,
    input: {
        categoryRecords: SeedCategoryRecord[];
        customerIds: string[];
        shopIds: string[];
    },
): Promise<CatalogSeedResult> {
    if (input.customerIds.length < TARGET_SEED_COUNTS.reviewsPerProduct) {
        throw new Error(
            "At least three customer users are required to seed three reviews per product.",
        );
    }

    if (input.shopIds.length === 0) {
        throw new Error("At least one shop is required to seed catalog data.");
    }

    const reviewerIds = input.customerIds.slice(0, TARGET_SEED_COUNTS.reviewsPerProduct);
    const productRecords: Array<{
        id: string;
        shopId: string;
        categoryId: string;
        name: string;
        description: string;
    }> = [];
    const variants: VariantSeedInput[] = [];
    const reviews: ProductReviewSeedInput[] = [];

    let globalProductIndex = 0;

    input.categoryRecords.forEach((category, categoryIndex) => {
        for (
            let productInCategory = 1;
            productInCategory <= TARGET_SEED_COUNTS.productsPerCategory;
            productInCategory += 1
        ) {
            globalProductIndex += 1;

            const productId = randomUUID();
            const shopId = input.shopIds[(globalProductIndex - 1) % input.shopIds.length];

            if (!shopId) {
                throw new Error("Missing shop id while seeding catalog.");
            }

            productRecords.push({
                id: productId,
                shopId,
                categoryId: category.id,
                name: `${randomVietnameseProductName(category.catalogKey)} #${productInCategory}`,
                description: randomVietnameseProductDescription(),
            });

            for (
                let variantInProduct = 1;
                variantInProduct <= TARGET_SEED_COUNTS.variantsPerProduct;
                variantInProduct += 1
            ) {
                variants.push({
                    id: randomUUID(),
                    productId,
                    shopId,
                    sku: buildVariantSku(category.slug, productInCategory, variantInProduct),
                    attributes: {
                        color: randomVietnameseColor(),
                        material: randomVietnameseMaterial(),
                        version: `V${variantInProduct}`,
                    },
                    price: buildRoundedVndPrice(categoryIndex, productInCategory, variantInProduct),
                    stockQuantity: faker.number.int({ min: 20, max: 250 }),
                });
            }

            reviewerIds.forEach((userId, reviewerIndex) => {
                reviews.push({
                    id: randomUUID(),
                    productId,
                    userId,
                    rating: faker.number.int({ min: 3, max: 5 }),
                    comment: REVIEW_COMMENTS[reviewerIndex] ?? REVIEW_COMMENTS[0],
                });
            });
        }
    });

    const products: Prisma.ProductCreateManyInput[] = productRecords.map((product) => ({
        id: product.id,
        shopId: product.shopId,
        categoryId: product.categoryId,
        name: product.name,
        description: product.description,
        status: "ACTIVE",
    }));

    const createdProducts = (await prisma.product.createMany({ data: products })).count;

    const createdVariants = (
        await prisma.productVariant.createMany({
            data: variants.map((variant) => ({
                id: variant.id,
                productId: variant.productId,
                sku: variant.sku,
                attributes: variant.attributes,
                price: variant.price,
                stockQuantity: variant.stockQuantity,
            })),
        })
    ).count;

    const createdReviews = (
        await prisma.productReview.createMany({
            data: reviews.map((review) => ({
                id: review.id,
                productId: review.productId,
                userId: review.userId,
                rating: review.rating,
                comment: review.comment,
            })),
        })
    ).count;

    await refreshProductRatings(
        prisma,
        productRecords.map((product) => product.id),
    );

    return {
        products: createdProducts,
        productVariants: createdVariants,
        productReviews: createdReviews,
        variants,
    };
}
