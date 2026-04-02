import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PaginationMetaSwaggerDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ example: 100 })
  totalItems!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;
}

export class InventoryLogSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  variantId!: string;

  @ApiProperty({ format: 'uuid' })
  warehouseId!: string;

  @ApiProperty({ enum: ['IMPORT', 'EXPORT', 'RETURN', 'ORDER_DEDUCT'] })
  type!: 'IMPORT' | 'EXPORT' | 'RETURN' | 'ORDER_DEDUCT';

  @ApiProperty({ example: 50 })
  quantityChanged!: number;

  @ApiPropertyOptional({ nullable: true })
  note?: string | null;

  @ApiProperty({ example: '2026-03-28T00:00:00.000Z' })
  createdAt!: string;
}

export class InventoryLogsListDataSwaggerDto {
  @ApiProperty({ type: [InventoryLogSwaggerDto] })
  data!: InventoryLogSwaggerDto[];

  @ApiProperty({ type: PaginationMetaSwaggerDto })
  meta!: PaginationMetaSwaggerDto;
}

export class SellerWarehouseSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Kho mac dinh' })
  name!: string;

  @ApiProperty({ example: 'DEFAULT' })
  code!: string;

  @ApiProperty({ example: true })
  isDefault!: boolean;
}

export class SellerInventoryOverviewSwaggerDto {
  @ApiProperty({ example: '4820000000.00' })
  totalInventoryValue!: string;

  @ApiProperty({ example: 'VND' })
  totalInventoryCurrency!: 'VND';

  @ApiProperty({ example: 12.4 })
  monthlyGrowthPercent!: number;

  @ApiProperty({ example: 18 })
  lowStockCount!: number;

  @ApiProperty({ example: 124 })
  inboundToday!: number;

  @ApiProperty({ example: 256 })
  outboundToday!: number;

  @ApiProperty({ example: 68 })
  inboundProgressPercent!: number;
}

export class SellerInventoryItemSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  variantId!: string;

  @ApiProperty({ format: 'uuid' })
  productId!: string;

  @ApiProperty({ example: 'APL-M3P-14BK' })
  sku!: string;

  @ApiProperty({ example: 'MacBook Pro 14" M3' })
  productName!: string;

  @ApiProperty({ example: 'ELECTRONICS' })
  categoryLabel!: string;

  @ApiProperty({ example: 'APPLE' })
  brandLabel!: string;

  @ApiProperty({ format: 'uuid' })
  warehouseId!: string;

  @ApiProperty({ example: 'Kho mac dinh' })
  warehouseName!: string;

  @ApiProperty({ example: 42 })
  currentStock!: number;

  @ApiProperty({ enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'] })
  status!: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export class SellerInventoryListDataSwaggerDto {
  @ApiProperty({ type: [SellerInventoryItemSwaggerDto] })
  data!: SellerInventoryItemSwaggerDto[];

  @ApiProperty({ type: PaginationMetaSwaggerDto })
  meta!: PaginationMetaSwaggerDto;
}
