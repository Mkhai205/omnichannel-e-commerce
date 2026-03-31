import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type {
  AdminProductsListResponse,
  ApiResponse,
  ProductItem,
} from '@repo/shared-types';
import { Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import { AdminCatalogService } from './admin-catalog.service';
import { AdminProductsFilterDto } from './dto/admin-products-filter.dto';
import {
  ProductSwaggerDto,
  ProductsListDataSwaggerDto,
} from './dto/catalog-swagger.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';

@ApiTags('Admin - Catalog')
@Roles('ADMIN')
@Controller('admin/catalog')
export class AdminCatalogController {
  constructor(private readonly adminCatalogService: AdminCatalogService) {}

  @Get('products')
  @ApiOperation({ summary: 'Get products list for admin with filters' })
  @ApiAuthSchemes()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'shopId', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['DRAFT', 'ACTIVE', 'HIDDEN'],
  })
  @ApiOkEnvelopeResponse(
    ProductsListDataSwaggerDto,
    'Admin products list retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters',
    unauthorized: 'Authentication required',
    notFound: false,
  })
  async getProducts(
    @Query() filters: AdminProductsFilterDto,
  ): Promise<ApiResponse<AdminProductsListResponse>> {
    const response = await this.adminCatalogService.getProducts(filters);

    return createSuccessResponse(response, {
      message: 'Admin products list retrieved successfully',
    });
  }

  @Patch('products/:id/status')
  @ApiOperation({ summary: 'Update product status' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateProductStatusDto })
  @ApiOkEnvelopeResponse(
    ProductSwaggerDto,
    'Product status updated successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or product id',
    unauthorized: 'Authentication required',
    notFound: 'Product not found',
  })
  async updateProductStatus(
    @Param('id', new ParseUUIDPipe()) productId: string,
    @Body() payload: UpdateProductStatusDto,
  ): Promise<ApiResponse<ProductItem>> {
    const product = await this.adminCatalogService.updateProductStatus(
      productId,
      payload,
    );

    return createSuccessResponse(product, {
      message: 'Product status updated successfully',
    });
  }
}
