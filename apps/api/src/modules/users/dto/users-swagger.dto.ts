import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthUserSwaggerDto } from '../../auth/dto/auth-swagger.dto';

export class UserAddressSwaggerDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  userId!: string;

  @ApiProperty({ enum: ['HOME', 'WORK', 'OTHER'] })
  type!: 'HOME' | 'WORK' | 'OTHER';

  @ApiProperty({ example: 'Nguyen Van A' })
  recipientName!: string;

  @ApiProperty({ example: '+84909123456' })
  recipientPhone!: string;

  @ApiProperty({ example: '123 Le Loi Street' })
  streetAddress!: string;

  @ApiPropertyOptional({ example: 'Ward 1, District 1', nullable: true })
  wardDistrict?: string | null;

  @ApiProperty({ example: 'Ho Chi Minh City' })
  city!: string;

  @ApiProperty({ example: 'Ho Chi Minh' })
  state!: string;

  @ApiProperty({ example: '700000' })
  postalCode!: string;

  @ApiProperty({ example: 'Vietnam' })
  country!: string;

  @ApiProperty({ example: true })
  isDefault!: boolean;

  @ApiProperty({ example: '2026-03-27T00:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-27T00:00:00.000Z' })
  updatedAt!: string;
}

export class UserAddressListDataSwaggerDto {
  @ApiProperty({ type: [UserAddressSwaggerDto] })
  addresses!: UserAddressSwaggerDto[];
}

export class PaginationMetaSwaggerDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ example: 120 })
  totalItems!: number;

  @ApiProperty({ example: 6 })
  totalPages!: number;
}

export class AdminUserListDataSwaggerDto {
  @ApiProperty({ type: [AuthUserSwaggerDto] })
  data!: AuthUserSwaggerDto[];

  @ApiProperty({ type: PaginationMetaSwaggerDto })
  meta!: PaginationMetaSwaggerDto;
}

export class OperationSuccessSwaggerDto {
  @ApiProperty({ example: true })
  success!: boolean;
}
