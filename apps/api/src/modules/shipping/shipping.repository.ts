import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import type { OrderStatus } from '@repo/shared-types';
import { PrismaService } from '../../infrastructure/database/prisma.service';

const SHIPPING_ORDER_SELECT = {
  id: true,
  orderNumber: true,
  shopId: true,
  status: true,
  shippedAt: true,
  settlementStatus: true,
} satisfies Prisma.OrderSelect;

export type ShippingOrderRecord = Prisma.OrderGetPayload<{
  select: typeof SHIPPING_ORDER_SELECT;
}>;

@Injectable()
export class ShippingRepository {
  constructor(private readonly prisma: PrismaService) {}

  countOverdueShippedOrders(
    shippedBeforeOrAt: Date,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.count({
      where: {
        status: 'SHIPPED',
        shippedAt: {
          lte: shippedBeforeOrAt,
        },
        deliveredAt: null,
        settlementStatus: 'PENDING',
      },
    });
  }

  findAutoDeliverableOrders(
    shippedBeforeOrAt: Date,
    limit: number,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.findMany({
      where: {
        status: 'SHIPPED',
        shippedAt: {
          lte: shippedBeforeOrAt,
        },
        deliveredAt: null,
        settlementStatus: 'PENDING',
        paymentOrders: {
          some: {
            payment: {
              status: 'SUCCESS',
            },
          },
        },
      },
      orderBy: {
        shippedAt: 'asc',
      },
      take: limit,
      select: SHIPPING_ORDER_SELECT,
    });
  }

  markOrdersAsDelivered(
    orderIds: string[],
    deliveredAt: Date,
    tx?: Prisma.TransactionClient,
  ) {
    if (orderIds.length === 0) {
      return Promise.resolve({ count: 0 });
    }

    const client = tx ?? this.prisma;

    return client.order.updateMany({
      where: {
        id: {
          in: orderIds,
        },
        status: 'SHIPPED',
        deliveredAt: null,
      },
      data: {
        status: 'DELIVERED',
        deliveredAt,
      },
    });
  }

  markOrdersAsSettled(
    orderIds: string[],
    settledAt: Date,
    tx?: Prisma.TransactionClient,
  ) {
    if (orderIds.length === 0) {
      return Promise.resolve({ count: 0 });
    }

    const client = tx ?? this.prisma;

    return client.order.updateMany({
      where: {
        id: {
          in: orderIds,
        },
        settlementStatus: 'PENDING',
        status: 'DELIVERED',
        settledAt: null,
      },
      data: {
        settlementStatus: 'SETTLED',
        settledAt,
      },
    });
  }

  runInTransaction<T>(
    operation: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction((tx) => operation(tx));
  }

  countSellerOrdersByStatuses(
    sellerUserId: string,
    statuses: OrderStatus[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.count({
      where: {
        shop: {
          userId: sellerUserId,
        },
        status: {
          in: statuses,
        },
      },
    });
  }
}
