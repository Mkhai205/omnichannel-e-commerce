import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseMetadataSwaggerDto {
  @ApiPropertyOptional({ example: 100 })
  total?: number;

  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  limit?: number;
}

export class ApiSuccessResponseSwaggerDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiProperty({ example: 'Successfully!' })
  message!: string;

  @ApiPropertyOptional({ type: ApiResponseMetadataSwaggerDto })
  metadata?: ApiResponseMetadataSwaggerDto;
}

export class ApiErrorResponseSwaggerDto {
  @ApiProperty({ example: false })
  success!: boolean;

  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: 'Validation failed' })
  message!: string;

  @ApiPropertyOptional({
    example: ['email must be an email', 'password must be longer than 8'],
  })
  errors?: unknown;
}
