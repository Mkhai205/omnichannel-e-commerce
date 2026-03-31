import { ApiProperty } from '@nestjs/swagger';

export class CartItemSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  cartId!: string;

  @ApiProperty({ format: 'uuid' })
  variantId!: string;

  @ApiProperty({ format: 'uuid' })
  productId!: string;

  @ApiProperty({ example: 'Nike Air Zoom Pegasus 40' })
  productName!: string;

  @ApiProperty({ example: 'PEG40-BLK-42' })
  variantSku!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({ example: '1299000.00' })
  unitPrice!: string;

  @ApiProperty({ example: '2598000.00' })
  lineTotal!: string;

  @ApiProperty({ example: '2026-03-29T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-29T10:00:00.000Z' })
  updatedAt!: string;
}

export class CartSummarySwaggerDto {
  @ApiProperty({ format: 'uuid' })
  cartId!: string;

  @ApiProperty({ format: 'uuid' })
  userId!: string;

  @ApiProperty({ example: 3 })
  totalItems!: number;

  @ApiProperty({ example: '3897000.00' })
  subtotal!: string;

  @ApiProperty({ type: [CartItemSwaggerDto] })
  items!: CartItemSwaggerDto[];

  @ApiProperty({ example: '2026-03-29T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-29T10:00:00.000Z' })
  updatedAt!: string;
}

export class ClearCartResultSwaggerDto {
  @ApiProperty({ example: true })
  success!: boolean;
}
