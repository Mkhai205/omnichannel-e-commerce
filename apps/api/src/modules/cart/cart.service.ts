import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@repo/database';
import type {
  AddToCartRequest,
  CartItem,
  CartSummary,
  UpdateCartItemRequest,
} from '@repo/shared-types';
import { resolveCatalogImageUrl } from '../../core/http/catalog-image-url.helper';
import { StorageService } from '../../infrastructure/storage/storage.service';
import type {
  CartItemRecord,
  CartRecord,
  CartVariantRecord,
} from './cart.repository';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly storageService: StorageService,
  ) {}

  async getMyCart(userId: string): Promise<CartSummary> {
    const cart = await this.getOrCreateCartByUserId(userId);

    return this.toCartSummary(cart);
  }

  async addItem(
    userId: string,
    payload: AddToCartRequest,
  ): Promise<CartSummary> {
    const quantity = payload.quantity;

    if (quantity < 1) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    await this.cartRepository.runInTransaction(async (tx) => {
      const variant = await this.cartRepository.findVariantById(
        payload.variantId,
        tx,
      );

      if (!variant) {
        throw new NotFoundException('Product variant not found');
      }

      const cart = await this.getOrCreateCartByUserId(userId, tx);
      const existingItem =
        await this.cartRepository.findCartItemByCartAndVariant(
          cart.id,
          payload.variantId,
          tx,
        );

      const nextQuantity = (existingItem?.quantity ?? 0) + quantity;
      this.ensureStock(variant, nextQuantity);

      if (existingItem) {
        await this.cartRepository.updateCartItemQuantity(
          existingItem.id,
          nextQuantity,
          tx,
        );
      } else {
        await this.cartRepository.createCartItem(
          {
            cartId: cart.id,
            variantId: payload.variantId,
            quantity,
          },
          tx,
        );
      }
    });

    const cart = await this.getOrCreateCartByUserId(userId);

    return this.toCartSummary(cart);
  }

  async updateItemQuantity(
    userId: string,
    itemId: string,
    payload: UpdateCartItemRequest,
  ): Promise<CartSummary> {
    if (payload.quantity < 0) {
      throw new BadRequestException(
        'Quantity must be greater than or equal to 0',
      );
    }

    await this.cartRepository.runInTransaction(async (tx) => {
      const item = await this.cartRepository.findCartItemByIdForUser(
        itemId,
        userId,
        tx,
      );

      if (!item) {
        throw new NotFoundException('Cart item not found');
      }

      if (payload.quantity === 0) {
        await this.cartRepository.deleteCartItemById(item.id, tx);

        return;
      }

      const variant = await this.cartRepository.findVariantById(
        item.variantId,
        tx,
      );

      if (!variant) {
        throw new NotFoundException('Product variant not found');
      }

      this.ensureStock(variant, payload.quantity);
      await this.cartRepository.updateCartItemQuantity(
        item.id,
        payload.quantity,
        tx,
      );
    });

    const cart = await this.getOrCreateCartByUserId(userId);

    return this.toCartSummary(cart);
  }

  async removeItem(userId: string, itemId: string): Promise<CartSummary> {
    await this.cartRepository.runInTransaction(async (tx) => {
      const item = await this.cartRepository.findCartItemByIdForUser(
        itemId,
        userId,
        tx,
      );

      if (!item) {
        throw new NotFoundException('Cart item not found');
      }

      await this.cartRepository.deleteCartItemById(item.id, tx);
    });

    const cart = await this.getOrCreateCartByUserId(userId);

    return this.toCartSummary(cart);
  }

  async clearCart(userId: string): Promise<{ success: boolean }> {
    const cart = await this.cartRepository.findCartByUserId(userId);

    if (!cart) {
      return { success: true };
    }

    await this.cartRepository.deleteCartItemsByCartId(cart.id);

    return { success: true };
  }

  private async getOrCreateCartByUserId(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<CartRecord> {
    const existingCart = await this.cartRepository.findCartByUserId(userId, tx);

    if (existingCart) {
      return existingCart;
    }

    return this.cartRepository.createCart(userId, tx);
  }

  private ensureStock(variant: CartVariantRecord, quantity: number): void {
    if (variant.stockQuantity <= 0) {
      throw new BadRequestException('Product variant is out of stock');
    }

    if (quantity > variant.stockQuantity) {
      throw new BadRequestException(
        `Requested quantity exceeds stock (${variant.stockQuantity})`,
      );
    }
  }

  private toCartSummary(cart: CartRecord): CartSummary {
    const items = cart.items.map((item) => this.toCartItem(item));
    const subtotalInCents = items.reduce((sum, item) => {
      return sum + this.parseMoneyToCents(item.lineTotal);
    }, 0n);

    return {
      cartId: cart.id,
      userId: cart.userId,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: this.formatCents(subtotalInCents),
      items,
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString(),
    };
  }

  private toCartItem(item: CartItemRecord): CartItem {
    const unitPrice = this.normalizeMoney(item.variant.price.toString());
    const lineTotal = this.formatCents(
      this.parseMoneyToCents(unitPrice) * BigInt(item.quantity),
    );
    const imageKey =
      item.variant.imageKey ?? item.variant.product.imageKey ?? null;

    return {
      id: item.id,
      cartId: item.cartId,
      variantId: item.variantId,
      productId: item.variant.productId,
      productName: item.variant.product.name,
      variantSku: item.variant.sku,
      imageKey,
      imageUrl: resolveCatalogImageUrl(
        this.storageService,
        item.variant.imageKey,
        item.variant.product.imageKey,
      ),
      quantity: item.quantity,
      unitPrice,
      lineTotal,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  private normalizeMoney(value: string): string {
    return this.formatCents(
      this.normalizeToWholeVndCents(this.parseMoneyToCents(value)),
    );
  }

  private normalizeToWholeVndCents(cents: bigint): bigint {
    const remainder = cents % 100n;

    if (remainder === 0n) {
      return cents;
    }

    if (remainder >= 50n) {
      return cents + (100n - remainder);
    }

    return cents - remainder;
  }

  private parseMoneyToCents(value: string): bigint {
    const trimmed = value.trim();

    if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
      throw new BadRequestException('Invalid money value');
    }

    const [whole, fraction = ''] = trimmed.split('.');
    const normalizedFraction = `${fraction}00`.slice(0, 2);

    return BigInt(whole) * 100n + BigInt(normalizedFraction);
  }

  private formatCents(cents: bigint): string {
    const whole = cents / 100n;
    const fraction = (cents % 100n).toString().padStart(2, '0');

    return `${whole.toString()}.${fraction}`;
  }
}
