import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import type { UpdateProfileRequest } from '@repo/shared-types';

export class UpdateProfileDto implements UpdateProfileRequest {
  @ApiPropertyOptional({
    minLength: 2,
    maxLength: 255,
    example: 'Nguyen Van A',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  fullName?: string;

  @ApiPropertyOptional({ maxLength: 20, example: '+84909123456' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
