import type { PrismaClient } from "../generated/prisma/client.js";

type CleanupSummary = Record<string, number>;

export async function previewCleanup(prisma: PrismaClient): Promise<CleanupSummary> {
    return {
        paymentWebhookLogs: await prisma.paymentWebhookLog.count(),
        paymentOrders: await prisma.paymentOrder.count(),
        adminWalletLedgers: await prisma.adminWalletLedger.count(),
        sellerSettlements: await prisma.sellerSettlement.count(),
        orderItems: await prisma.orderItem.count(),
        cartItems: await prisma.cartItem.count(),
        payments: await prisma.payment.count(),
        orders: await prisma.order.count(),
        carts: await prisma.cart.count(),
        addresses: await prisma.address.count(),
        productReviews: await prisma.productReview.count(),
        productVariants: await prisma.productVariant.count(),
        products: await prisma.product.count(),
        categories: await prisma.category.count(),
        sellerWallets: await prisma.sellerWallet.count(),
        adminWallets: await prisma.adminWallet.count(),
        shops: await prisma.shop.count(),
        refreshTokens: await prisma.refreshToken.count(),
        oauthAccounts: await prisma.oauthAccount.count(),
        users: await prisma.user.count(),
    };
}

export async function cleanDatabase(prisma: PrismaClient): Promise<CleanupSummary> {
    return {
        paymentWebhookLogs: (await prisma.paymentWebhookLog.deleteMany()).count,
        paymentOrders: (await prisma.paymentOrder.deleteMany()).count,
        adminWalletLedgers: (await prisma.adminWalletLedger.deleteMany()).count,
        sellerSettlements: (await prisma.sellerSettlement.deleteMany()).count,
        orderItems: (await prisma.orderItem.deleteMany()).count,
        cartItems: (await prisma.cartItem.deleteMany()).count,
        payments: (await prisma.payment.deleteMany()).count,
        orders: (await prisma.order.deleteMany()).count,
        carts: (await prisma.cart.deleteMany()).count,
        addresses: (await prisma.address.deleteMany()).count,
        productReviews: (await prisma.productReview.deleteMany()).count,
        productVariants: (await prisma.productVariant.deleteMany()).count,
        products: (await prisma.product.deleteMany()).count,
        categories: (await prisma.category.deleteMany()).count,
        sellerWallets: (await prisma.sellerWallet.deleteMany()).count,
        adminWallets: (await prisma.adminWallet.deleteMany()).count,
        shops: (await prisma.shop.deleteMany()).count,
        refreshTokens: (await prisma.refreshToken.deleteMany()).count,
        oauthAccounts: (await prisma.oauthAccount.deleteMany()).count,
        users: (await prisma.user.deleteMany()).count,
    };
}
