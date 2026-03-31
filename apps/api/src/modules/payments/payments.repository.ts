import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import { PrismaService } from '../../infrastructure/database/prisma.service';

const ORDER_FOR_PAYMENT_SELECT = {
  id: true,
  userId: true,
  status: true,
  totalAmount: true,
  updatedAt: true,
} satisfies Prisma.OrderSelect;

const PAYMENT_SELECT = {
  id: true,
  userId: true,
  provider: true,
  status: true,
  txnRef: true,
  gatewayTransactionNo: true,
  amount: true,
  currency: true,
  bankCode: true,
  orderInfo: true,
  paidAt: true,
  failedReason: true,
  requestPayload: true,
  responsePayload: true,
  expiresAt: true,
  createdAt: true,
  updatedAt: true,
  orders: {
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      id: true,
      orderId: true,
      createdAt: true,
      order: {
        select: ORDER_FOR_PAYMENT_SELECT,
      },
    },
  },
} satisfies Prisma.PaymentSelect;

const ORDER_WITH_LATEST_PAYMENT_SELECT = {
  id: true,
  status: true,
  shippedAt: true,
  deliveredAt: true,
  settlementStatus: true,
  settledAt: true,
  updatedAt: true,
  paymentOrders: {
    orderBy: {
      createdAt: 'desc',
    },
    take: 1,
    select: {
      payment: {
        select: {
          id: true,
          provider: true,
          status: true,
          txnRef: true,
          amount: true,
          paidAt: true,
          updatedAt: true,
        },
      },
    },
  },
} satisfies Prisma.OrderSelect;

const WEBHOOK_LOG_MIN_SELECT = {
  id: true,
  eventKey: true,
  txnRef: true,
  isVerified: true,
  isSuccess: true,
  responseCode: true,
  createdAt: true,
} satisfies Prisma.PaymentWebhookLogSelect;

export type OrderForPaymentRecord = Prisma.OrderGetPayload<{
  select: typeof ORDER_FOR_PAYMENT_SELECT;
}>;

export type PaymentRecord = Prisma.PaymentGetPayload<{
  select: typeof PAYMENT_SELECT;
}>;

export type OrderWithLatestPaymentRecord = Prisma.OrderGetPayload<{
  select: typeof ORDER_WITH_LATEST_PAYMENT_SELECT;
}>;

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findPendingOrdersByIdsForUser(
    userId: string,
    orderIds: string[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.findMany({
      where: {
        id: {
          in: orderIds,
        },
        userId,
        status: 'PENDING_PAYMENT',
      },
      select: ORDER_FOR_PAYMENT_SELECT,
    });
  }

  findOrderByIdForUserWithLatestPayment(
    userId: string,
    orderId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      select: ORDER_WITH_LATEST_PAYMENT_SELECT,
    });
  }

  createPaymentWithOrders(
    data: Prisma.PaymentUncheckedCreateInput,
    orderIds: string[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.payment.create({
      data: {
        ...data,
        orders: {
          create: orderIds.map((orderId) => ({
            orderId,
          })),
        },
      },
      select: PAYMENT_SELECT,
    });
  }

  findPaymentByTxnRef(txnRef: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.payment.findUnique({
      where: {
        txnRef,
      },
      select: PAYMENT_SELECT,
    });
  }

  updatePaymentById(
    paymentId: string,
    data: Prisma.PaymentUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.payment.update({
      where: {
        id: paymentId,
      },
      data,
      select: PAYMENT_SELECT,
    });
  }

  updateOrdersToPaid(orderIds: string[], tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.order.updateMany({
      where: {
        id: {
          in: orderIds,
        },
        status: 'PENDING_PAYMENT',
      },
      data: {
        status: 'PAID',
      },
    });
  }

  findWebhookLogByEventKey(eventKey: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.paymentWebhookLog.findUnique({
      where: {
        eventKey,
      },
      select: WEBHOOK_LOG_MIN_SELECT,
    });
  }

  createWebhookLog(
    data: Prisma.PaymentWebhookLogUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.paymentWebhookLog.create({
      data,
      select: WEBHOOK_LOG_MIN_SELECT,
    });
  }

  runInTransaction<T>(
    operation: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction((tx) => operation(tx));
  }
}
