import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import type { UpsertProductReviewRequest } from '@repo/shared-types';

export class UpsertProductReviewDto implements UpsertProductReviewRequest {
  @ApiProperty({
    minimum: 1,
    maximum: 5,
    example: 5,
    description: 'Rating from 1 to 5 stars',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiPropertyOptional({
    example: 'San pham rat tot, dung nhu mo ta.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}
