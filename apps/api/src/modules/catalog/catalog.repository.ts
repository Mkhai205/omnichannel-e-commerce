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
  status: true,
  ratingAverage: true,
  ratingCount: true,
  createdAt: true,
  updatedAt: true,
  variants: {
    orderBy: { createdAt: 'asc' },
    select: PRODUCT_VARIANT_SELECT,
  },
} satisfies Prisma.ProductSelect;

const PRODUCT_REVIEW_SELECT = {
  id: true,
  productId: true,
  userId: true,
  rating: true,
  comment: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProductReviewSelect;

const PRODUCT_SUGGESTION_CANDIDATE_SELECT = {
  id: true,
  categoryId: true,
  createdAt: true,
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

export type ProductSuggestionCandidateRecord = Prisma.ProductGetPayload<{
  select: typeof PRODUCT_SUGGESTION_CANDIDATE_SELECT;
}>;

export type ProductReviewRecord = Prisma.ProductReviewGetPayload<{
  select: typeof PRODUCT_REVIEW_SELECT;
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

type ProductsWhereFilterInput = {
  search?: string;
  categoryId?: string;
  shopId?: string;
  status?: ProductStatus;
};

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

  findPublicProductSuggestionCandidates(
    input: Omit<ProductsQueryInput, 'page' | 'limit'> & {
      take: number;
    },
  ) {
    return this.prisma.product.findMany({
      where: this.buildProductsWhere({
        ...input,
        status: 'ACTIVE',
      }),
      take: input.take,
      orderBy: { createdAt: 'desc' },
      select: PRODUCT_SUGGESTION_CANDIDATE_SELECT,
    });
  }

  async findPublicProductsByIds(productIds: string[]) {
    if (productIds.length === 0) {
      return [];
    }

    return this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
        status: 'ACTIVE',
      },
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

  findActiveProductId(productId: string) {
    return this.prisma.product.findFirst({
      where: {
        id: productId,
        status: 'ACTIVE',
      },
      select: {
        id: true,
      },
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

  deleteProductById(productId: string) {
    return this.prisma.product.delete({
      where: { id: productId },
    });
  }

  deleteVariantById(variantId: string) {
    return this.prisma.productVariant.delete({
      where: { id: variantId },
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

  async upsertProductReviewAndRefreshRating(input: {
    productId: string;
    userId: string;
    rating: number;
    comment?: string | null;
  }): Promise<{
    review: ProductReviewRecord;
    ratingAverage: number;
    ratingCount: number;
  }> {
    return this.prisma.$transaction(async (tx) => {
      const review = await tx.productReview.upsert({
        where: {
          productId_userId: {
            productId: input.productId,
            userId: input.userId,
          },
        },
        create: {
          productId: input.productId,
          userId: input.userId,
          rating: input.rating,
          comment: input.comment,
        },
        update: {
          rating: input.rating,
          comment: input.comment,
        },
        select: PRODUCT_REVIEW_SELECT,
      });

      const aggregate = await tx.productReview.aggregate({
        where: {
          productId: input.productId,
        },
        _avg: {
          rating: true,
        },
        _count: {
          _all: true,
        },
      });

      const averageRating = Number(aggregate._avg.rating ?? 0);
      const normalizedAverageRating = Number.isFinite(averageRating)
        ? Number(averageRating.toFixed(2))
        : 0;
      const ratingCount = aggregate._count._all;

      await tx.product.update({
        where: {
          id: input.productId,
        },
        data: {
          ratingAverage: new Prisma.Decimal(normalizedAverageRating),
          ratingCount,
        },
      });

      return {
        review,
        ratingAverage: normalizedAverageRating,
        ratingCount,
      };
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
    input: ProductsWhereFilterInput,
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
