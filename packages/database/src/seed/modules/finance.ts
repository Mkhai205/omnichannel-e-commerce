import { faker } from "../faker.js";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { DEFAULT_SEED_ADMIN_WALLET_CODE, SEED_IDS } from "../constants.js";
import { formatCents, parseMoneyToCents } from "../utils.js";

type PaymentFixture = {
    id: string;
    orderId: string;
    txnRef: string;
    status: "PENDING" | "SUCCESS";
    gatewayTransactionNo: string | null;
    responseCode: string;
    message: string;
};

type WalletBreakdown = {
    grossAmount: string;
    commissionAmount: string;
    netAmount: string;
};

const PAYMENT_FIXTURES: PaymentFixture[] = [
    {
        id: SEED_IDS.payments.pendingOrder,
        orderId: SEED_IDS.orders.pendingPayment,
        txnRef: "SEED-TXN-0001",
        status: "PENDING",
        gatewayTransactionNo: null,
        responseCode: "99",
        message: "Pending user payment confirmation",
    },
    {
        id: SEED_IDS.payments.paidA,
        orderId: SEED_IDS.orders.paidA,
        txnRef: "SEED-TXN-0002",
        status: "SUCCESS",
        gatewayTransactionNo: "SEED-GW-0002",
        responseCode: "00",
        message: "Payment success",
    },
    {
        id: SEED_IDS.payments.paidB,
        orderId: SEED_IDS.orders.paidB,
        txnRef: "SEED-TXN-0003",
        status: "SUCCESS",
        gatewayTransactionNo: "SEED-GW-0003",
        responseCode: "00",
        message: "Payment success",
    },
];

function toMoneyString(value: Prisma.Decimal | string): string {
    return typeof value === "string" ? value : value.toString();
}

function calculateWalletBreakdown(totalAmount: string): WalletBreakdown {
    const grossCents = parseMoneyToCents(totalAmount);
    const commissionCents = (grossCents * 10n) / 100n;
    const netCents = grossCents - commissionCents;

    return {
        grossAmount: formatCents(grossCents),
        commissionAmount: formatCents(commissionCents),
        netAmount: formatCents(netCents),
    };
}

