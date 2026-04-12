import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { SEED_IDS } from "../constants.js";
import type { VariantSeedInput } from "../types.js";
import { calculateLineTotal, formatCents, parseMoneyToCents } from "../utils.js";
import { randomOrderNote } from "../vietnamese.js";

export async function seedOrders(
    prisma: PrismaClient,
    variants: VariantSeedInput[],
): Promise<{
    orders: number;
    orderItems: number;
}> {
    const variantPriceById = new Map(variants.map((variant) => [variant.id, variant.price]));

    const orderItemsBlueprint: Array<{
        orderId: string;
        variantId: string;
        quantity: number;
    }> = [
        {
            orderId: SEED_IDS.orders.pendingPayment,
            variantId: SEED_IDS.variants.smartphoneA256,
            quantity: 1,
        },
        {
            orderId: SEED_IDS.orders.pendingPayment,
            variantId: SEED_IDS.variants.speakerABlack,
            quantity: 2,
        },
        {
            orderId: SEED_IDS.orders.paidA,
            variantId: SEED_IDS.variants.laptopA32,
            quantity: 1,
        },
        {
            orderId: SEED_IDS.orders.paidB,
            variantId: SEED_IDS.variants.blenderAWhite,
            quantity: 1,
        },
        {
            orderId: SEED_IDS.orders.paidB,
            variantId: SEED_IDS.variants.smartphoneB128,
            quantity: 1,
        },
    ];

    const orderItems: Prisma.OrderItemCreateManyInput[] = orderItemsBlueprint.map((item) => {
        const unitPrice = variantPriceById.get(item.variantId);

        if (!unitPrice) {
            throw new Error(`Variant price not found for order item variant ${item.variantId}`);
        }

        return {
            orderId: item.orderId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice,
            lineTotal: calculateLineTotal(unitPrice, item.quantity),
        };
    });

    const subtotalByOrderId = new Map<string, bigint>();

    for (const item of orderItems) {
        const lineTotalCents = parseMoneyToCents(item.lineTotal.toString());
        subtotalByOrderId.set(
            item.orderId,
            (subtotalByOrderId.get(item.orderId) ?? 0n) + lineTotalCents,
        );
    }

    const orders: Prisma.OrderCreateManyInput[] = [
        {
            id: SEED_IDS.orders.pendingPayment,
            orderNumber: "SEED-ORD-20260401-0001",
            userId: SEED_IDS.users.customerA,
            shopId: SEED_IDS.shops.approved,
            shippingAddressId: SEED_IDS.addresses.customerA,
            status: "PENDING_PAYMENT",
            settlementStatus: "PENDING",
            subtotal: formatCents(subtotalByOrderId.get(SEED_IDS.orders.pendingPayment) ?? 0n),
            totalAmount: formatCents(subtotalByOrderId.get(SEED_IDS.orders.pendingPayment) ?? 0n),
            note: randomOrderNote(),
        },
        {
            id: SEED_IDS.orders.paidA,
            orderNumber: "SEED-ORD-20260401-0002",
            userId: SEED_IDS.users.customerB,
            shopId: SEED_IDS.shops.approved,
            shippingAddressId: SEED_IDS.addresses.customerB,
            status: "PAID",
            settlementStatus: "PENDING",
            subtotal: formatCents(subtotalByOrderId.get(SEED_IDS.orders.paidA) ?? 0n),
            totalAmount: formatCents(subtotalByOrderId.get(SEED_IDS.orders.paidA) ?? 0n),
            note: randomOrderNote(),
        },
        {
            id: SEED_IDS.orders.paidB,
            orderNumber: "SEED-ORD-20260401-0003",
            userId: SEED_IDS.users.customerC,
            shopId: SEED_IDS.shops.approved,
            shippingAddressId: SEED_IDS.addresses.customerC,
            status: "PAID",
            settlementStatus: "PENDING",
            subtotal: formatCents(subtotalByOrderId.get(SEED_IDS.orders.paidB) ?? 0n),
            totalAmount: formatCents(subtotalByOrderId.get(SEED_IDS.orders.paidB) ?? 0n),
            note: randomOrderNote(),
        },
    ];

    await prisma.order.createMany({ data: orders });
    await prisma.orderItem.createMany({ data: orderItems });

    return {
        orders: orders.length,
        orderItems: orderItems.length,
    };
}
