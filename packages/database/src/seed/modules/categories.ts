import type { PrismaClient } from "../../generated/prisma/client.js";
import { SEED_IDS } from "../constants.js";
import type { SeedCategoriesResult, SeedCategoryRecord } from "../types.js";

type SeedCategoryDefinition = {
    key: keyof typeof SEED_IDS.categories;
    parentKey: keyof typeof SEED_IDS.categories | null;
    name: string;
    slug: string;
    catalogKey: string;
    includeInExtraCatalog: boolean;
};

const CATEGORY_DEFINITIONS: SeedCategoryDefinition[] = [
    {
        key: "electronics",
        parentKey: null,
        name: "Đồ điện tử",
        slug: "electronics",
        catalogKey: "electronics",
        includeInExtraCatalog: true,
    },
    {
        key: "fashion",
        parentKey: null,
        name: "Thời trang",
        slug: "fashion",
        catalogKey: "fashion",
        includeInExtraCatalog: false,
    },
    {
        key: "homeLiving",
        parentKey: null,
        name: "Nhà cửa đời sống",
        slug: "home-living",
        catalogKey: "homeLiving",
        includeInExtraCatalog: false,
    },
    {
        key: "carMoto",
        parentKey: null,
        name: "Ô tô & xe máy",
        slug: "car-moto",
        catalogKey: "carMoto",
        includeInExtraCatalog: true,
    },
    {
        key: "vouchers",
        parentKey: null,
        name: "Voucher khuyến mại",
        slug: "vouchers",
        catalogKey: "vouchers",
        includeInExtraCatalog: true,
    },
    {
        key: "smartphones",
        parentKey: "electronics",
        name: "Điện thoại thông minh",
        slug: "smartphones",
        catalogKey: "smartphones",
        includeInExtraCatalog: true,
    },
    {
        key: "mobilePhones",
        parentKey: "electronics",
        name: "Điện thoại",
        slug: "mobile-phones",
        catalogKey: "mobilePhones",
        includeInExtraCatalog: true,
    },
    {
        key: "laptops",
        parentKey: "electronics",
        name: "Laptop",
        slug: "laptops",
        catalogKey: "laptops",
        includeInExtraCatalog: true,
    },
    {
        key: "menFashion",
        parentKey: "fashion",
        name: "Thời trang nam",
        slug: "men-fashion",
        catalogKey: "menFashion",
        includeInExtraCatalog: true,
    },
    {
        key: "womenFashion",
        parentKey: "fashion",
        name: "Thời trang nữ",
        slug: "women-fashion",
        catalogKey: "womenFashion",
        includeInExtraCatalog: true,
    },
    {
        key: "menShoes",
        parentKey: "fashion",
        name: "Giày dép nam",
        slug: "men-shoes",
        catalogKey: "menShoes",
        includeInExtraCatalog: true,
    },
    {
        key: "womenShoes",
        parentKey: "fashion",
        name: "Giày dép nữ",
        slug: "women-shoes",
        catalogKey: "womenShoes",
        includeInExtraCatalog: true,
    },
    {
        key: "beautyHealth",
        parentKey: "fashion",
        name: "Làm đẹp & sức khỏe",
        slug: "beauty-health",
        catalogKey: "beautyHealth",
        includeInExtraCatalog: true,
    },
    {
        key: "jewelryAccessories",
        parentKey: "fashion",
        name: "Trang sức",
        slug: "jewelry-accessories",
        catalogKey: "jewelryAccessories",
        includeInExtraCatalog: true,
    },
    {
        key: "kitchen",
        parentKey: "homeLiving",
        name: "Đồ dùng nhà bếp",
        slug: "kitchen",
        catalogKey: "kitchen",
        includeInExtraCatalog: true,
    },
    {
        key: "householdAppliances",
        parentKey: "homeLiving",
        name: "Đồ gia dụng",
        slug: "household-appliances",
        catalogKey: "householdAppliances",
        includeInExtraCatalog: true,
    },
    {
        key: "pets",
        parentKey: "homeLiving",
        name: "Thú cưng",
        slug: "pets",
        catalogKey: "pets",
        includeInExtraCatalog: true,
    },
    {
        key: "sports",
        parentKey: "homeLiving",
        name: "Thể thao",
        slug: "sports",
        catalogKey: "sports",
        includeInExtraCatalog: true,
    },
    {
        key: "toys",
        parentKey: "homeLiving",
        name: "Đồ chơi",
        slug: "toys",
        catalogKey: "toys",
        includeInExtraCatalog: true,
    },
    {
        key: "books",
        parentKey: "homeLiving",
        name: "Nhà sách online",
        slug: "books",
        catalogKey: "books",
        includeInExtraCatalog: true,
    },
];

export async function seedCategories(prisma: PrismaClient): Promise<SeedCategoriesResult> {
    const records: SeedCategoryRecord[] = [];
    const recordByCategoryKey = new Map<string, SeedCategoryRecord>();

    for (const definition of CATEGORY_DEFINITIONS) {
        const parentRecord = definition.parentKey
            ? recordByCategoryKey.get(definition.parentKey)
            : null;

        if (definition.parentKey && !parentRecord) {
            throw new Error(
                `Parent category ${definition.parentKey} must be seeded before children`,
            );
        }

        const parentId = parentRecord?.id ?? null;

        const category = await prisma.category.upsert({
            where: {
                slug: definition.slug,
            },
            update: {
                name: definition.name,
                parentId,
            },
            create: {
                id: SEED_IDS.categories[definition.key],
                parentId,
                name: definition.name,
                slug: definition.slug,
            },
            select: {
                id: true,
                slug: true,
            },
        });

        const record: SeedCategoryRecord = {
            key: definition.key,
            id: category.id,
            slug: category.slug,
            catalogKey: definition.catalogKey,
            includeInExtraCatalog: definition.includeInExtraCatalog,
        };

        records.push(record);
        recordByCategoryKey.set(definition.key, record);
    }

    return {
        count: records.length,
        records,
    };
}
