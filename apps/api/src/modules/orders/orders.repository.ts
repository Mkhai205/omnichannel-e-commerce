import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import type { OrderStatus } from '@repo/shared-types';
import { PrismaService } from '../../infrastructure/database/prisma.service';

const CHECKOUT_CART_ITEM_SELECT = {
  id: true,
  cartId: true,
  variantId: true,
  quantity: true,
  variant: {
    select: {
      id: true,
      productId: true,
      sku: true,
      price: true,
      imageKey: true,
      product: {
        select: {
          name: true,
          shopId: true,
          imageKey: true,
        },
      },
    },
  },
} satisfies Prisma.CartItemSelect;

const ADDRESS_SELECT = {
  id: true,
  userId: true,
} satisfies Prisma.AddressSelect;

const ORDER_SELECT = {
  id: true,
  orderNumber: true,
  userId: true,
  shopId: true,
  shippingAddressId: true,
  status: true,
  subtotal: true,
  totalAmount: true,
  note: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.OrderSelect;

const SELLER_ORDER_SELECT = {
  id: true,
  orderNumber: true,
  userId: true,
  shopId: true,
  shippingAddressId: true,
  status: true,
  shippedAt: true,
  deliveredAt: true,
  settlementStatus: true,
  settledAt: true,
  subtotal: true,
  totalAmount: true,
  note: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.OrderSelect;

const ORDER_ITEM_SELECT = {
  id: true,
  orderId: true,
  variantId: true,
  quantity: true,
  unitPrice: true,
  lineTotal: true,
  createdAt: true,
  updatedAt: true,
  variant: {
    select: {
      productId: true,
      sku: true,
      imageKey: true,
      product: {
        select: {
          name: true,
          imageKey: true,
        },
      },
    },
  },
} satisfies Prisma.OrderItemSelect;

const SELLER_ORDER_DETAIL_SELECT = {
  ...SELLER_ORDER_SELECT,
  items: {
    select: ORDER_ITEM_SELECT,
  },
} satisfies Prisma.OrderSelect;

export type CheckoutCartItemRecord = Prisma.CartItemGetPayload<{
  select: typeof CHECKOUT_CART_ITEM_SELECT;
}>;

export type OrderRecord = Prisma.OrderGetPayload<{
  select: typeof ORDER_SELECT;
}>;

export type SellerOrderRecord = Prisma.OrderGetPayload<{
  select: typeof SELLER_ORDER_SELECT;
}>;

export type SellerOrderDetailRecord = Prisma.OrderGetPayload<{
  select: typeof SELLER_ORDER_DETAIL_SELECT;
}>;

export type OrderItemRecord = Prisma.OrderItemGetPayload<{
  select: typeof ORDER_ITEM_SELECT;
}>;

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findSellerOrdersByUserId(
    sellerUserId: string,
    input: {
      page: number;
      limit: number;
      status?: OrderStatus;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.findMany({
      where: {
        shop: {
          userId: sellerUserId,
        },
        ...(input.status ? { status: input.status } : {}),
      },
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: SELLER_ORDER_SELECT,
    });
  }

  countSellerOrdersByUserId(
    sellerUserId: string,
    status?: OrderStatus,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.count({
      where: {
        shop: {
          userId: sellerUserId,
        },
        ...(status ? { status } : {}),
      },
    });
  }

  findSellerOrderByIdForUser(
    sellerUserId: string,
    orderId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.findFirst({
      where: {
        id: orderId,
        shop: {
          userId: sellerUserId,
        },
      },
      select: SELLER_ORDER_SELECT,
    });
  }

  findSellerOrderDetailByIdForUser(
    sellerUserId: string,
    orderId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.findFirst({
      where: {
        id: orderId,
        shop: {
          userId: sellerUserId,
        },
      },
      select: SELLER_ORDER_DETAIL_SELECT,
    });
  }

  updateOrderById(
    orderId: string,
    data: Prisma.OrderUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.update({
      where: {
        id: orderId,
      },
      data,
      select: SELLER_ORDER_SELECT,
    });
  }

  findAddressByIdForUser(
    addressId: string,
    userId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
      select: ADDRESS_SELECT,
    });
  }

  findCheckoutCartItemsByIdsForUser(
    userId: string,
    cartItemIds: string[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.cartItem.findMany({
      where: {
        id: {
          in: cartItemIds,
        },
        cart: {
          userId,
        },
      },
      select: CHECKOUT_CART_ITEM_SELECT,
    });
  }

  createOrder(
    data: Prisma.OrderUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.create({
      data,
      select: ORDER_SELECT,
    });
  }

  createOrderItem(
    data: Prisma.OrderItemUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.orderItem.create({
      data,
      select: ORDER_ITEM_SELECT,
    });
  }

  deleteCheckoutCartItemsForUser(
    userId: string,
    cartItemIds: string[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.cartItem.deleteMany({
      where: {
        id: {
          in: cartItemIds,
        },
        cart: {
          userId,
        },
      },
    });
  }

  runInTransaction<T>(
    operation: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction((tx) => operation(tx));
  }
}
