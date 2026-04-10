import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { Prisma } from '@repo/database';
import type {
  CategoriesListResponse,
  CategoryItem,
  ProductItem,
  ProductReviewListItem,
  ProductReviewItem,
  ProductReviewsFilterRequest,
  ProductReviewsListResponse,
  PublicProductSuggestionsRequest,
  PublicProductSuggestionsResponse,
  ProductVariantItem,
  PublicProductsFilterRequest,
  PublicProductsListResponse,
  UpsertProductReviewRequest,
  UpsertProductReviewResponse,
} from '@repo/shared-types';
import { resolveCatalogImageUrl } from '../../core/http/catalog-image-url.helper';
import { StorageService } from '../../infrastructure/storage/storage.service';
import type {
  CategoryRecord,
  ProductPublicReviewRecord,
  ProductRecord,
  ProductReviewRecord,
  ProductSuggestionCandidateRecord,
  ProductVariantRecord,
} from './catalog.repository';
import { CatalogRepository } from './catalog.repository';

const SUGGESTIONS_CURSOR_VERSION = 1;
const MIN_SUGGESTIONS_POOL_SIZE = 200;
const MAX_SUGGESTIONS_POOL_SIZE = 800;

type SuggestionsCursorPayload = {
  version: number;
  offset: number;
};

@Injectable()
export class PublicCatalogService {
  constructor(
    private readonly catalogRepository: CatalogRepository,
    private readonly storageService: StorageService,
  ) {}

