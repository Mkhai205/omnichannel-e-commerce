import { randomUUID } from "node:crypto";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import type { VariantSeedInput } from "../types.js";

export async function seedCarts(
    prisma: PrismaClient,
    input: {
        customerIds: string[];
        variants: VariantSeedInput[];
    },
): Promise<{
    carts: number;
    cartItems: number;
}> {
    const cartRecords = input.customerIds.map((customerId) => ({
        id: randomUUID(),
        userId: customerId,
    }));

    const carts: Prisma.CartCreateManyInput[] = cartRecords.map((record) => ({
        id: record.id,
        userId: record.userId,
    }));

    const cartItems: Prisma.CartItemCreateManyInput[] = cartRecords.flatMap((cart, cartIndex) => {
        const start = cartIndex * 3;
        const variantSlice = input.variants.slice(start, start + 3);

        return variantSlice.map((variant, variantOffset) => ({
            cartId: cart.id,
            variantId: variant.id,
            quantity: variantOffset + 1,
        }));
    });

    await prisma.cart.createMany({ data: carts });

    if (cartItems.length > 0) {
        await prisma.cartItem.createMany({ data: cartItems });
    }

    return {
        carts: carts.length,
        cartItems: cartItems.length,
    };
}
