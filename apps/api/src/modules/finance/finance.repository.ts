import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
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

export type DeliveredSettledOrderRecord = Prisma.OrderGetPayload<{
  select: typeof DELIVERED_SETTLED_ORDER_SELECT;
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
}