export async function seedFinance(prisma: PrismaClient): Promise<{
    payments: number;
    paymentOrders: number;
    paymentWebhookLogs: number;
    adminWallets: number;
    adminWalletLedgers: number;
    sellerWallets: number;
    sellerSettlements: number;
}> {
    const orderIds = PAYMENT_FIXTURES.map((fixture) => fixture.orderId);
    const orders = await prisma.order.findMany({
        where: {
            id: {
                in: orderIds,
            },
        },
        select: {
            id: true,
            orderNumber: true,
            userId: true,
            shopId: true,
            totalAmount: true,
        },
    });

    const orderById = new Map(orders.map((order) => [order.id, order]));

    for (const fixture of PAYMENT_FIXTURES) {
        if (!orderById.has(fixture.orderId)) {
            throw new Error(`Missing seeded order for finance fixture ${fixture.orderId}`);
        }
    }

    const adminWallet = await prisma.adminWallet.upsert({
        where: {
            code: DEFAULT_SEED_ADMIN_WALLET_CODE,
        },
        update: {},
        create: {
            id: SEED_IDS.adminWallets.main,
            code: DEFAULT_SEED_ADMIN_WALLET_CODE,
        },
        select: {
            id: true,
        },
    });

    const sellerWalletResult = await prisma.sellerWallet.createMany({
        data: [
            {
                id: SEED_IDS.sellerWallets.approved,
                shopId: SEED_IDS.shops.approved,
            },
            {
                id: SEED_IDS.sellerWallets.pending,
                shopId: SEED_IDS.shops.pending,
            },
            {
                id: SEED_IDS.sellerWallets.rejected,
                shopId: SEED_IDS.shops.rejected,
            },
        ],
        skipDuplicates: true,
    });

    const paymentRows: Prisma.PaymentCreateManyInput[] = PAYMENT_FIXTURES.map((fixture) => {
        const order = orderById.get(fixture.orderId);

        if (!order) {
            throw new Error(`Order not found while mapping payment fixture ${fixture.orderId}`);
        }

        const amount = toMoneyString(order.totalAmount);
        const isSuccess = fixture.status === "SUCCESS";

        return {
            id: fixture.id,
            userId: order.userId,
            provider: "VNPAY",
            status: fixture.status,
            txnRef: fixture.txnRef,
            gatewayTransactionNo: fixture.gatewayTransactionNo,
            amount,
            currency: "VND",
            bankCode: "NCB",
            orderInfo: `Seed payment for ${order.orderNumber}`,
            paidAt: isSuccess ? new Date() : null,
            failedReason: null,
            requestPayload: {
                source: "seed",
                orderId: order.id,
                orderNumber: order.orderNumber,
            },
            responsePayload: {
                responseCode: fixture.responseCode,
                message: fixture.message,
            },
            expiresAt: isSuccess ? null : new Date(Date.now() + 15 * 60 * 1000),
        };
    });

    const payments = await prisma.payment.createMany({
        data: paymentRows,
        skipDuplicates: true,
    });

    const paymentOrders = await prisma.paymentOrder.createMany({
        data: PAYMENT_FIXTURES.map((fixture) => ({
            paymentId: fixture.id,
            orderId: fixture.orderId,
        })),
        skipDuplicates: true,
    });

    const paymentWebhookLogs = await prisma.paymentWebhookLog.createMany({
        data: PAYMENT_FIXTURES.map((fixture, index) => ({
            id: faker.string.uuid(),
            paymentId: fixture.id,
            provider: "VNPAY",
            eventKey: `SEED-WEBHOOK-${String(index + 1).padStart(4, "0")}`,
            txnRef: fixture.txnRef,
            isVerified: true,
            isSuccess: fixture.status === "SUCCESS",
            responseCode: fixture.responseCode,
            message: fixture.message,
            payload: {
                source: "seed",
                txnRef: fixture.txnRef,
                status: fixture.status,
            },
        })),
        skipDuplicates: true,
    });

    const successfulFixtures = PAYMENT_FIXTURES.filter((fixture) => fixture.status === "SUCCESS");
    const sellerWalletIdByShopId = new Map<string, string>([
        [SEED_IDS.shops.approved, SEED_IDS.sellerWallets.approved],
        [SEED_IDS.shops.pending, SEED_IDS.sellerWallets.pending],
        [SEED_IDS.shops.rejected, SEED_IDS.sellerWallets.rejected],
    ]);

    const ledgerRows: Prisma.AdminWalletLedgerCreateManyInput[] = [];
    const settlementRows: Prisma.SellerSettlementCreateManyInput[] = [];
    const walletCreditById = new Map<string, bigint>();
    let totalInflowCents = 0n;
    let totalReleasedSellerCents = 0n;
    let totalCommissionCents = 0n;

    successfulFixtures.forEach((fixture, index) => {
        const order = orderById.get(fixture.orderId);

        if (!order) {
            return;
        }

        const sellerWalletId = sellerWalletIdByShopId.get(order.shopId);

        if (!sellerWalletId) {
            throw new Error(`Missing seller wallet fixture for shop ${order.shopId}`);
        }

        const breakdown = calculateWalletBreakdown(toMoneyString(order.totalAmount));
        const grossCents = parseMoneyToCents(breakdown.grossAmount);
        const commissionCents = parseMoneyToCents(breakdown.commissionAmount);
        const netCents = parseMoneyToCents(breakdown.netAmount);

        totalInflowCents += grossCents;
        totalCommissionCents += commissionCents;
        totalReleasedSellerCents += netCents;
        walletCreditById.set(
            sellerWalletId,
            (walletCreditById.get(sellerWalletId) ?? 0n) + netCents,
        );

        const inflowId =
            index === 0
                ? SEED_IDS.adminWalletLedgers.paymentInflowA
                : SEED_IDS.adminWalletLedgers.paymentInflowB;
        const settlementLedgerId =
            index === 0
                ? SEED_IDS.adminWalletLedgers.sellerSettlementA
                : SEED_IDS.adminWalletLedgers.sellerSettlementB;
        const settlementId =
            index === 0 ? SEED_IDS.sellerSettlements.paidA : SEED_IDS.sellerSettlements.paidB;

        ledgerRows.push(
            {
                id: inflowId,
                adminWalletId: adminWallet.id,
                paymentId: fixture.id,
                orderId: order.id,
                type: "PAYMENT_INFLOW",
                idempotencyKey: `SEED-LEDGER-INFLOW-${order.id}`,
                grossAmount: breakdown.grossAmount,
                commission: breakdown.commissionAmount,
                netAmount: breakdown.netAmount,
                note: `Seed inflow for ${order.orderNumber}`,
            },
            {
                id: settlementLedgerId,
                adminWalletId: adminWallet.id,
                paymentId: fixture.id,
                orderId: order.id,
                type: "SELLER_SETTLEMENT",
                idempotencyKey: `SEED-LEDGER-SETTLEMENT-${order.id}`,
                grossAmount: breakdown.netAmount,
                commission: "0.00",
                netAmount: breakdown.netAmount,
                note: `Seed settlement for ${order.orderNumber}`,
            },
        );

        settlementRows.push({
            id: settlementId,
            orderId: order.id,
            shopId: order.shopId,
            sellerWalletId,
            idempotencyKey: `SEED-SETTLEMENT-${order.id}`,
            status: "COMPLETED",
            grossAmount: breakdown.grossAmount,
            commissionAmount: breakdown.commissionAmount,
            netAmount: breakdown.netAmount,
            settledAt: new Date(),
        });
    });

    const adminWalletLedgers = await prisma.adminWalletLedger.createMany({
        data: ledgerRows,
        skipDuplicates: true,
    });

    const sellerSettlements = await prisma.sellerSettlement.createMany({
        data: settlementRows,
        skipDuplicates: true,
    });

    for (const [sellerWalletId, creditCents] of walletCreditById.entries()) {
        await prisma.sellerWallet.update({
            where: {
                id: sellerWalletId,
            },
            data: {
                availableBalance: formatCents(creditCents),
                pendingBalance: "0.00",
                totalCredited: formatCents(creditCents),
            },
        });
    }

    await prisma.adminWallet.update({
        where: {
            id: adminWallet.id,
        },
        data: {
            escrowBalance: "0.00",
            commissionBalance: formatCents(totalCommissionCents),
            totalInflow: formatCents(totalInflowCents),
            totalReleasedSeller: formatCents(totalReleasedSellerCents),
        },
    });

    return {
        payments: payments.count,
        paymentOrders: paymentOrders.count,
        paymentWebhookLogs: paymentWebhookLogs.count,
        adminWallets: 1,
        adminWalletLedgers: adminWalletLedgers.count,
        sellerWallets: sellerWalletResult.count,
        sellerSettlements: sellerSettlements.count,
    };
}
