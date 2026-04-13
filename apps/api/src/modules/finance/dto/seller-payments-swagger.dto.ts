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

export class SellerAnalyticsRevenuePointSwaggerDto {
  @ApiProperty({ example: '10/04' })
  label!: string;

  @ApiProperty({ example: 1350000 })
  value!: number;

  @ApiPropertyOptional({ example: true })
  emphasize?: boolean;
}

export class SellerAnalyticsChannelShareSwaggerDto {
  @ApiProperty({ example: 'Website cửa hàng' })
  name!: string;

  @ApiProperty({ example: 52 })
  percent!: number;
}

export class SellerAnalyticsTopCustomerSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  name!: string;

  @ApiProperty({ example: 'vana@example.com' })
  email!: string;

  @ApiProperty({ example: 6 })
  orderCount!: number;

  @ApiProperty({ example: '5200000.00' })
  lifetimeValue!: string;
}

export class SellerAnalyticsTopProductSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Tai nghe XYZ' })
  name!: string;

  @ApiProperty({ example: 87 })
  soldQuantity!: number;

  @ApiProperty({ example: '9200000.00' })
  revenue!: string;

  @ApiProperty({ example: 12.5 })
  growthPercent!: number;
}

export class SellerAnalyticsSummarySwaggerDto {
  @ApiProperty({ example: '450000.00' })
  averageOrderValue!: string;

  @ApiPropertyOptional({ nullable: true, example: null })
  conversionRatePercent!: number | null;
}

export class SellerAnalyticsSwaggerDto {
  @ApiProperty({ enum: ['today', '7days', '30days'], example: '30days' })
  timeRange!: 'today' | '7days' | '30days';

  @ApiProperty({ example: '24500000.00' })
  totalRevenue!: string;

  @ApiProperty({ example: 9.2 })
  trendPercent!: number;

  @ApiProperty({ example: 'so với kỳ trước' })
  trendLabel!: string;

  @ApiProperty({ type: [SellerAnalyticsRevenuePointSwaggerDto] })
  revenueSeries!: SellerAnalyticsRevenuePointSwaggerDto[];

  @ApiProperty({ example: 85 })
  channelGrowthPercent!: number;

  @ApiProperty({ type: [SellerAnalyticsChannelShareSwaggerDto] })
  channelShares!: SellerAnalyticsChannelShareSwaggerDto[];

  @ApiProperty({ type: [SellerAnalyticsTopCustomerSwaggerDto] })
  topCustomers!: SellerAnalyticsTopCustomerSwaggerDto[];

  @ApiProperty({ type: [SellerAnalyticsTopProductSwaggerDto] })
  topProducts!: SellerAnalyticsTopProductSwaggerDto[];

  @ApiProperty({ type: SellerAnalyticsSummarySwaggerDto })
  summary!: SellerAnalyticsSummarySwaggerDto;

  @ApiProperty({ example: '2026-04-14T09:12:00.000Z' })
  generatedAt!: string;
}
