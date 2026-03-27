import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GoogleCallbackDto {
  @ApiProperty({ maxLength: 4096 })
  @IsString()
  @MaxLength(4096)
  code!: string;

  @ApiProperty({ maxLength: 512 })
  @IsString()
  @MaxLength(512)
  state!: string;

  @ApiPropertyOptional({ maxLength: 2048 })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  error?: string;
}
