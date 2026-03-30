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
