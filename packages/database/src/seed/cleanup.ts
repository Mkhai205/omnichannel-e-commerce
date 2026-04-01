import type { PrismaClient } from "../generated/prisma/client.js";

export async function cleanDatabase(prisma: PrismaClient): Promise<void> {
    await prisma.$transaction([
        prisma.paymentWebhookLog.deleteMany(),
        prisma.paymentOrder.deleteMany(),
        prisma.orderItem.deleteMany(),
        prisma.cartItem.deleteMany(),
        prisma.inventoryLog.deleteMany(),
        prisma.payment.deleteMany(),
        prisma.order.deleteMany(),
        prisma.cart.deleteMany(),
        prisma.address.deleteMany(),
        prisma.productVariant.deleteMany(),
        prisma.product.deleteMany(),
        prisma.category.deleteMany(),
        prisma.shop.deleteMany(),
        prisma.refreshToken.deleteMany(),
        prisma.oauthAccount.deleteMany(),
        prisma.user.deleteMany(),
    ]);
}
