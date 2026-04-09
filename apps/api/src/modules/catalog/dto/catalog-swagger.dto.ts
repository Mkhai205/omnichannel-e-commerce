import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategorySwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  parentId?: string | null;

  @ApiProperty({ example: 'Dien thoai' })
  name!: string;

  @ApiProperty({ example: 'dien-thoai' })
  slug!: string;

  @ApiPropertyOptional({
    nullable: true,
    example: 'categories/89a2f95f-367f-4ad1-85d7-f86034fd9443/cover.jpg',
  })
  imageKey?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example:
      'http://localhost:9000/products/categories/89a2f95f-367f-4ad1-85d7-f86034fd9443/cover.jpg',
  })
  imageUrl?: string | null;

  @ApiProperty({ example: '2026-03-28T00:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-28T00:00:00.000Z' })
  updatedAt!: string;
}

export class ProductVariantSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  productId!: string;

  @ApiProperty({ example: 'IP16PM-256-BLACK' })
  sku!: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: { color: 'Black', storage: '256GB' },
  })
  attributes!: Record<string, string>;

  @ApiProperty({ example: '32990000' })
  price!: string;

  @ApiPropertyOptional({
    nullable: true,
    example:
      'products/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/variants/5f19831d-23de-4d7e-a3f8-f4f98978cbce.jpg',
  })
  imageKey?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example:
      'http://localhost:9000/products/products/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/variants/5f19831d-23de-4d7e-a3f8-f4f98978cbce.jpg',
  })
  imageUrl?: string | null;

  @ApiProperty({ example: 100 })
  stockQuantity!: number;

  @ApiProperty({ example: '2026-03-28T00:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-28T00:00:00.000Z' })
  updatedAt!: string;
}

export class ProductSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  shopId!: string;

  @ApiProperty({ format: 'uuid' })
  categoryId!: string;

  @ApiProperty({ example: 'iPhone 16 Pro Max' })
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example: 'products/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/main.jpg',
  })
  imageKey?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example:
      'http://localhost:9000/products/products/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/main.jpg',
  })
  imageUrl?: string | null;

  @ApiProperty({ enum: ['DRAFT', 'ACTIVE', 'HIDDEN'] })
  status!: 'DRAFT' | 'ACTIVE' | 'HIDDEN';

  @ApiProperty({ example: 4.67 })
  ratingAverage!: number;

  @ApiProperty({ example: 128 })
  ratingCount!: number;

  @ApiProperty({ type: [ProductVariantSwaggerDto] })
  variants!: ProductVariantSwaggerDto[];

  @ApiProperty({ example: '2026-03-28T00:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-28T00:00:00.000Z' })
  updatedAt!: string;
}

export class ProductReviewSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  productId!: string;

  @ApiProperty({ format: 'uuid' })
  userId!: string;

  @ApiProperty({ minimum: 1, maximum: 5, example: 5 })
  rating!: number;

  @ApiPropertyOptional({ nullable: true, example: 'San pham rat tot' })
  comment?: string | null;

  @ApiProperty({ example: '2026-03-28T00:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-28T00:00:00.000Z' })
  updatedAt!: string;
}

export class UpsertProductReviewDataSwaggerDto {
  @ApiProperty({ type: ProductReviewSwaggerDto })
  review!: ProductReviewSwaggerDto;

  @ApiProperty({ example: 4.67 })
  ratingAverage!: number;

  @ApiProperty({ example: 128 })
  ratingCount!: number;
}

export class PaginationMetaSwaggerDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ example: 100 })
  totalItems!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;
}

export class CategoriesListDataSwaggerDto {
  @ApiProperty({ type: [CategorySwaggerDto] })
  data!: CategorySwaggerDto[];

  @ApiProperty({ type: PaginationMetaSwaggerDto })
  meta!: PaginationMetaSwaggerDto;
}

export class ProductsListDataSwaggerDto {
  @ApiProperty({ type: [ProductSwaggerDto] })
  data!: ProductSwaggerDto[];

  @ApiProperty({ type: PaginationMetaSwaggerDto })
  meta!: PaginationMetaSwaggerDto;
}

export class ProductSuggestionsDataSwaggerDto {
  @ApiProperty({ type: [ProductSwaggerDto] })
  items!: ProductSwaggerDto[];

  @ApiPropertyOptional({ nullable: true })
  nextCursor?: string | null;

  @ApiProperty({ example: true })
  hasMore!: boolean;
}

export class UploadCatalogImageResultSwaggerDto {
  @ApiProperty({ example: 'products' })
  bucketName!: string;

  @ApiProperty({
    example:
      'products/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/variants/5f19831d-23de-4d7e-a3f8-f4f98978cbce.jpg',
  })
  objectKey!: string;

  @ApiPropertyOptional({
    nullable: true,
    example:
      'http://localhost:9000/products/products/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/variants/5f19831d-23de-4d7e-a3f8-f4f98978cbce.jpg',
  })
  imageUrl?: string | null;
}
