import { randomUUID } from "node:crypto";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { DEFAULT_SEED_ADMIN_WALLET_CODE, SEED_IDS } from "../constants.js";
import type { SeedOrderRecord } from "../types.js";
import { formatCents, parseMoneyToCents } from "../utils.js";

type WalletBreakdown = {
    grossAmount: string;
    commissionAmount: string;
    netAmount: string;
};

function mapPaymentStatus(
    orderStatus: SeedOrderRecord["status"],
): "PENDING" | "SUCCESS" | "CANCELLED" {
    if (orderStatus === "PENDING_PAYMENT") {
        return "PENDING";
    }

    if (orderStatus === "CANCELLED") {
        return "CANCELLED";
    }

    return "SUCCESS";
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

export async function seedFinance(
    prisma: PrismaClient,
    input: {
        orderRecords: SeedOrderRecord[];
        shopIds: string[];
    },
): Promise<{
    payments: number;
    paymentOrders: number;
    paymentWebhookLogs: number;
    adminWallets: number;
    adminWalletLedgers: number;
    sellerWallets: number;
    sellerSettlements: number;
}> {
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

    const sellerWalletMap = new Map<string, string>();

    input.shopIds.forEach((shopId) => {
        sellerWalletMap.set(shopId, randomUUID());
    });

    const sellerWallets = await prisma.sellerWallet.createMany({
        data: input.shopIds.map((shopId) => ({
            id: sellerWalletMap.get(shopId) ?? randomUUID(),
            shopId,
        })),
    });

    const paymentRows = input.orderRecords.map((order, index) => {
        const paymentStatus = mapPaymentStatus(order.status);
        const paymentId = randomUUID();

        return {
            id: paymentId,
            orderId: order.id,
            orderNumber: order.orderNumber,
            userId: order.userId,
            shopId: order.shopId,
            paymentStatus,
            txnRef: `SEED-TXN-20260416-${String(index + 1).padStart(5, "0")}`,
            gatewayTransactionNo:
                paymentStatus === "SUCCESS"
                    ? `SEED-GW-20260416-${String(index + 1).padStart(5, "0")}`
                    : null,
            totalAmount: order.totalAmount,
        };
    });

    const payments = await prisma.payment.createMany({
        data: paymentRows.map((payment) => ({
            id: payment.id,
            userId: payment.userId,
            provider: "VNPAY",
            status: payment.paymentStatus,
            txnRef: payment.txnRef,
            gatewayTransactionNo: payment.gatewayTransactionNo,
            amount: payment.totalAmount,
            currency: "VND",
            bankCode: "NCB",
            orderInfo: `Seed payment for ${payment.orderNumber}`,
            paidAt: payment.paymentStatus === "SUCCESS" ? new Date() : null,
            failedReason: payment.paymentStatus === "CANCELLED" ? "Order was cancelled" : null,
            requestPayload: {
                source: "seed",
                orderId: payment.orderId,
                orderNumber: payment.orderNumber,
            },
            responsePayload: {
                status: payment.paymentStatus,
            },
            expiresAt:
                payment.paymentStatus === "PENDING" ? new Date(Date.now() + 15 * 60 * 1000) : null,
        })),
    });

    const paymentOrders = await prisma.paymentOrder.createMany({
        data: paymentRows.map((payment) => ({
            id: randomUUID(),
            paymentId: payment.id,
            orderId: payment.orderId,
        })),
    });

    const paymentWebhookLogs = await prisma.paymentWebhookLog.createMany({
        data: paymentRows.map((payment, index) => ({
            id: randomUUID(),
            paymentId: payment.id,
            provider: "VNPAY",
            eventKey: `SEED-WEBHOOK-20260416-${String(index + 1).padStart(5, "0")}`,
            txnRef: payment.txnRef,
            isVerified: true,
            isSuccess: payment.paymentStatus === "SUCCESS",
            responseCode: payment.paymentStatus === "SUCCESS" ? "00" : "99",
            message: `Seed webhook ${payment.paymentStatus}`,
            payload: {
                source: "seed",
                status: payment.paymentStatus,
                orderId: payment.orderId,
            },
        })),
    });

    const successPayments = paymentRows.filter((payment) => payment.paymentStatus === "SUCCESS");
    const ledgerRows: Prisma.AdminWalletLedgerCreateManyInput[] = [];
    const settlementRows: Prisma.SellerSettlementCreateManyInput[] = [];
    const creditedByWalletId = new Map<string, bigint>();
    let totalInflowCents = 0n;
    let totalCommissionCents = 0n;
    let totalReleasedSellerCents = 0n;

    successPayments.forEach((payment) => {
        const sellerWalletId = sellerWalletMap.get(payment.shopId);

        if (!sellerWalletId) {
            throw new Error(`Missing seller wallet for shop ${payment.shopId}`);
        }

        const breakdown = calculateWalletBreakdown(payment.totalAmount);
        const grossCents = parseMoneyToCents(breakdown.grossAmount);
        const commissionCents = parseMoneyToCents(breakdown.commissionAmount);
        const netCents = parseMoneyToCents(breakdown.netAmount);

        totalInflowCents += grossCents;
        totalCommissionCents += commissionCents;
        totalReleasedSellerCents += netCents;

        creditedByWalletId.set(
            sellerWalletId,
            (creditedByWalletId.get(sellerWalletId) ?? 0n) + netCents,
        );

        ledgerRows.push(
            {
                id: randomUUID(),
                adminWalletId: adminWallet.id,
                paymentId: payment.id,
                orderId: payment.orderId,
                type: "PAYMENT_INFLOW",
                idempotencyKey: `SEED-LEDGER-INFLOW-${payment.orderId}`,
                grossAmount: breakdown.grossAmount,
                commission: breakdown.commissionAmount,
                netAmount: breakdown.netAmount,
                note: `Seed inflow for ${payment.orderNumber}`,
            },
            {
                id: randomUUID(),
                adminWalletId: adminWallet.id,
                paymentId: payment.id,
                orderId: payment.orderId,
                type: "SELLER_SETTLEMENT",
                idempotencyKey: `SEED-LEDGER-SETTLEMENT-${payment.orderId}`,
                grossAmount: breakdown.netAmount,
                commission: "0.00",
                netAmount: breakdown.netAmount,
                note: `Seed settlement for ${payment.orderNumber}`,
            },
        );

        settlementRows.push({
            id: randomUUID(),
            orderId: payment.orderId,
            shopId: payment.shopId,
            sellerWalletId,
            idempotencyKey: `SEED-SETTLEMENT-${payment.orderId}`,
            status: "COMPLETED",
            grossAmount: breakdown.grossAmount,
            commissionAmount: breakdown.commissionAmount,
            netAmount: breakdown.netAmount,
            settledAt: new Date(),
        });
    });

    const adminWalletLedgers =
        ledgerRows.length > 0
            ? await prisma.adminWalletLedger.createMany({
                  data: ledgerRows,
              })
            : { count: 0 };

    const sellerSettlements =
        settlementRows.length > 0
            ? await prisma.sellerSettlement.createMany({
                  data: settlementRows,
              })
            : { count: 0 };

    for (const [walletId, creditedCents] of creditedByWalletId.entries()) {
        await prisma.sellerWallet.update({
            where: {
                id: walletId,
            },
            data: {
                availableBalance: formatCents(creditedCents),
                pendingBalance: "0.00",
                totalCredited: formatCents(creditedCents),
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
        sellerWallets: sellerWallets.count,
        sellerSettlements: sellerSettlements.count,
    };
}
