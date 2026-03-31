import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVnpayPaymentUrlResponseSwaggerDto {
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

  @ApiPropertyOptional({
    nullable: true,
    example: '2026-03-30T14:30:00.000Z',
  })
  expiresAt!: string | null;

  @ApiProperty({ example: '2026-03-30T14:15:00.000Z' })
  createdAt!: string;
}

export class PaymentStatusByOrderResponseSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  orderId!: string;

  @ApiProperty({ example: 'PENDING_PAYMENT' })
  orderStatus!: string;

  @ApiPropertyOptional({
    nullable: true,
    example: '2026-03-30T14:25:00.000Z',
  })
  shippedAt?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example: '2026-03-30T14:28:00.000Z',
  })
  deliveredAt?: string | null;

  @ApiPropertyOptional({ example: 'PENDING' })
  settlementStatus?: string;

  @ApiPropertyOptional({
    nullable: true,
    example: '2026-03-30T14:29:00.000Z',
  })
  settledAt?: string | null;

  @ApiPropertyOptional({ format: 'uuid' })
  paymentId?: string;

  @ApiPropertyOptional({ example: 'PENDING' })
  paymentStatus?: string;

  @ApiPropertyOptional({ example: 'VNPAY' })
  paymentProvider?: string;

  @ApiPropertyOptional({ example: 'PAY-1743367143518-AD14F3A1' })
  txnRef?: string;

  @ApiPropertyOptional({ example: '3897000.00' })
  totalAmount?: string;

  @ApiPropertyOptional({
    nullable: true,
    example: '2026-03-30T14:20:00.000Z',
  })
  paidAt?: string | null;

  @ApiProperty({ example: '2026-03-30T14:20:00.000Z' })
  updatedAt!: string;
}

export class VnpayReturnResponseSwaggerDto {
  @ApiPropertyOptional({ example: 'PAY-1743367143518-AD14F3A1' })
  txnRef?: string;

  @ApiProperty({ example: true })
  isVerified!: boolean;

  @ApiProperty({ example: true })
  isSuccess!: boolean;

  @ApiPropertyOptional({ example: '00' })
  responseCode?: string;

  @ApiProperty({ example: 'Giao dich thanh cong' })
  message!: string;
}

export class VnpayIpnResponseSwaggerDto {
  @ApiProperty({ example: '00' })
  RspCode!: string;

  @ApiProperty({ example: 'Confirm Success' })
  Message!: string;
}
