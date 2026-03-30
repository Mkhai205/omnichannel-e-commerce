import { ApiProperty } from '@nestjs/swagger';

export class CheckoutOrderItemSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  orderId!: string;

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

  @ApiProperty({ example: '2026-03-30T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-30T10:00:00.000Z' })
  updatedAt!: string;
}

export class CheckoutOrderSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'ORD-20260330-52A9D13B' })
  orderNumber!: string;

  @ApiProperty({ format: 'uuid' })
  userId!: string;

  @ApiProperty({ format: 'uuid' })
  shopId!: string;

  @ApiProperty({ format: 'uuid' })
  shippingAddressId!: string;

  @ApiProperty({ example: 'PENDING_PAYMENT' })
  status!: string;

  @ApiProperty({ example: '2598000.00' })
  subtotal!: string;

  @ApiProperty({ example: '2598000.00' })
  totalAmount!: string;

  @ApiProperty({ nullable: true, example: 'Please deliver in office hours.' })
  note!: string | null;

  @ApiProperty({ type: [CheckoutOrderItemSwaggerDto] })
  items!: CheckoutOrderItemSwaggerDto[];

  @ApiProperty({ example: '2026-03-30T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-30T10:00:00.000Z' })
  updatedAt!: string;
}

export class CheckoutOrdersResponseSwaggerDto {
  @ApiProperty({ type: [CheckoutOrderSwaggerDto] })
  orders!: CheckoutOrderSwaggerDto[];

  @ApiProperty({ example: '3897000.00' })
  totalCheckoutAmount!: string;
}
