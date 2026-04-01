import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { SEED_IDS } from "../constants.js";

export async function seedCategories(prisma: PrismaClient): Promise<number> {
    const categories: Prisma.CategoryCreateManyInput[] = [
        {
            id: SEED_IDS.categories.electronics,
            parentId: null,
            name: "Electronics",
            slug: "electronics",
        },
        {
            id: SEED_IDS.categories.fashion,
            parentId: null,
            name: "Fashion",
            slug: "fashion",
        },
        {
            id: SEED_IDS.categories.homeLiving,
            parentId: null,
            name: "Home Living",
            slug: "home-living",
        },
        {
            id: SEED_IDS.categories.smartphones,
            parentId: SEED_IDS.categories.electronics,
            name: "Smartphones",
            slug: "smartphones",
        },
        {
            id: SEED_IDS.categories.laptops,
            parentId: SEED_IDS.categories.electronics,
            name: "Laptops",
            slug: "laptops",
        },
        {
            id: SEED_IDS.categories.menFashion,
            parentId: SEED_IDS.categories.fashion,
            name: "Men Fashion",
            slug: "men-fashion",
        },
        {
            id: SEED_IDS.categories.kitchen,
            parentId: SEED_IDS.categories.homeLiving,
            name: "Kitchen",
            slug: "kitchen",
        },
    ];

    await prisma.category.createMany({ data: categories });

    return categories.length;
}
