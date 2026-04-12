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

export class AdminPaymentItemSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  userId!: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  customerName!: string;

  @ApiProperty({ example: 'customer@example.com' })
  customerEmail!: string;

  @ApiProperty({ example: 'VNPAY' })
  provider!: string;

  @ApiProperty({ example: 'SUCCESS' })
  status!: string;

  @ApiProperty({ example: 'PAY-1743367143518-AD14F3A1' })
  txnRef!: string;

  @ApiPropertyOptional({ nullable: true, example: '14529083' })
  gatewayTransactionNo?: string | null;

  @ApiProperty({ example: '2598000.00' })
  amount!: string;

  @ApiProperty({ example: 'VND' })
  currency!: string;

  @ApiPropertyOptional({ nullable: true, example: 'NCB' })
  bankCode?: string | null;

  @ApiProperty({ example: 2 })
  orderCount!: number;

  @ApiPropertyOptional({ nullable: true, example: '2026-04-02T10:00:00.000Z' })
  paidAt?: string | null;

  @ApiProperty({ example: '2026-04-02T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-04-02T10:00:00.000Z' })
  updatedAt!: string;
}

export class AdminPaymentsListSwaggerDto {
  @ApiProperty({ type: [AdminPaymentItemSwaggerDto] })
  data!: AdminPaymentItemSwaggerDto[];

  @ApiProperty({ type: PaginationMetaSwaggerDto })
  meta!: PaginationMetaSwaggerDto;
}

export class AdminSettlementItemSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  orderId!: string;

  @ApiProperty({ example: 'ORD-20260403-9A7B31C2' })
  orderNumber!: string;

  @ApiProperty({ format: 'uuid' })
  shopId!: string;

  @ApiProperty({ example: 'Sport Mega Shop' })
  shopName!: string;

  @ApiProperty({ example: 'Tran Thi B' })
  sellerName!: string;

  @ApiProperty({ format: 'uuid' })
  sellerWalletId!: string;

  @ApiProperty({ example: 'COMPLETED' })
  status!: string;

  @ApiProperty({ example: '2500000.00' })
  grossAmount!: string;

  @ApiProperty({ example: '125000.00' })
  commissionAmount!: string;

  @ApiProperty({ example: '2375000.00' })
  netAmount!: string;

  @ApiProperty({ example: '2026-04-03T10:00:00.000Z' })
  settledAt!: string;

  @ApiProperty({ example: '2026-04-03T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-04-03T10:00:00.000Z' })
  updatedAt!: string;
}

export class AdminSettlementsListSwaggerDto {
  @ApiProperty({ type: [AdminSettlementItemSwaggerDto] })
  data!: AdminSettlementItemSwaggerDto[];

  @ApiProperty({ type: PaginationMetaSwaggerDto })
  meta!: PaginationMetaSwaggerDto;
}

export class AdminDashboardTrendPointSwaggerDto {
  @ApiProperty({ example: '12/04' })
  label!: string;

  @ApiProperty({ example: 15 })
  orderCount!: number;

  @ApiProperty({ example: 35200000 })
  gmv!: number;
}

export class AdminDashboardKpiSwaggerDto {
  @ApiProperty({ example: 1290 })
  totalUsers!: number;

  @ApiProperty({ example: 80 })
  totalShops!: number;

  @ApiProperty({ example: 6 })
  pendingShops!: number;

  @ApiProperty({ example: 8450 })
  totalOrders!: number;

  @ApiProperty({ example: 96 })
  todayOrders!: number;

  @ApiProperty({ example: '1830420000.00' })
  totalGmv!: string;

  @ApiProperty({ example: 94.7 })
  paymentSuccessRate!: number;

  @ApiProperty({ example: 1210 })
  successfulPayments!: number;

  @ApiProperty({ example: 1278 })
  totalPayments!: number;

  @ApiProperty({ example: 22 })
  pendingPayments!: number;

  @ApiProperty({ example: 14 })
  pendingSettlements!: number;

  @ApiProperty({ type: [AdminDashboardTrendPointSwaggerDto] })
  trend!: AdminDashboardTrendPointSwaggerDto[];

  @ApiProperty({ example: '2026-04-12T11:00:00.000Z' })
  generatedAt!: string;
}
