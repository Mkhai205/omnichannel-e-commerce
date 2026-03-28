import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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
  ApiResponse,
  InventoryLogItem,
  InventoryLogsListResponse,
  ProductItem,
  ProductVariantItem,
  SellerProductsListResponse,
} from '@repo/shared-types';
import { CurrentUser, Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiCreatedEnvelopeResponse,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { SellerCatalogService } from './seller-catalog.service';
import { CreateInventoryLogDto } from './dto/create-inventory-log.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import {
  InventoryLogSwaggerDto,
  InventoryLogsListDataSwaggerDto,
  ProductSwaggerDto,
  ProductsListDataSwaggerDto,
  ProductVariantSwaggerDto,
} from './dto/catalog-swagger.dto';
import { InventoryLogsFilterDto } from './dto/inventory-logs-filter.dto';
import { SellerProductsFilterDto } from './dto/seller-products-filter.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@ApiTags('Seller - Catalog')
@Roles('SELLER')
@Controller('seller/catalog')
export class SellerCatalogController {
  constructor(private readonly sellerCatalogService: SellerCatalogService) {}

  @Get('products')
  @ApiOperation({ summary: 'Get current seller products list' })
  @ApiAuthSchemes()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['DRAFT', 'ACTIVE', 'HIDDEN'],
  })
  @ApiOkEnvelopeResponse(
    ProductsListDataSwaggerDto,
    'Seller products list retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters',
    unauthorized: 'Authentication required',
    notFound: 'Seller shop not found',
  })
  async getMyProducts(
    @CurrentUser() currentUser: JwtPayload,
    @Query() filters: SellerProductsFilterDto,
  ): Promise<ApiResponse<SellerProductsListResponse>> {
    const response = await this.sellerCatalogService.getMyProducts(
      currentUser.sub,
      filters,
    );

    return createSuccessResponse(response, {
      message: 'Seller products list retrieved successfully',
    });
  }

  @Post('products')
  @ApiOperation({ summary: 'Create a product for current seller' })
  @ApiAuthSchemes()
  @ApiBody({ type: CreateProductDto })
  @ApiCreatedEnvelopeResponse(ProductSwaggerDto, 'Product created successfully')
  @ApiCommonErrorResponses({
    badRequest: 'Invalid product payload',
    unauthorized: 'Authentication required',
    notFound: 'Seller shop or category not found',
  })
  async createMyProduct(
    @CurrentUser() currentUser: JwtPayload,
    @Body() payload: CreateProductDto,
  ): Promise<ApiResponse<ProductItem>> {
    const product = await this.sellerCatalogService.createMyProduct(
      currentUser.sub,
      payload,
    );

    return createSuccessResponse(product, {
      statusCode: 201,
      message: 'Product created successfully',
    });
  }

  @Patch('products/:id')
  @ApiOperation({ summary: 'Update one seller product' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateProductDto })
  @ApiOkEnvelopeResponse(ProductSwaggerDto, 'Product updated successfully')
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or product id',
    unauthorized: 'Authentication required',
    notFound: 'Product or category not found',
  })
  async updateMyProduct(
    @CurrentUser() currentUser: JwtPayload,
    @Param('id', new ParseUUIDPipe()) productId: string,
    @Body() payload: UpdateProductDto,
  ): Promise<ApiResponse<ProductItem>> {
    const product = await this.sellerCatalogService.updateMyProduct(
      currentUser.sub,
      productId,
      payload,
    );

    return createSuccessResponse(product, {
      message: 'Product updated successfully',
    });
  }

  @Post('products/:id/variants')
  @ApiOperation({ summary: 'Create one variant for a seller product' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: CreateProductVariantDto })
  @ApiCreatedEnvelopeResponse(
    ProductVariantSwaggerDto,
    'Product variant created successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or product id',
    unauthorized: 'Authentication required',
    notFound: 'Product not found',
  })
  async createMyVariant(
    @CurrentUser() currentUser: JwtPayload,
    @Param('id', new ParseUUIDPipe()) productId: string,
    @Body() payload: CreateProductVariantDto,
  ): Promise<ApiResponse<ProductVariantItem>> {
    const variant = await this.sellerCatalogService.createMyVariant(
      currentUser.sub,
      productId,
      payload,
    );

    return createSuccessResponse(variant, {
      statusCode: 201,
      message: 'Product variant created successfully',
    });
  }

  @Patch('variants/:variantId')
  @ApiOperation({ summary: 'Update one seller variant' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'variantId', format: 'uuid' })
  @ApiBody({ type: UpdateProductVariantDto })
  @ApiOkEnvelopeResponse(
    ProductVariantSwaggerDto,
    'Product variant updated successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or variant id',
    unauthorized: 'Authentication required',
    notFound: 'Variant not found',
  })
  async updateMyVariant(
    @CurrentUser() currentUser: JwtPayload,
    @Param('variantId', new ParseUUIDPipe()) variantId: string,
    @Body() payload: UpdateProductVariantDto,
  ): Promise<ApiResponse<ProductVariantItem>> {
    const variant = await this.sellerCatalogService.updateMyVariant(
      currentUser.sub,
      variantId,
      payload,
    );

    return createSuccessResponse(variant, {
      message: 'Product variant updated successfully',
    });
  }

  @Post('variants/:variantId/inventory-logs')
  @ApiOperation({
    summary: 'Create inventory log and adjust stock for a variant',
  })
  @ApiAuthSchemes()
  @ApiParam({ name: 'variantId', format: 'uuid' })
  @ApiBody({ type: CreateInventoryLogDto })
  @ApiCreatedEnvelopeResponse(
    InventoryLogSwaggerDto,
    'Inventory log created successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or stock adjustment',
    unauthorized: 'Authentication required',
    notFound: 'Variant not found',
  })
  async createInventoryLog(
    @CurrentUser() currentUser: JwtPayload,
    @Param('variantId', new ParseUUIDPipe()) variantId: string,
    @Body() payload: CreateInventoryLogDto,
  ): Promise<ApiResponse<InventoryLogItem>> {
    const log = await this.sellerCatalogService.createMyInventoryLog(
      currentUser.sub,
      variantId,
      payload,
    );

    return createSuccessResponse(log, {
      statusCode: 201,
      message: 'Inventory log created successfully',
    });
  }

  @Get('variants/:variantId/inventory-logs')
  @ApiOperation({ summary: 'Get inventory logs for one seller variant' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'variantId', format: 'uuid' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkEnvelopeResponse(
    InventoryLogsListDataSwaggerDto,
    'Inventory logs retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters or variant id',
    unauthorized: 'Authentication required',
    notFound: 'Variant not found',
  })
  async getInventoryLogs(
    @CurrentUser() currentUser: JwtPayload,
    @Param('variantId', new ParseUUIDPipe()) variantId: string,
    @Query() filters: InventoryLogsFilterDto,
  ): Promise<ApiResponse<InventoryLogsListResponse>> {
    const response = await this.sellerCatalogService.getMyVariantInventoryLogs(
      currentUser.sub,
      variantId,
      filters,
    );

    return createSuccessResponse(response, {
      message: 'Inventory logs retrieved successfully',
    });
  }
}
