import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

export class CheckoutPaymentSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  paymentId!: string;

  @ApiProperty({ example: 'PAY-1743367143518-AD14F3A1' })
  txnRef!: string;

  @ApiProperty({ type: [String], format: 'uuid' })
  orderIds!: string[];

  @ApiProperty({ example: '3897000.00' })
  totalAmount!: string;

  @ApiProperty({
    example:
      'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=3897000&vnp_TxnRef=PAY-1743367143518-AD14F3A1',
  })
  paymentUrl!: string;

  @ApiProperty({ example: 'PENDING' })
  status!: string;

  @ApiProperty({ nullable: true, example: '2026-03-30T10:15:00.000Z' })
  expiresAt!: string | null;

  @ApiProperty({ example: '2026-03-30T10:00:00.000Z' })
  createdAt!: string;
}

export class CheckoutOrdersResponseSwaggerDto {
  @ApiProperty({ type: [CheckoutOrderSwaggerDto] })
  orders!: CheckoutOrderSwaggerDto[];

  @ApiProperty({ example: '3897000.00' })
  totalCheckoutAmount!: string;

  @ApiProperty({ type: CheckoutPaymentSwaggerDto })
  payment!: CheckoutPaymentSwaggerDto;
}

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

export class SellerOrderSwaggerDto {
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

  @ApiProperty({ example: 'PROCESSING' })
  status!: string;

  @ApiProperty({ example: '2598000.00' })
  subtotal!: string;

  @ApiProperty({ example: '2598000.00' })
  totalAmount!: string;

  @ApiProperty({ nullable: true, example: 'Please deliver in office hours.' })
  note!: string | null;

  @ApiProperty({ nullable: true, example: '2026-03-30T10:05:00.000Z' })
  shippedAt!: string | null;

  @ApiProperty({ nullable: true, example: '2026-03-30T10:08:00.000Z' })
  deliveredAt!: string | null;

  @ApiProperty({ example: 'PENDING' })
  settlementStatus!: string;

  @ApiProperty({ nullable: true, example: '2026-03-30T10:09:00.000Z' })
  settledAt!: string | null;

  @ApiProperty({ example: '2026-03-30T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-30T10:00:00.000Z' })
  updatedAt!: string;
}

export class SellerOrderDetailItemSwaggerDto {
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

  @ApiProperty({ example: '2026-03-30T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-30T10:00:00.000Z' })
  updatedAt!: string;
}

export class SellerOrderDetailSwaggerDto extends SellerOrderSwaggerDto {
  @ApiProperty({ type: [SellerOrderDetailItemSwaggerDto] })
  items!: SellerOrderDetailItemSwaggerDto[];
}

export class SellerOrdersListDataSwaggerDto {
  @ApiProperty({ type: [SellerOrderSwaggerDto] })
  data!: SellerOrderSwaggerDto[];

  @ApiProperty({ type: PaginationMetaSwaggerDto })
  meta!: PaginationMetaSwaggerDto;
}
