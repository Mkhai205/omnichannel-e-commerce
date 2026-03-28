import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import type { UpdateProductStatusRequest } from '@repo/shared-types';

export class UpdateProductStatusDto implements UpdateProductStatusRequest {
  @ApiProperty({ enum: ['DRAFT', 'ACTIVE', 'HIDDEN'] })
  @IsIn(['DRAFT', 'ACTIVE', 'HIDDEN'])
  status!: 'DRAFT' | 'ACTIVE' | 'HIDDEN';
}
