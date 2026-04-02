import { ApiProperty } from '@nestjs/swagger';
import type { UploadCatalogImageRequest } from '@repo/shared-types';
import { IsIn, IsUUID } from 'class-validator';

export class UploadCatalogImageDto implements UploadCatalogImageRequest {
  @ApiProperty({
    enum: ['CATEGORY', 'PRODUCT', 'PRODUCT_VARIANT'],
    example: 'PRODUCT',
  })
  @IsIn(['CATEGORY', 'PRODUCT', 'PRODUCT_VARIANT'])
  entityType!: 'CATEGORY' | 'PRODUCT' | 'PRODUCT_VARIANT';

  @ApiProperty({
    format: 'uuid',
    example: '4f4c2f31-2a86-4711-a893-6d26e9bdf3f5',
  })
  @IsUUID()
  entityId!: string;
}
