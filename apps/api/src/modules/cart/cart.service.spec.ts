import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import type { CartRepository } from './cart.repository';

jest.mock('./cart.repository', () => ({
  CartRepository: class CartRepository {},
}));

type MockedCartRepository = jest.Mocked<CartRepository>;

function createRepositoryMock(): MockedCartRepository {
  return {
    findCartByUserId: jest.fn(),
    createCart: jest.fn(),
    findVariantById: jest.fn(),
    findCartItemByCartAndVariant: jest.fn(),
    createCartItem: jest.fn(),
    updateCartItemQuantity: jest.fn(),
    findCartItemByIdForUser: jest.fn(),
    deleteCartItemById: jest.fn(),
    deleteCartItemsByCartId: jest.fn(),
    runInTransaction: jest.fn(),
  } as unknown as MockedCartRepository;
}

describe('CartService', () => {
  let service: CartService;
  let repository: MockedCartRepository;

  beforeEach(() => {
    repository = createRepositoryMock();
    repository.runInTransaction.mockImplementation(async (operation) =>
      operation({} as never),
    );
    service = new CartService(repository);
  });

  it('should return empty cart summary for first time customer', async () => {
    const createdAt = new Date('2026-03-29T10:00:00.000Z');
    const cart = {
      id: 'cart-1',
      userId: 'user-1',
      createdAt,
      updatedAt: createdAt,
      items: [],
    };

    repository.findCartByUserId.mockResolvedValueOnce(null);
    repository.createCart.mockResolvedValueOnce(cart as never);

    const result = await service.getMyCart('user-1');

    expect(result.subtotal).toBe('0.00');
    expect(result.totalItems).toBe(0);
    expect(result.items).toHaveLength(0);
  });

  it('should add an item and calculate subtotal correctly', async () => {
    const createdAt = new Date('2026-03-29T10:00:00.000Z');
    const cartBase = {
      id: 'cart-1',
      userId: 'user-1',
      createdAt,
      updatedAt: createdAt,
      items: [],
    };

    const variant = {
      id: 'variant-1',
      productId: 'product-1',
      sku: 'SKU-1',
      price: '99.50',
      stockQuantity: 10,
      product: {
        name: 'Product A',
      },
    };

    const cartWithItem = {
      ...cartBase,
      items: [
        {
          id: 'item-1',
          cartId: 'cart-1',
          variantId: 'variant-1',
          quantity: 2,
          createdAt,
          updatedAt: createdAt,
          variant,
        },
      ],
    };

    repository.findVariantById.mockResolvedValue(variant as never);
    repository.findCartByUserId
      .mockResolvedValueOnce(cartBase as never)
      .mockResolvedValueOnce(cartWithItem as never);
    repository.findCartItemByCartAndVariant.mockResolvedValueOnce(null);
    repository.createCartItem.mockResolvedValueOnce({
      id: 'item-1',
      cartId: 'cart-1',
      variantId: 'variant-1',
      quantity: 2,
    } as never);

    const result = await service.addItem('user-1', {
      variantId: 'variant-1',
      quantity: 2,
    });

    expect(result.totalItems).toBe(2);
    expect(result.subtotal).toBe('199.00');
    expect(result.items[0]?.lineTotal).toBe('199.00');
  });

  it('should reject add item when quantity exceeds stock', async () => {
    const cartBase = {
      id: 'cart-1',
      userId: 'user-1',
      createdAt: new Date('2026-03-29T10:00:00.000Z'),
      updatedAt: new Date('2026-03-29T10:00:00.000Z'),
      items: [],
    };

    repository.findVariantById.mockResolvedValue({
      id: 'variant-1',
      productId: 'product-1',
      sku: 'SKU-1',
      price: '10.00',
      stockQuantity: 1,
      product: {
        name: 'Product A',
      },
    } as never);
    repository.findCartByUserId.mockResolvedValueOnce(cartBase as never);
    repository.findCartItemByCartAndVariant.mockResolvedValueOnce(null);

    await expect(
      service.addItem('user-1', {
        variantId: 'variant-1',
        quantity: 2,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should remove item when update quantity to zero', async () => {
    const createdAt = new Date('2026-03-29T10:00:00.000Z');

    repository.findCartItemByIdForUser.mockResolvedValueOnce({
      id: 'item-1',
      cartId: 'cart-1',
      variantId: 'variant-1',
      quantity: 2,
    } as never);
    repository.deleteCartItemById.mockResolvedValueOnce({
      id: 'item-1',
      cartId: 'cart-1',
      variantId: 'variant-1',
      quantity: 2,
    } as never);
    repository.findCartByUserId.mockResolvedValueOnce({
      id: 'cart-1',
      userId: 'user-1',
      createdAt,
      updatedAt: createdAt,
      items: [],
    } as never);

    const result = await service.updateItemQuantity('user-1', 'item-1', {
      quantity: 0,
    });

    expect(repository.deleteCartItemById.mock.calls).toHaveLength(1);
    expect(repository.deleteCartItemById.mock.calls[0]?.[0]).toBe('item-1');
    expect(result.totalItems).toBe(0);
  });

  it('should throw not found when removing unknown item', async () => {
    repository.findCartItemByIdForUser.mockResolvedValueOnce(null);

    await expect(service.removeItem('user-1', 'item-x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
