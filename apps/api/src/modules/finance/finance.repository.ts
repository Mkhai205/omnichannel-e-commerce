import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import type { SellerPaymentFilterStatus } from '@repo/shared-types';
import { PrismaService } from '../../infrastructure/database/prisma.service';

const ADMIN_WALLET_SELECT = {
  id: true,
  code: true,
  escrowBalance: true,
  commissionBalance: true,
  totalInflow: true,
  totalReleasedSeller: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AdminWalletSelect;

const SELLER_WALLET_SELECT = {
  id: true,
  shopId: true,
  availableBalance: true,
  pendingBalance: true,
  totalCredited: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SellerWalletSelect;

const DELIVERED_SETTLED_ORDER_SELECT = {
  id: true,
  shopId: true,
  totalAmount: true,
  status: true,
  settlementStatus: true,
  settledAt: true,
} satisfies Prisma.OrderSelect;

const SELLER_SETTLEMENT_MIN_SELECT = {
  id: true,
  orderId: true,
  status: true,
  createdAt: true,
} satisfies Prisma.SellerSettlementSelect;

const ADMIN_LEDGER_MIN_SELECT = {
  id: true,
  idempotencyKey: true,
  type: true,
  createdAt: true,
} satisfies Prisma.AdminWalletLedgerSelect;

const SELLER_PAYMENT_ORDER_SELECT = {
  id: true,
  orderNumber: true,
  totalAmount: true,
  status: true,
  settlementStatus: true,
  settledAt: true,
  createdAt: true,
  updatedAt: true,
  sellerSettlement: {
    select: {
      id: true,
      grossAmount: true,
      commissionAmount: true,
      netAmount: true,
      status: true,
      settledAt: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.OrderSelect;

const SELLER_SETTLEMENT_CASHFLOW_SELECT = {
  grossAmount: true,
  commissionAmount: true,
  netAmount: true,
  settledAt: true,
} satisfies Prisma.SellerSettlementSelect;

const SHOP_ID_SELECT = {
  id: true,
} satisfies Prisma.ShopSelect;

export type DeliveredSettledOrderRecord = Prisma.OrderGetPayload<{
  select: typeof DELIVERED_SETTLED_ORDER_SELECT;
}>;

export type SellerPaymentOrderRecord = Prisma.OrderGetPayload<{
  select: typeof SELLER_PAYMENT_ORDER_SELECT;
}>;

export type SellerSettlementCashflowRecord = Prisma.SellerSettlementGetPayload<{
  select: typeof SELLER_SETTLEMENT_CASHFLOW_SELECT;
}>;

@Injectable()
export class FinanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  upsertDefaultAdminWallet(tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.adminWallet.upsert({
      where: {
        code: 'DEFAULT',
      },
      create: {
        code: 'DEFAULT',
      },
      update: {},
      select: ADMIN_WALLET_SELECT,
    });
  }

  findAdminLedgerByIdempotencyKey(
    idempotencyKey: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.adminWalletLedger.findUnique({
      where: {
        idempotencyKey,
      },
      select: ADMIN_LEDGER_MIN_SELECT,
    });
  }

  createAdminWalletLedger(
    data: Prisma.AdminWalletLedgerUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.adminWalletLedger.create({
      data,
      select: ADMIN_LEDGER_MIN_SELECT,
    });
  }

  incrementAdminWalletForPaymentInflow(
    adminWalletId: string,
    grossAmount: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.adminWallet.update({
      where: {
        id: adminWalletId,
      },
      data: {
        escrowBalance: {
          increment: grossAmount,
        },
        totalInflow: {
          increment: grossAmount,
        },
      },
      select: ADMIN_WALLET_SELECT,
    });
  }

  incrementAdminWalletForSellerSettlement(
    adminWalletId: string,
    grossAmount: string,
    commissionAmount: string,
    netAmount: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.adminWallet.update({
      where: {
        id: adminWalletId,
      },
      data: {
        escrowBalance: {
          decrement: grossAmount,
        },
        commissionBalance: {
          increment: commissionAmount,
        },
        totalReleasedSeller: {
          increment: netAmount,
        },
      },
      select: ADMIN_WALLET_SELECT,
    });
  }

  findDeliveredSettledOrdersByIds(
    orderIds: string[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.findMany({
      where: {
        id: {
          in: orderIds,
        },
        status: 'DELIVERED',
        settlementStatus: 'SETTLED',
      },
      select: DELIVERED_SETTLED_ORDER_SELECT,
    });
  }

  findSellerSettlementByOrderId(
    orderId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.sellerSettlement.findUnique({
      where: {
        orderId,
      },
      select: SELLER_SETTLEMENT_MIN_SELECT,
    });
  }

  upsertSellerWalletByShopId(shopId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.sellerWallet.upsert({
      where: {
        shopId,
      },
      create: {
        shopId,
      },
      update: {},
      select: SELLER_WALLET_SELECT,
    });
  }

  incrementSellerWalletBalance(
    sellerWalletId: string,
    availableAmount: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.sellerWallet.update({
      where: {
        id: sellerWalletId,
      },
      data: {
        availableBalance: {
          increment: availableAmount,
        },
        totalCredited: {
          increment: availableAmount,
        },
      },
      select: SELLER_WALLET_SELECT,
    });
  }

  createSellerSettlement(
    data: Prisma.SellerSettlementUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.sellerSettlement.create({
      data,
      select: SELLER_SETTLEMENT_MIN_SELECT,
    });
  }

  findSellerShopIdByUserId(userId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.shop.findFirst({
      where: {
        userId,
      },
      select: SHOP_ID_SELECT,
    });
  }

  findSellerWalletByUserId(userId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.sellerWallet.findFirst({
      where: {
        shop: {
          userId,
        },
      },
      select: SELLER_WALLET_SELECT,
    });
  }

  findSellerPaymentOrdersByUserId(
    sellerUserId: string,
    input: {
      page: number;
      limit: number;
      status?: SellerPaymentFilterStatus;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.findMany({
      where: {
        shop: {
          userId: sellerUserId,
        },
        status: {
          in: ['SHIPPED', 'DELIVERED', 'CANCELLED'],
        },
        ...this.toSellerPaymentStatusWhere(input.status),
      },
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      orderBy: [{ settledAt: 'desc' }, { updatedAt: 'desc' }],
      select: SELLER_PAYMENT_ORDER_SELECT,
    });
  }

  countSellerPaymentOrdersByUserId(
    sellerUserId: string,
    status?: SellerPaymentFilterStatus,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.count({
      where: {
        shop: {
          userId: sellerUserId,
        },
        status: {
          in: ['SHIPPED', 'DELIVERED', 'CANCELLED'],
        },
        ...this.toSellerPaymentStatusWhere(status),
      },
    });
  }

  findSellerSettlementsForCashflow(
    sellerUserId: string,
    settledAfterOrAt: Date,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.sellerSettlement.findMany({
      where: {
        shop: {
          userId: sellerUserId,
        },
        status: 'COMPLETED',
        settledAt: {
          gte: settledAfterOrAt,
        },
      },
      orderBy: {
        settledAt: 'asc',
      },
      select: SELLER_SETTLEMENT_CASHFLOW_SELECT,
    });
  }

  aggregateSellerSettlementSummary(
    sellerUserId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.sellerSettlement.aggregate({
      where: {
        shop: {
          userId: sellerUserId,
        },
        status: 'COMPLETED',
      },
      _sum: {
        grossAmount: true,
        commissionAmount: true,
        netAmount: true,
      },
      _count: {
        _all: true,
      },
    });
  }

  private toSellerPaymentStatusWhere(status?: SellerPaymentFilterStatus): {
    settlementStatus?: 'PENDING' | 'SETTLED';
  } {
    if (status === 'settled') {
      return {
        settlementStatus: 'SETTLED',
      };
    }

    if (status === 'pending') {
      return {
        settlementStatus: 'PENDING',
      };
    }

    return {};
  }
}
