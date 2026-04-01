import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { SEED_IDS } from "../constants.js";

export async function seedCategories(prisma: PrismaClient): Promise<number> {
    const categories: Prisma.CategoryCreateManyInput[] = [
        {
            id: SEED_IDS.categories.electronics,
            parentId: null,
            name: "Điện tử",
            slug: "electronics",
        },
        {
            id: SEED_IDS.categories.fashion,
            parentId: null,
            name: "Thời trang",
            slug: "fashion",
        },
        {
            id: SEED_IDS.categories.homeLiving,
            parentId: null,
            name: "Nhà cửa đời sống",
            slug: "home-living",
        },
        {
            id: SEED_IDS.categories.smartphones,
            parentId: SEED_IDS.categories.electronics,
            name: "Điện thoại thông minh",
            slug: "smartphones",
        },
        {
            id: SEED_IDS.categories.laptops,
            parentId: SEED_IDS.categories.electronics,
            name: "Laptop",
            slug: "laptops",
        },
        {
            id: SEED_IDS.categories.menFashion,
            parentId: SEED_IDS.categories.fashion,
            name: "Thời trang nam",
            slug: "men-fashion",
        },
        {
            id: SEED_IDS.categories.kitchen,
            parentId: SEED_IDS.categories.homeLiving,
            name: "Đồ dùng nhà bếp",
            slug: "kitchen",
        },
    ];

    await prisma.category.createMany({ data: categories });

    return categories.length;
}
