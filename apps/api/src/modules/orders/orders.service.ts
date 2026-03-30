import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CheckoutOrder,
  CheckoutOrderItem,
  CheckoutOrdersRequest,
  CheckoutOrdersResponse,
} from '@repo/shared-types';
import {
  SellerInventoryService,
  type CheckoutInventoryDeductionItem,
} from '../inventory/seller-inventory.service';
import { PaymentsService } from '../payments/payments.service';
import {
  type CheckoutCartItemRecord,
  type OrderItemRecord,
  type OrderRecord,
  OrdersRepository,
} from './orders.repository';

interface CheckoutOrderGroup {
  shopId: string;
  items: CheckoutCartItemRecord[];
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly sellerInventoryService: SellerInventoryService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async checkout(
    userId: string,
    payload: CheckoutOrdersRequest,
    clientIp: string,
  ): Promise<CheckoutOrdersResponse> {
    const cartItemIds = [...new Set(payload.cartItemIds)];

    if (cartItemIds.length === 0) {
      throw new BadRequestException('cartItemIds must not be empty');
    }

    return this.ordersRepository.runInTransaction(async (tx) => {
      const shippingAddress =
        await this.ordersRepository.findAddressByIdForUser(
          payload.shippingAddressId,
          userId,
          tx,
        );

      if (!shippingAddress) {
        throw new NotFoundException('Shipping address not found');
      }

      const checkoutItems =
        await this.ordersRepository.findCheckoutCartItemsByIdsForUser(
          userId,
          cartItemIds,
          tx,
        );

      if (checkoutItems.length !== cartItemIds.length) {
        throw new NotFoundException('Some cart items were not found');
      }

      const groupedOrders = this.groupItemsByShop(checkoutItems);
      const inventoryDeductionItems =
        this.toInventoryDeductionItems(checkoutItems);

      await this.sellerInventoryService.deductStockForCheckout(
        inventoryDeductionItems,
        tx,
      );

      const checkoutOrders: CheckoutOrder[] = [];
      let totalCheckoutCents = 0n;

      for (const group of groupedOrders) {
        const subtotalCents = this.calculateGroupSubtotalInCents(group.items);
        const normalizedNote = payload.note?.trim() || null;

        const order = await this.ordersRepository.createOrder(
          {
            orderNumber: this.generateOrderNumber(group.shopId),
            userId,
            shopId: group.shopId,
            shippingAddressId: shippingAddress.id,
            status: 'PENDING_PAYMENT',
            subtotal: this.formatCents(subtotalCents),
            totalAmount: this.formatCents(subtotalCents),
            note: normalizedNote,
          },
          tx,
        );

        const createdItems: CheckoutOrderItem[] = [];

        for (const item of group.items) {
          const unitPrice = this.normalizeMoney(item.variant.price.toString());
          const lineTotal = this.formatCents(
            this.parseMoneyToCents(unitPrice) * BigInt(item.quantity),
          );

          const orderItem = await this.ordersRepository.createOrderItem(
            {
              orderId: order.id,
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice,
              lineTotal,
            },
            tx,
          );

          createdItems.push(this.toCheckoutOrderItem(orderItem));
        }

        totalCheckoutCents += subtotalCents;
        checkoutOrders.push(this.toCheckoutOrder(order, createdItems));
      }

      await this.ordersRepository.deleteCheckoutCartItemsForUser(
        userId,
        cartItemIds,
        tx,
      );

      const payment = await this.paymentsService.createVnpayPaymentUrl(
        userId,
        {
          orderIds: checkoutOrders.map((order) => order.id),
        },
        clientIp,
        tx,
      );

      return {
        orders: checkoutOrders,
        totalCheckoutAmount: this.formatCents(totalCheckoutCents),
        payment,
      };
    });
  }

  private toInventoryDeductionItems(
    items: CheckoutCartItemRecord[],
  ): CheckoutInventoryDeductionItem[] {
    return items.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }));
  }

  private groupItemsByShop(
    items: CheckoutCartItemRecord[],
  ): CheckoutOrderGroup[] {
    const groupedByShop = new Map<string, CheckoutCartItemRecord[]>();

    for (const item of items) {
      const shopId = item.variant.product.shopId;
      const group = groupedByShop.get(shopId) ?? [];

      group.push(item);
      groupedByShop.set(shopId, group);
    }

    return [...groupedByShop.entries()].map(([shopId, groupedItems]) => ({
      shopId,
      items: groupedItems,
    }));
  }

  private calculateGroupSubtotalInCents(
    items: CheckoutCartItemRecord[],
  ): bigint {
    return items.reduce((sum, item) => {
      const unitPrice = this.normalizeMoney(item.variant.price.toString());
      const lineTotal =
        this.parseMoneyToCents(unitPrice) * BigInt(item.quantity);

      return sum + lineTotal;
    }, 0n);
  }

  private toCheckoutOrder(
    order: OrderRecord,
    items: CheckoutOrderItem[],
  ): CheckoutOrder {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      shopId: order.shopId,
      shippingAddressId: order.shippingAddressId,
      status: order.status,
      subtotal: this.normalizeMoney(order.subtotal.toString()),
      totalAmount: this.normalizeMoney(order.totalAmount.toString()),
      note: order.note,
      items,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  private toCheckoutOrderItem(orderItem: OrderItemRecord): CheckoutOrderItem {
    return {
      id: orderItem.id,
      orderId: orderItem.orderId,
      variantId: orderItem.variantId,
      productId: orderItem.variant.productId,
      productName: orderItem.variant.product.name,
      variantSku: orderItem.variant.sku,
      quantity: orderItem.quantity,
      unitPrice: this.normalizeMoney(orderItem.unitPrice.toString()),
      lineTotal: this.normalizeMoney(orderItem.lineTotal.toString()),
      createdAt: orderItem.createdAt.toISOString(),
      updatedAt: orderItem.updatedAt.toISOString(),
    };
  }

  private normalizeMoney(value: string): string {
    return this.formatCents(this.parseMoneyToCents(value));
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

  private generateOrderNumber(shopId: string): string {
    const timestamp = Date.now().toString();
    const shopSuffix = shopId.replace(/-/g, '').slice(-6).toUpperCase();
    const randomPart = Math.random().toString(16).slice(2, 8).toUpperCase();

    return `ORD-${timestamp}-${shopSuffix}${randomPart}`;
  }
}
