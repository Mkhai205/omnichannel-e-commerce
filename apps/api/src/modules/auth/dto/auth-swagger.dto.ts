import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthUserSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  fullName!: string;

  @ApiPropertyOptional({ example: '+84909123456', nullable: true })
  phone?: string | null;

  @ApiProperty({ enum: ['CUSTOMER', 'SELLER', 'ADMIN'] })
  role!: 'CUSTOMER' | 'SELLER' | 'ADMIN';

  @ApiProperty({ enum: ['ACTIVE', 'BANNED', 'UNVERIFIED'] })
  status!: 'ACTIVE' | 'BANNED' | 'UNVERIFIED';

  @ApiProperty({ example: '2026-03-27T00:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-27T00:00:00.000Z' })
  updatedAt!: string;
}

export class AuthSessionDataSwaggerDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty({ example: 900 })
  expiresInSeconds!: number;

  @ApiProperty({ type: AuthUserSwaggerDto })
  user!: AuthUserSwaggerDto;
}

export class LogoutDataSwaggerDto {
  @ApiProperty({ example: true })
  success!: boolean;
}