  async getCategories(filters: {
    page?: number;
    limit?: number;
    parentId?: string;
    search?: string;
  }): Promise<CategoriesListResponse> {
    const page = this.resolvePage(filters.page);
    const limit = this.resolveLimit(filters.limit);
    const search = filters.search?.trim();

    const query = {
      page,
      limit,
      parentId: filters.parentId,
      search,
    };

    const [categories, totalItems] = await Promise.all([
      this.catalogRepository.findCategories(query),
      this.catalogRepository.countCategories(query),
    ]);

    return {
      data: categories.map((category) => this.toCategoryItem(category)),
      meta: {
        page,
        limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / limit),
      },
    };
  }

  async getCategoryBySlug(slug: string): Promise<CategoryItem> {
    const normalizedSlug = slug.trim();

    if (normalizedSlug.length === 0) {
      throw new BadRequestException('slug must not be empty');
    }

    const category =
      await this.catalogRepository.findCategoryBySlug(normalizedSlug);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.toCategoryItem(category);
  }

  async getProducts(
    filters: PublicProductsFilterRequest,
  ): Promise<PublicProductsListResponse> {
    const page = this.resolvePage(filters.page);
    const limit = this.resolveLimit(filters.limit);
    const search = filters.search?.trim();
    const minPrice = this.normalizePriceFilter(filters.minPrice, 'minPrice');
    const maxPrice = this.normalizePriceFilter(filters.maxPrice, 'maxPrice');
    const minRating = this.normalizeRatingFilter(filters.minRating);

    if (minPrice && maxPrice && minPrice.gt(maxPrice)) {
      throw new BadRequestException(
        'minPrice must be less than or equal maxPrice',
      );
    }

    const query = {
      page,
      limit,
      search,
      categoryId: filters.categoryId,
      shopId: filters.shopId,
      minPrice: minPrice?.toString(),
      maxPrice: maxPrice?.toString(),
      minRating,
    };

    const [products, totalItems] = await Promise.all([
      this.catalogRepository.findPublicProducts(query),
      this.catalogRepository.countPublicProducts(query),
    ]);

    return {
      data: products.map((product) => this.toProductItem(product)),
      meta: {
        page,
        limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / limit),
      },
    };
  }

  async getProductSuggestions(
    filters: PublicProductSuggestionsRequest,
  ): Promise<PublicProductSuggestionsResponse> {
    const limit = this.resolveLimit(filters.limit);
    const search = filters.search?.trim();
    const sessionKey = filters.sessionKey.trim();
    const offset = this.decodeSuggestionsCursor(filters.cursor);

    if (sessionKey.length === 0) {
      throw new BadRequestException('sessionKey must not be empty');
    }

    const candidateTake = this.resolveSuggestionsPoolSize(limit);
    const candidates =
      await this.catalogRepository.findPublicProductSuggestionCandidates({
        search,
        categoryId: filters.categoryId,
        shopId: filters.shopId,
        take: candidateTake,
      });

    const rankedProductIds = this.buildDiversifiedSuggestionIds(
      candidates,
      sessionKey,
    );

    if (rankedProductIds.length === 0 || offset >= rankedProductIds.length) {
      return {
        items: [],
        nextCursor: null,
        hasMore: false,
      };
    }

    const selectedProductIds = rankedProductIds.slice(offset, offset + limit);
    const products =
      await this.catalogRepository.findPublicProductsByIds(selectedProductIds);

    const productById = new Map(
      products.map((product) => [product.id, this.toProductItem(product)]),
    );
    const items = selectedProductIds
      .map((productId) => productById.get(productId))
      .filter((product): product is ProductItem => Boolean(product));

    const nextOffset = Math.min(offset + limit, rankedProductIds.length);
    const hasMore = nextOffset < rankedProductIds.length;

    return {
      items,
      nextCursor: hasMore ? this.encodeSuggestionsCursor(nextOffset) : null,
      hasMore,
    };
  }

  async getProductById(productId: string): Promise<ProductItem> {
    const product =
      await this.catalogRepository.findPublicProductById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.toProductItem(product);
  }

  async upsertProductReview(
    userId: string,
    productId: string,
    payload: UpsertProductReviewRequest,
  ): Promise<UpsertProductReviewResponse> {
    const activeProduct =
      await this.catalogRepository.findActiveProductId(productId);

    if (!activeProduct) {
      throw new NotFoundException('Product not found');
    }

    const result =
      await this.catalogRepository.upsertProductReviewAndRefreshRating({
        productId,
        userId,
        rating: payload.rating,
        comment: this.normalizeReviewComment(payload.comment),
      });

    return {
      review: this.toProductReviewItem(result.review),
      ratingAverage: result.ratingAverage,
      ratingCount: result.ratingCount,
    };
  }

  async getProductReviews(
    productId: string,
    filters: ProductReviewsFilterRequest,
  ): Promise<ProductReviewsListResponse> {
    const page = this.resolvePage(filters.page);
    const limit = this.resolveLimit(filters.limit);
    const activeProduct =
      await this.catalogRepository.findActiveProductId(productId);

    if (!activeProduct) {
      throw new NotFoundException('Product not found');
    }

    const [reviews, totalItems] = await Promise.all([
      this.catalogRepository.findPublicProductReviews({
        productId,
        page,
        limit,
      }),
      this.catalogRepository.countPublicProductReviews(productId),
    ]);

    return {
      data: reviews.map((review) => this.toProductReviewListItem(review)),
      meta: {
        page,
        limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / limit),
      },
    };
  }

  private resolvePage(page?: number): number {
    if (!page || Number.isNaN(page) || page < 1) {
      return 1;
    }

    return page;
  }

  private resolveLimit(limit?: number): number {
    if (!limit || Number.isNaN(limit) || limit < 1) {
      return 20;
    }

    if (limit > 100) {
      return 100;
    }

    return limit;
  }

  private normalizePriceFilter(
    value: string | undefined,
    fieldName: 'minPrice' | 'maxPrice',
  ): Prisma.Decimal | undefined {
    if (!value) {
      return undefined;
    }

    try {
      const decimalValue = new Prisma.Decimal(value);

      if (decimalValue.isNegative()) {
        throw new Error('Negative number is not allowed');
      }

      return decimalValue;
    } catch {
      throw new BadRequestException(
        `${fieldName} must be a valid decimal string`,
      );
    }
  }

  private normalizeRatingFilter(value?: number): number | undefined {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return undefined;
    }

    if (value < 0 || value > 5) {
      throw new BadRequestException('minRating must be between 0 and 5');
    }

    return value;
  }

  private resolveSuggestionsPoolSize(limit: number): number {
    const scaledPoolSize = limit * 30;

    return Math.min(
      Math.max(scaledPoolSize, MIN_SUGGESTIONS_POOL_SIZE),
      MAX_SUGGESTIONS_POOL_SIZE,
    );
  }

  private decodeSuggestionsCursor(cursor?: string): number {
    if (!cursor) {
      return 0;
    }

    try {
      const raw = Buffer.from(cursor, 'base64url').toString('utf8');
      const parsed = JSON.parse(raw) as SuggestionsCursorPayload;

      if (
        parsed.version !== SUGGESTIONS_CURSOR_VERSION ||
        !Number.isInteger(parsed.offset) ||
        parsed.offset < 0
      ) {
        throw new Error('Invalid cursor payload');
      }

      return parsed.offset;
    } catch {
      throw new BadRequestException('Invalid cursor token');
    }
  }

  private encodeSuggestionsCursor(offset: number): string {
    const payload: SuggestionsCursorPayload = {
      version: SUGGESTIONS_CURSOR_VERSION,
      offset,
    };

    return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  }

  private buildDiversifiedSuggestionIds(
    candidates: ProductSuggestionCandidateRecord[],
    sessionKey: string,
  ): string[] {
    if (candidates.length === 0) {
      return [];
    }

    const categoryLanesMap = new Map<
      string,
      ProductSuggestionCandidateRecord[]
    >();

    for (const candidate of candidates) {
      const categoryLane = categoryLanesMap.get(candidate.categoryId) ?? [];
      categoryLane.push(candidate);
      categoryLanesMap.set(candidate.categoryId, categoryLane);
    }

    const orderedCategoryIds = [...categoryLanesMap.keys()].sort(
      (left, right) => {
        const leftScore = this.hashText(`${sessionKey}:category:${left}`);
        const rightScore = this.hashText(`${sessionKey}:category:${right}`);

        if (leftScore !== rightScore) {
          return leftScore - rightScore;
        }

        return left.localeCompare(right);
      },
    );

    const categoryLanes = orderedCategoryIds.map((categoryId) => {
      const lane = categoryLanesMap.get(categoryId) ?? [];

      return [...lane].sort((left, right) => {
        const leftScore = this.hashText(`${sessionKey}:product:${left.id}`);
        const rightScore = this.hashText(`${sessionKey}:product:${right.id}`);

        if (leftScore !== rightScore) {
          return leftScore - rightScore;
        }

        return right.createdAt.getTime() - left.createdAt.getTime();
      });
    });

    const laneOffsets: number[] = Array.from(
      { length: categoryLanes.length },
      () => 0,
    );
    const rankedIds: string[] = [];
    let canContinue = true;

    while (canContinue) {
      canContinue = false;

      for (const [index, lane] of categoryLanes.entries()) {
        const laneOffset = laneOffsets[index] ?? 0;

        if (laneOffset >= lane.length) {
          continue;
        }

        rankedIds.push(lane[laneOffset].id);
        laneOffsets[index] = laneOffset + 1;
        canContinue = true;
      }
    }

    return rankedIds;
  }

  private hashText(input: string): number {
    return createHash('sha256').update(input).digest().readUInt32BE(0);
  }

  private toCategoryItem(category: CategoryRecord): CategoryItem {
    return {
      id: category.id,
      parentId: category.parentId,
      name: category.name,
      slug: category.slug,
      imageKey: category.imageKey,
      imageUrl: resolveCatalogImageUrl(this.storageService, category.imageKey),
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  private toProductItem(product: ProductRecord): ProductItem {
    const ratingAverage = Number(product.ratingAverage.toString());

    return {
      id: product.id,
      shopId: product.shopId,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      imageKey: product.imageKey,
      imageUrl: resolveCatalogImageUrl(this.storageService, product.imageKey),
      status: product.status,
      ratingAverage: Number.isFinite(ratingAverage) ? ratingAverage : 0,
      ratingCount: product.ratingCount,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      variants: product.variants.map((variant) =>
        this.toVariantItem(variant, product.imageKey),
      ),
    };
  }

  private toVariantItem(
    variant: ProductVariantRecord,
    fallbackProductImageKey?: string | null,
  ): ProductVariantItem {
    return {
      id: variant.id,
      productId: variant.productId,
      sku: variant.sku,
      attributes: this.toStringRecord(variant.attributes),
      price: variant.price.toString(),
      imageKey: variant.imageKey,
      imageUrl: resolveCatalogImageUrl(
        this.storageService,
        variant.imageKey,
        fallbackProductImageKey,
      ),
      stockQuantity: variant.stockQuantity,
      createdAt: variant.createdAt.toISOString(),
      updatedAt: variant.updatedAt.toISOString(),
    };
  }

  private toProductReviewItem(review: ProductReviewRecord): ProductReviewItem {
    return {
      id: review.id,
      productId: review.productId,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };
  }

  private toProductReviewListItem(
    review: ProductPublicReviewRecord,
  ): ProductReviewListItem {
    return {
      id: review.id,
      productId: review.productId,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
      reviewerName: review.user.fullName,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };
  }

  private normalizeReviewComment(comment?: string): string | null {
    const normalizedComment = comment?.trim();

    return normalizedComment && normalizedComment.length > 0
      ? normalizedComment
      : null;
  }

  private toStringRecord(value: unknown): Record<string, string> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, String(item)]),
    );
  }
}
