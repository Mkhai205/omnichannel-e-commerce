import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SellerProfileSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  shopId!: string;

  @ApiProperty({ example: 'Khaidz Store' })
  shopName!: string;

  @ApiPropertyOptional({
    nullable: true,
    example: 'shops/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/avatar.jpg',
  })
  avatarKey?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example:
      'http://localhost:9000/products/shops/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/avatar.jpg',
  })
  avatarUrl?: string | null;
}

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

  @ApiPropertyOptional({ type: SellerProfileSwaggerDto })
  sellerProfile?: SellerProfileSwaggerDto;

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

export class RegisterDataSwaggerDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: true })
  requiresEmailVerification!: boolean;
}

export class LogoutDataSwaggerDto {
  @ApiProperty({ example: true })
  success!: boolean;
}
