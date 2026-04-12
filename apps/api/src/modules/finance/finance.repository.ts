import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import type {
  PaymentProvider,
  PaymentStatus,
  SellerPaymentFilterStatus,
  SellerSettlementStatus,
} from '@repo/shared-types';
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

const ADMIN_PAYMENT_SELECT = {
  id: true,
  userId: true,
  provider: true,
  status: true,
  txnRef: true,
  gatewayTransactionNo: true,
  amount: true,
  currency: true,
  bankCode: true,
  paidAt: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      fullName: true,
      email: true,
    },
  },
  orders: {
    select: {
      orderId: true,
    },
  },
} satisfies Prisma.PaymentSelect;

const ADMIN_SETTLEMENT_SELECT = {
  id: true,
  orderId: true,
  shopId: true,
  sellerWalletId: true,
  status: true,
  grossAmount: true,
  commissionAmount: true,
  netAmount: true,
  settledAt: true,
  createdAt: true,
  updatedAt: true,
  order: {
    select: {
      orderNumber: true,
    },
  },
  shop: {
    select: {
      shopName: true,
      user: {
        select: {
          fullName: true,
        },
      },
    },
  },
} satisfies Prisma.SellerSettlementSelect;

const KPI_TREND_ORDER_SELECT = {
  createdAt: true,
  totalAmount: true,
} satisfies Prisma.OrderSelect;

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

export type AdminPaymentRecord = Prisma.PaymentGetPayload<{
  select: typeof ADMIN_PAYMENT_SELECT;
}>;

export type AdminSettlementRecord = Prisma.SellerSettlementGetPayload<{
  select: typeof ADMIN_SETTLEMENT_SELECT;
}>;

export type KpiTrendOrderRecord = Prisma.OrderGetPayload<{
  select: typeof KPI_TREND_ORDER_SELECT;
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

  findAdminPayments(
    input: {
      page: number;
      limit: number;
      status?: PaymentStatus;
      provider?: PaymentProvider;
      search?: string;
      createdFrom?: Date;
      createdToExclusive?: Date;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.payment.findMany({
      where: this.buildAdminPaymentsWhere(input),
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: ADMIN_PAYMENT_SELECT,
    });
  }

  countAdminPayments(
    input: {
      status?: PaymentStatus;
      provider?: PaymentProvider;
      search?: string;
      createdFrom?: Date;
      createdToExclusive?: Date;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.payment.count({
      where: this.buildAdminPaymentsWhere(input),
    });
  }

  findAdminSettlements(
    input: {
      page: number;
      limit: number;
      status?: SellerSettlementStatus;
      search?: string;
      settledFrom?: Date;
      settledToExclusive?: Date;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.sellerSettlement.findMany({
      where: this.buildAdminSettlementsWhere(input),
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      orderBy: {
        settledAt: 'desc',
      },
      select: ADMIN_SETTLEMENT_SELECT,
    });
  }

  countAdminSettlements(
    input: {
      status?: SellerSettlementStatus;
      search?: string;
      settledFrom?: Date;
      settledToExclusive?: Date;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.sellerSettlement.count({
      where: this.buildAdminSettlementsWhere(input),
    });
  }

  countTotalUsers(tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.user.count();
  }

  countTotalShops(tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.shop.count();
  }

  countPendingShops(tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.shop.count({
      where: {
        status: 'PENDING',
      },
    });
  }

  countTotalOrders(tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.order.count();
  }

  countOrdersCreatedAfterOrAt(
    createdAfterOrAt: Date,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.count({
      where: {
        createdAt: {
          gte: createdAfterOrAt,
        },
      },
    });
  }

  aggregateGrossMerchandiseValue(tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.order.aggregate({
      where: {
        status: {
          in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
        },
      },
      _sum: {
        totalAmount: true,
      },
    });
  }

  countTotalPayments(tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.payment.count();
  }

  countSuccessfulPayments(tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.payment.count({
      where: {
        status: 'SUCCESS',
      },
    });
  }

  countPendingPayments(tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.payment.count({
      where: {
        status: 'PENDING',
      },
    });
  }

  countPendingSettlements(tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.order.count({
      where: {
        status: 'DELIVERED',
        settlementStatus: 'PENDING',
      },
    });
  }

  findKpiTrendOrders(createdAfterOrAt: Date, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.order.findMany({
      where: {
        createdAt: {
          gte: createdAfterOrAt,
        },
        status: {
          in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: KPI_TREND_ORDER_SELECT,
    });
  }

  private buildAdminPaymentsWhere(input: {
    status?: PaymentStatus;
    provider?: PaymentProvider;
    search?: string;
    createdFrom?: Date;
    createdToExclusive?: Date;
  }): Prisma.PaymentWhereInput {
    const where: Prisma.PaymentWhereInput = {
      ...(input.status ? { status: input.status } : {}),
      ...(input.provider ? { provider: input.provider } : {}),
    };

    if (input.search) {
      where.OR = [
        {
          txnRef: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
        {
          gatewayTransactionNo: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
        {
          user: {
            fullName: {
              contains: input.search,
              mode: 'insensitive',
            },
          },
        },
        {
          user: {
            email: {
              contains: input.search,
              mode: 'insensitive',
            },
          },
        },
        {
          orders: {
            some: {
              order: {
                orderNumber: {
                  contains: input.search,
                  mode: 'insensitive',
                },
              },
            },
          },
        },
      ];
    }

    if (input.createdFrom || input.createdToExclusive) {
      where.createdAt = {
        ...(input.createdFrom ? { gte: input.createdFrom } : {}),
        ...(input.createdToExclusive ? { lt: input.createdToExclusive } : {}),
      };
    }

    return where;
  }

  private buildAdminSettlementsWhere(input: {
    status?: SellerSettlementStatus;
    search?: string;
    settledFrom?: Date;
    settledToExclusive?: Date;
  }): Prisma.SellerSettlementWhereInput {
    const where: Prisma.SellerSettlementWhereInput = {
      ...(input.status ? { status: input.status } : {}),
    };

    if (input.search) {
      where.OR = [
        {
          order: {
            orderNumber: {
              contains: input.search,
              mode: 'insensitive',
            },
          },
        },
        {
          shop: {
            shopName: {
              contains: input.search,
              mode: 'insensitive',
            },
          },
        },
        {
          shop: {
            user: {
              fullName: {
                contains: input.search,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    if (input.settledFrom || input.settledToExclusive) {
      where.settledAt = {
        ...(input.settledFrom ? { gte: input.settledFrom } : {}),
        ...(input.settledToExclusive ? { lt: input.settledToExclusive } : {}),
      };
    }

    return where;
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
