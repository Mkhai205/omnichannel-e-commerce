import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PaginationMetaSwaggerDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ example: 120 })
  totalItems!: number;

  @ApiProperty({ example: 6 })
  totalPages!: number;
}

export class SellerWalletSummarySwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  shopId!: string;

  @ApiProperty({ example: '1500000.00' })
  availableBalance!: string;

  @ApiProperty({ example: '350000.00' })
  pendingBalance!: string;

  @ApiProperty({ example: '5400000.00' })
  totalCredited!: string;

  @ApiProperty({ example: '2026-04-02T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-04-02T10:00:00.000Z' })
  updatedAt!: string;
}

export class SellerPaymentTransactionItemSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  orderId!: string;

  @ApiProperty({ example: 'ORD-20260402-5A6C8D91' })
  orderNumber!: string;

  @ApiProperty({ example: 'Quyết toán đơn hàng' })
  transactionType!: string;

  @ApiProperty({ example: '950000.00' })
  amount!: string;

  @ApiPropertyOptional({ nullable: true, example: '50000.00' })
  platformFee?: string | null;

  @ApiProperty({ example: 'SETTLED' })
  status!: string;

  @ApiPropertyOptional({ nullable: true, example: null })
  warningLabel?: string | null;

  @ApiProperty({ example: '2026-04-02T10:00:00.000Z' })
  occurredAt!: string;
}

export class SellerPaymentsTransactionsSwaggerDto {
  @ApiProperty({ type: [SellerPaymentTransactionItemSwaggerDto] })
  data!: SellerPaymentTransactionItemSwaggerDto[];

  @ApiProperty({ type: PaginationMetaSwaggerDto })
  meta!: PaginationMetaSwaggerDto;
}

export class SellerPaymentCashflowPointSwaggerDto {
  @ApiProperty({ example: '02/04' })
  label!: string;

  @ApiProperty({ example: 1250000 })
  revenue!: number;

  @ApiProperty({ example: 62500 })
  platformFee!: number;

  @ApiProperty({ example: 1187500 })
  profit!: number;

  @ApiPropertyOptional({ example: true })
  emphasize?: boolean;
}

export class SellerPaymentsOverviewSwaggerDto {
  @ApiProperty({ example: '5400000.00' })
  totalRevenue!: string;

  @ApiProperty({ example: 8.5 })
  trendPercent!: number;

  @ApiProperty({ example: 'so với kỳ trước' })
  trendLabel!: string;

  @ApiProperty({ example: '0.00' })
  discrepancyAmount!: string;

  @ApiProperty({ example: 0 })
  discrepancyCount!: number;

  @ApiProperty({ type: [SellerPaymentCashflowPointSwaggerDto] })
  cashflow!: SellerPaymentCashflowPointSwaggerDto[];
}
