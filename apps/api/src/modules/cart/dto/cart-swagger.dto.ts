import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
