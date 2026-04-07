import { ApiProperty } from '@nestjs/swagger';

export class RunAutoDeliveryResponseSwaggerDto {
  @ApiProperty({ example: '2026-03-30T15:30:00.000Z' })
  runAt!: string;

  @ApiProperty({ example: 10 })
  overdueShippedOrders!: number;

  @ApiProperty({ example: 8 })
  eligibleOrders!: number;

  @ApiProperty({ example: 2 })
  skippedWithoutSuccessfulPayment!: number;

  @ApiProperty({ example: 8 })
  delivered!: number;

  @ApiProperty({ example: 8 })
  settled!: number;

  @ApiProperty({ type: [String], format: 'uuid' })
  processedOrderIds!: string[];
}

export class SellerShippingMetricsResponseSwaggerDto {
  @ApiProperty({ example: 16 })
  pickupCount!: number;

  @ApiProperty({ example: 42 })
  inTransitCount!: number;

  @ApiProperty({ example: 380 })
  deliveredCount!: number;

  @ApiProperty({ example: 4 })
  returnPendingCount!: number;

  @ApiProperty({ example: 0 })
  pickupGrowthPercent!: number;

  @ApiProperty({ example: 0 })
  inTransitGrowthPercent!: number;

  @ApiProperty({ example: 89.6 })
  deliveryRatePercent!: number;
}
