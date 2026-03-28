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

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: { tiktok: 'success' },
  })
  omnichannelSyncStatus!: Record<string, string>;

  @ApiProperty({ enum: ['DRAFT', 'ACTIVE', 'HIDDEN'] })
  status!: 'DRAFT' | 'ACTIVE' | 'HIDDEN';

  @ApiProperty({ type: [ProductVariantSwaggerDto] })
  variants!: ProductVariantSwaggerDto[];

  @ApiProperty({ example: '2026-03-28T00:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-28T00:00:00.000Z' })
  updatedAt!: string;
}

export class InventoryLogSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  variantId!: string;

  @ApiProperty({ enum: ['IMPORT', 'EXPORT', 'RETURN', 'ORDER_DEDUCT'] })
  type!: 'IMPORT' | 'EXPORT' | 'RETURN' | 'ORDER_DEDUCT';

  @ApiProperty({ example: 50 })
  quantityChanged!: number;

  @ApiPropertyOptional({ nullable: true })
  note?: string | null;

  @ApiProperty({ example: '2026-03-28T00:00:00.000Z' })
  createdAt!: string;
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

export class InventoryLogsListDataSwaggerDto {
  @ApiProperty({ type: [InventoryLogSwaggerDto] })
  data!: InventoryLogSwaggerDto[];

  @ApiProperty({ type: PaginationMetaSwaggerDto })
  meta!: PaginationMetaSwaggerDto;
}
