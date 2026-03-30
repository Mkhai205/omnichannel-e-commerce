import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
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
      product: {
        select: {
          name: true,
          shopId: true,
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
      product: {
        select: {
          name: true,
        },
      },
    },
  },
} satisfies Prisma.OrderItemSelect;

export type CheckoutCartItemRecord = Prisma.CartItemGetPayload<{
  select: typeof CHECKOUT_CART_ITEM_SELECT;
}>;

export type OrderRecord = Prisma.OrderGetPayload<{
  select: typeof ORDER_SELECT;
}>;

export type OrderItemRecord = Prisma.OrderItemGetPayload<{
  select: typeof ORDER_ITEM_SELECT;
}>;

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

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
