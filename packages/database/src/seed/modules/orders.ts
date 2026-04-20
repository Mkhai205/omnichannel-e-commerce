import { randomUUID } from "node:crypto";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { TARGET_SEED_COUNTS } from "../constants.js";
import type { SeedOrderRecord, VariantSeedInput } from "../types.js";
import { calculateLineTotal, formatCents, parseMoneyToCents } from "../utils.js";
import { randomOrderNote } from "../vietnamese.js";

const ORDER_STATUSES: SeedOrderRecord["status"][] = [
    "PAID",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "PENDING_PAYMENT",
    "CANCELLED",
    "PAID",
    "DELIVERED",
    "PROCESSING",
    "PENDING_PAYMENT",
    "PAID",
];

function getRequiredValue<T>(value: T | undefined, message: string): T {
    if (value === undefined) {
        throw new Error(message);
    }

    return value;
}

export async function seedOrders(
    prisma: PrismaClient,
    input: {
        customerIds: string[];
        shopIds: string[];
        variants: VariantSeedInput[];
        addresses: Array<{
            id: string;
            userId: string;
        }>;
    },
): Promise<{
    orders: number;
    orderItems: number;
    records: SeedOrderRecord[];
}> {
    if (input.customerIds.length === 0 || input.shopIds.length === 0 || input.variants.length < 2) {
        throw new Error("Orders require seeded customers, shops, and at least two variants.");
    }

    const addressByUserId = new Map(input.addresses.map((address) => [address.userId, address.id]));
    const variantsByShop = new Map<string, VariantSeedInput[]>();

    input.variants.forEach((variant) => {
        const current = variantsByShop.get(variant.shopId) ?? [];
        current.push(variant);
        variantsByShop.set(variant.shopId, current);
    });

    const orderItems: Prisma.OrderItemCreateManyInput[] = [];
    const records: SeedOrderRecord[] = [];

    for (let index = 0; index < TARGET_SEED_COUNTS.orders; index += 1) {
        const status = getRequiredValue(
            ORDER_STATUSES[index % ORDER_STATUSES.length],
            "Missing order status",
        );
        const customerId = getRequiredValue(
            input.customerIds[index % input.customerIds.length],
            "Missing customer id",
        );
        const shopId = getRequiredValue(
            input.shopIds[index % input.shopIds.length],
            "Missing shop id",
        );
        const shippingAddressId = addressByUserId.get(customerId);

        if (!shippingAddressId) {
            throw new Error(`Missing seeded address for customer ${customerId}`);
        }

        const shopVariants = variantsByShop.get(shopId) ?? input.variants;

        if (shopVariants.length < 2) {
            throw new Error(`Shop ${shopId} must have at least two variants for order seeding.`);
        }

        const firstVariant = getRequiredValue(
            shopVariants[(index * 2) % shopVariants.length],
            `Missing first variant for order index ${index}`,
        );
        const secondVariant = getRequiredValue(
            shopVariants[(index * 2 + 1) % shopVariants.length],
            `Missing second variant for order index ${index}`,
        );

        const orderId = randomUUID();
        const lineOneQuantity = (index % 3) + 1;
        const lineTwoQuantity = ((index + 1) % 2) + 1;

        const itemRows: Prisma.OrderItemCreateManyInput[] = [
            {
                id: randomUUID(),
                orderId,
                variantId: firstVariant.id,
                quantity: lineOneQuantity,
                unitPrice: firstVariant.price,
                lineTotal: calculateLineTotal(firstVariant.price, lineOneQuantity),
            },
            {
                id: randomUUID(),
                orderId,
                variantId: secondVariant.id,
                quantity: lineTwoQuantity,
                unitPrice: secondVariant.price,
                lineTotal: calculateLineTotal(secondVariant.price, lineTwoQuantity),
            },
        ];

        orderItems.push(...itemRows);

        const subtotalCents = itemRows.reduce(
            (sum, item) => sum + parseMoneyToCents(item.lineTotal.toString()),
            0n,
        );

        records.push({
            id: orderId,
            orderNumber: `SEED-ORD-20260416-${String(index + 1).padStart(4, "0")}`,
            shopId,
            userId: customerId,
            status,
            totalAmount: formatCents(subtotalCents),
        });

        await prisma.order.create({
            data: {
                id: orderId,
                orderNumber: `SEED-ORD-20260416-${String(index + 1).padStart(4, "0")}`,
                userId: customerId,
                shopId,
                shippingAddressId,
                status,
                settlementStatus: status === "DELIVERED" ? "SETTLED" : "PENDING",
                subtotal: formatCents(subtotalCents),
                totalAmount: formatCents(subtotalCents),
                note: randomOrderNote(),
            },
        });
    }

    await prisma.orderItem.createMany({ data: orderItems });

    return {
        orders: records.length,
        orderItems: orderItems.length,
        records,
    };
}
