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
  user: {
    select: {
      fullName: true,
    },
  },
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

const CUSTOMER_ORDER_SELECT = {
  id: true,
  orderNumber: true,
  userId: true,
  shopId: true,
  shippingAddressId: true,
  status: true,
  shippedAt: true,
  deliveredAt: true,
  subtotal: true,
  totalAmount: true,
  note: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      items: true,
    },
  },
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
  user: {
    select: {
      fullName: true,
      phone: true,
      email: true,
    },
  },
  shippingAddress: {
    select: {
      id: true,
      recipientName: true,
      recipientPhone: true,
      streetAddress: true,
      wardDistrict: true,
      city: true,
      state: true,
      postalCode: true,
      country: true,
    },
  },
  items: {
    select: ORDER_ITEM_SELECT,
  },
} satisfies Prisma.OrderSelect;

const CUSTOMER_ORDER_DETAIL_SELECT = {
  ...CUSTOMER_ORDER_SELECT,
  shop: {
    select: {
      shopName: true,
    },
  },
  shippingAddress: {
    select: {
      id: true,
      recipientName: true,
      recipientPhone: true,
      streetAddress: true,
      wardDistrict: true,
      city: true,
      state: true,
      postalCode: true,
      country: true,
    },
  },
  items: {
    select: ORDER_ITEM_SELECT,
  },
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
          paidAt: true,
          updatedAt: true,
        },
      },
    },
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

export type CustomerOrderRecord = Prisma.OrderGetPayload<{
  select: typeof CUSTOMER_ORDER_SELECT;
}>;

export type CustomerOrderDetailRecord = Prisma.OrderGetPayload<{
  select: typeof CUSTOMER_ORDER_DETAIL_SELECT;
}>;

export type OrderItemRecord = Prisma.OrderItemGetPayload<{
  select: typeof ORDER_ITEM_SELECT;
}>;

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findCustomerOrdersByUserId(
    userId: string,
    input: {
      page: number;
      limit: number;
      status?: OrderStatus;
      search?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.findMany({
      where: this.buildCustomerOrdersWhere(userId, input),
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: CUSTOMER_ORDER_SELECT,
    });
  }

  countCustomerOrdersByUserId(
    userId: string,
    input: {
      status?: OrderStatus;
      search?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.count({
      where: this.buildCustomerOrdersWhere(userId, input),
    });
  }

  findCustomerOrderDetailByIdForUser(
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
      select: CUSTOMER_ORDER_DETAIL_SELECT,
    });
  }

  findSellerOrdersByUserId(
    sellerUserId: string,
    input: {
      page: number;
      limit: number;
      status?: OrderStatus;
      search?: string;
      placedFrom?: Date;
      placedToExclusive?: Date;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.findMany({
      where: this.buildSellerOrdersWhere(sellerUserId, input),
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
    input: {
      status?: OrderStatus;
      search?: string;
      placedFrom?: Date;
      placedToExclusive?: Date;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.order.count({
      where: this.buildSellerOrdersWhere(sellerUserId, input),
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

  deductVariantStockIfAvailable(
    variantId: string,
    quantity: number,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.productVariant.updateMany({
      where: {
        id: variantId,
        stockQuantity: {
          gte: quantity,
        },
      },
      data: {
        stockQuantity: {
          decrement: quantity,
        },
      },
    });
  }

  private buildSellerOrdersWhere(
    sellerUserId: string,
    input: {
      status?: OrderStatus;
      search?: string;
      placedFrom?: Date;
      placedToExclusive?: Date;
    },
  ): Prisma.OrderWhereInput {
    const where: Prisma.OrderWhereInput = {
      shop: {
        userId: sellerUserId,
      },
      ...(input.status ? { status: input.status } : {}),
    };

    if (input.search) {
      where.OR = [
        {
          orderNumber: {
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
      ];
    }

    if (input.placedFrom || input.placedToExclusive) {
      where.createdAt = {
        ...(input.placedFrom ? { gte: input.placedFrom } : {}),
        ...(input.placedToExclusive ? { lt: input.placedToExclusive } : {}),
      };
    }

    return where;
  }

  private buildCustomerOrdersWhere(
    userId: string,
    input: {
      status?: OrderStatus;
      search?: string;
    },
  ): Prisma.OrderWhereInput {
    const where: Prisma.OrderWhereInput = {
      userId,
      ...(input.status ? { status: input.status } : {}),
    };

    if (input.search) {
      where.orderNumber = {
        contains: input.search,
        mode: 'insensitive',
      };
    }

    return where;
  }
}
