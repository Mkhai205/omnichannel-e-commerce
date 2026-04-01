import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { SEED_IDS } from "../constants.js";

export async function seedCarts(prisma: PrismaClient): Promise<{
    carts: number;
    cartItems: number;
}> {
    const carts: Prisma.CartCreateManyInput[] = [
        {
            id: SEED_IDS.carts.customerA,
            userId: SEED_IDS.users.customerA,
        },
        {
            id: SEED_IDS.carts.customerB,
            userId: SEED_IDS.users.customerB,
        },
        {
            id: SEED_IDS.carts.customerC,
            userId: SEED_IDS.users.customerC,
        },
    ];

    const cartItems: Prisma.CartItemCreateManyInput[] = [
        {
            cartId: SEED_IDS.carts.customerA,
            variantId: SEED_IDS.variants.smartphoneA128,
            quantity: 1,
        },
        {
            cartId: SEED_IDS.carts.customerA,
            variantId: SEED_IDS.variants.blenderABlack,
            quantity: 2,
        },
        {
            cartId: SEED_IDS.carts.customerB,
            variantId: SEED_IDS.variants.laptopA16,
            quantity: 1,
        },
        {
            cartId: SEED_IDS.carts.customerC,
            variantId: SEED_IDS.variants.speakerABlue,
            quantity: 3,
        },
    ];

    await prisma.cart.createMany({ data: carts });
    await prisma.cartItem.createMany({ data: cartItems });

    return {
        carts: carts.length,
        cartItems: cartItems.length,
    };
}
