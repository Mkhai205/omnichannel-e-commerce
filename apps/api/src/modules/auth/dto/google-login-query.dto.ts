import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export const GOOGLE_LOGIN_SOURCES = {
  USER: 'user',
  SELLER: 'seller',
} as const;

export type GoogleLoginSource =
  (typeof GOOGLE_LOGIN_SOURCES)[keyof typeof GOOGLE_LOGIN_SOURCES];

export class GoogleLoginQueryDto {
  @ApiPropertyOptional({ enum: Object.values(GOOGLE_LOGIN_SOURCES) })
  @IsOptional()
  @IsEnum(GOOGLE_LOGIN_SOURCES)
  source?: GoogleLoginSource;

  @ApiPropertyOptional({
    maxLength: 32,
    description: 'Legacy compatibility: app=seller implies seller flow',
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  app?: string;

  @ApiPropertyOptional({
    maxLength: 32,
    description: 'Legacy compatibility: role=SELLER implies seller flow',
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  role?: string;
}
