import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublicShopSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'My Shop' })
  shopName!: string;

  @ApiProperty({ example: 'my-shop' })
  slug!: string;

  @ApiPropertyOptional({ example: 'Welcome to my shop!' })
  description?: string | null;

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

  @ApiPropertyOptional({
    nullable: true,
    example: 'shops/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/cover.jpg',
  })
  coverKey?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example:
      'http://localhost:9000/products/shops/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/cover.jpg',
  })
  coverUrl?: string | null;
}

export class ShopDetailSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  userId!: string;

  @ApiProperty({ example: 'My Shop' })
  shopName!: string;

  @ApiProperty({ example: 'my-shop' })
  slug!: string;

  @ApiPropertyOptional({ example: 'Welcome to my shop!' })
  description?: string | null;

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

  @ApiPropertyOptional({
    nullable: true,
    example: 'shops/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/cover.jpg',
  })
  coverKey?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example:
      'http://localhost:9000/products/shops/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/cover.jpg',
  })
  coverUrl?: string | null;

  @ApiPropertyOptional({
    example: 'https://minio.local/licenses/shop-license.png',
  })
  businessLicense?: string | null;

  @ApiProperty({ enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  status!: 'PENDING' | 'APPROVED' | 'REJECTED';

  @ApiPropertyOptional({
    example: 'Incomplete business verification documents',
    nullable: true,
  })
  rejectionReason?: string | null;

  @ApiProperty({ example: '2026-03-28T00:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-28T00:00:00.000Z' })
  updatedAt!: string;
}

export class AdminShopSwaggerDto extends ShopDetailSwaggerDto {
  @ApiProperty({ example: 'seller@example.com' })
  ownerEmail!: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  ownerFullName!: string;
}

export class PaginationMetaSwaggerDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ example: 100 })
  totalItems!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;
}

export class PublicShopsListDataSwaggerDto {
  @ApiProperty({ type: [PublicShopSwaggerDto] })
  data!: PublicShopSwaggerDto[];

  @ApiProperty({ type: PaginationMetaSwaggerDto })
  meta!: PaginationMetaSwaggerDto;
}

export class AdminShopsListDataSwaggerDto {
  @ApiProperty({ type: [AdminShopSwaggerDto] })
  data!: AdminShopSwaggerDto[];

  @ApiProperty({ type: PaginationMetaSwaggerDto })
  meta!: PaginationMetaSwaggerDto;
}

export class UploadShopAvatarResultSwaggerDto {
  @ApiProperty({ example: 'products' })
  bucketName!: string;

  @ApiProperty({
    example: 'shops/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/avatar.jpg',
  })
  objectKey!: string;

  @ApiPropertyOptional({
    nullable: true,
    example:
      'http://localhost:9000/products/shops/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/avatar.jpg',
  })
  avatarUrl?: string | null;
}

export class UploadShopCoverResultSwaggerDto {
  @ApiProperty({ example: 'products' })
  bucketName!: string;

  @ApiProperty({
    example: 'shops/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/cover.jpg',
  })
  objectKey!: string;

  @ApiPropertyOptional({
    nullable: true,
    example:
      'http://localhost:9000/products/shops/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/cover.jpg',
  })
  coverUrl?: string | null;
}
