import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import type { ProductStatus } from '@repo/shared-types';
import { PrismaService } from '../../infrastructure/database/prisma.service';

const CATEGORY_SELECT = {
  id: true,
  parentId: true,
  name: true,
  slug: true,
  imageKey: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CategorySelect;

const PRODUCT_VARIANT_SELECT = {
  id: true,
  productId: true,
  sku: true,
  attributes: true,
  price: true,
  imageKey: true,
  stockQuantity: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProductVariantSelect;

const PRODUCT_SELECT = {
  id: true,
  shopId: true,
  categoryId: true,
  name: true,
  description: true,
  imageKey: true,
  omnichannelSyncStatus: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  variants: {
    orderBy: { createdAt: 'asc' },
    select: PRODUCT_VARIANT_SELECT,
  },
} satisfies Prisma.ProductSelect;

const SELLER_SHOP_SELECT = {
  id: true,
  userId: true,
} satisfies Prisma.ShopSelect;

export type CategoryRecord = Prisma.CategoryGetPayload<{
  select: typeof CATEGORY_SELECT;
}>;

export type ProductRecord = Prisma.ProductGetPayload<{
  select: typeof PRODUCT_SELECT;
}>;

export type ProductVariantRecord = Prisma.ProductVariantGetPayload<{
  select: typeof PRODUCT_VARIANT_SELECT;
}>;

export interface CategoriesQueryInput {
  page: number;
  limit: number;
  parentId?: string;
  search?: string;
}

export interface ProductsQueryInput {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  shopId?: string;
  status?: ProductStatus;
}

@Injectable()
export class CatalogRepository {
  constructor(private readonly prisma: PrismaService) {}

  findCategories(input: CategoriesQueryInput) {
    return this.prisma.category.findMany({
      where: this.buildCategoriesWhere(input),
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      orderBy: [{ parentId: 'asc' }, { name: 'asc' }],
      select: CATEGORY_SELECT,
    });
  }

  countCategories(input: CategoriesQueryInput) {
    return this.prisma.category.count({
      where: this.buildCategoriesWhere(input),
    });
  }

  findCategoryById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      select: CATEGORY_SELECT,
    });
  }

  findCategoryBySlug(slug: string) {
    return this.prisma.category.findUnique({
      where: { slug },
      select: CATEGORY_SELECT,
    });
  }

  findPublicProducts(input: ProductsQueryInput) {
    return this.prisma.product.findMany({
      where: this.buildProductsWhere({
        ...input,
        status: 'ACTIVE',
      }),
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      orderBy: { createdAt: 'desc' },
      select: PRODUCT_SELECT,
    });
  }

  countPublicProducts(input: ProductsQueryInput) {
    return this.prisma.product.count({
      where: this.buildProductsWhere({
        ...input,
        status: 'ACTIVE',
      }),
    });
  }

  findPublicProductById(productId: string) {
    return this.prisma.product.findFirst({
      where: {
        id: productId,
        status: 'ACTIVE',
      },
      select: PRODUCT_SELECT,
    });
  }

  findSellerProducts(userId: string, input: ProductsQueryInput) {
    return this.prisma.product.findMany({
      where: {
        ...this.buildProductsWhere(input),
        shop: {
          userId,
        },
      },
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      orderBy: { createdAt: 'desc' },
      select: PRODUCT_SELECT,
    });
  }

  countSellerProducts(userId: string, input: ProductsQueryInput) {
    return this.prisma.product.count({
      where: {
        ...this.buildProductsWhere(input),
        shop: {
          userId,
        },
      },
    });
  }

  findProductById(productId: string) {
    return this.prisma.product.findUnique({
      where: { id: productId },
      select: PRODUCT_SELECT,
    });
  }

  findProductByIdForSeller(userId: string, productId: string) {
    return this.prisma.product.findFirst({
      where: {
        id: productId,
        shop: {
          userId,
        },
      },
      select: PRODUCT_SELECT,
    });
  }

  createProduct(data: Prisma.ProductUncheckedCreateInput) {
    return this.prisma.product.create({
      data,
      select: PRODUCT_SELECT,
    });
  }

  updateProductById(productId: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id: productId },
      data,
      select: PRODUCT_SELECT,
    });
  }

  findShopByUserId(userId: string) {
    return this.prisma.shop.findUnique({
      where: { userId },
      select: SELLER_SHOP_SELECT,
    });
  }

  createVariant(data: Prisma.ProductVariantUncheckedCreateInput) {
    return this.prisma.productVariant.create({
      data,
      select: PRODUCT_VARIANT_SELECT,
    });
  }

  findVariantById(variantId: string) {
    return this.prisma.productVariant.findUnique({
      where: { id: variantId },
      select: PRODUCT_VARIANT_SELECT,
    });
  }

  findVariantByIdForSeller(userId: string, variantId: string) {
    return this.prisma.productVariant.findFirst({
      where: {
        id: variantId,
        product: {
          shop: {
            userId,
          },
        },
      },
      select: PRODUCT_VARIANT_SELECT,
    });
  }

  updateVariantById(
    variantId: string,
    data: Prisma.ProductVariantUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.productVariant.update({
      where: { id: variantId },
      data,
      select: PRODUCT_VARIANT_SELECT,
    });
  }

  findAdminProducts(input: ProductsQueryInput) {
    return this.prisma.product.findMany({
      where: this.buildProductsWhere(input),
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      orderBy: { createdAt: 'desc' },
      select: PRODUCT_SELECT,
    });
  }

  countAdminProducts(input: ProductsQueryInput) {
    return this.prisma.product.count({
      where: this.buildProductsWhere(input),
    });
  }

  private buildCategoriesWhere(
    input: CategoriesQueryInput,
  ): Prisma.CategoryWhereInput {
    const where: Prisma.CategoryWhereInput = {};

    if (input.parentId) {
      where.parentId = input.parentId;
    }

    if (input.search) {
      where.OR = [
        {
          name: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
        {
          slug: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    return where;
  }

  private buildProductsWhere(
    input: ProductsQueryInput,
  ): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};

    if (input.status) {
      where.status = input.status;
    }

    if (input.categoryId) {
      where.categoryId = input.categoryId;
    }

    if (input.shopId) {
      where.shopId = input.shopId;
    }

    if (input.search) {
      where.OR = [
        {
          name: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    return where;
  }
}
