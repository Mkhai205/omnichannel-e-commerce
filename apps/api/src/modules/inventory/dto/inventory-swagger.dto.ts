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
