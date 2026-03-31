import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import type { UpdateCartItemRequest } from '@repo/shared-types';

export class UpdateCartItemDto implements UpdateCartItemRequest {
  @ApiProperty({ minimum: 0, example: 2 })
  @IsInt()
  @Min(0)
  quantity!: number;
}
