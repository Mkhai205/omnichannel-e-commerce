import { Injectable } from '@nestjs/common';
import type { Prisma } from '@repo/database';
import { PrismaService } from '../../infrastructure/database/prisma.service';

const CART_ITEM_SELECT = {
  id: true,
  cartId: true,
  variantId: true,
  quantity: true,
  createdAt: true,
  updatedAt: true,
  variant: {
    select: {
      id: true,
      productId: true,
      sku: true,
      price: true,
      imageKey: true,
      stockQuantity: true,
      product: {
        select: {
          name: true,
          imageKey: true,
        },
      },
    },
  },
} satisfies Prisma.CartItemSelect;

const CART_SELECT = {
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  items: {
    orderBy: {
      createdAt: 'desc',
    },
    select: CART_ITEM_SELECT,
  },
} satisfies Prisma.CartSelect;

const CART_ITEM_MIN_SELECT = {
  id: true,
  cartId: true,
  variantId: true,
  quantity: true,
} satisfies Prisma.CartItemSelect;

const VARIANT_SELECT = {
  id: true,
  productId: true,
  sku: true,
  price: true,
  imageKey: true,
  stockQuantity: true,
  product: {
    select: {
      name: true,
      imageKey: true,
    },
  },
} satisfies Prisma.ProductVariantSelect;

export type CartRecord = Prisma.CartGetPayload<{
  select: typeof CART_SELECT;
}>;

export type CartItemRecord = Prisma.CartItemGetPayload<{
  select: typeof CART_ITEM_SELECT;
}>;

export type CartItemMinimalRecord = Prisma.CartItemGetPayload<{
  select: typeof CART_ITEM_MIN_SELECT;
}>;

export type CartVariantRecord = Prisma.ProductVariantGetPayload<{
  select: typeof VARIANT_SELECT;
}>;

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  findCartByUserId(userId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.cart.findUnique({
      where: { userId },
      select: CART_SELECT,
    });
  }

  createCart(userId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.cart.create({
      data: { userId },
      select: CART_SELECT,
    });
  }

  findVariantById(variantId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.productVariant.findUnique({
      where: { id: variantId },
      select: VARIANT_SELECT,
    });
  }

  findCartItemByCartAndVariant(
    cartId: string,
    variantId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId,
          variantId,
        },
      },
      select: CART_ITEM_MIN_SELECT,
    });
  }

  createCartItem(
    data: Prisma.CartItemUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.cartItem.create({
      data,
      select: CART_ITEM_MIN_SELECT,
    });
  }

  updateCartItemQuantity(
    itemId: string,
    quantity: number,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      select: CART_ITEM_MIN_SELECT,
    });
  }

  findCartItemByIdForUser(
    itemId: string,
    userId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId,
        },
      },
      select: CART_ITEM_MIN_SELECT,
    });
  }

  deleteCartItemById(itemId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.cartItem.delete({
      where: { id: itemId },
      select: CART_ITEM_MIN_SELECT,
    });
  }

  deleteCartItemsByCartId(cartId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.cartItem.deleteMany({
      where: { cartId },
    });
  }

  runInTransaction<T>(
    operation: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction((tx) => operation(tx));
  }
}
