import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import type {
  ApiResponse,
  CategoriesListResponse,
  ProductItem,
  PublicProductSuggestionsResponse,
  PublicProductsListResponse,
  UpsertProductReviewResponse,
} from '@repo/shared-types';
import { CurrentUser, Public, Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { PublicCatalogService } from './public-catalog.service';
import {
  CategoriesListDataSwaggerDto,
  ProductSuggestionsDataSwaggerDto,
  ProductSwaggerDto,
  ProductsListDataSwaggerDto,
  UpsertProductReviewDataSwaggerDto,
} from './dto/catalog-swagger.dto';
import { PublicCategoriesFilterDto } from './dto/public-categories-filter.dto';
import { PublicProductSuggestionsFilterDto } from './dto/public-product-suggestions-filter.dto';
import { PublicProductsFilterDto } from './dto/public-products-filter.dto';
import { UpsertProductReviewDto } from './dto/upsert-product-review.dto';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly publicCatalogService: PublicCatalogService) {}

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get categories with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'parentId', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiOkEnvelopeResponse(
    CategoriesListDataSwaggerDto,
    'Categories list retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters',
    unauthorized: false,
    notFound: false,
  })
  async getCategories(
    @Query() filters: PublicCategoriesFilterDto,
  ): Promise<ApiResponse<CategoriesListResponse>> {
    const response = await this.publicCatalogService.getCategories(filters);

    return createSuccessResponse(response, {
      message: 'Categories list retrieved successfully',
    });
  }

  @Public()
  @Get('products')
  @ApiOperation({ summary: 'Get public products list' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'shopId', required: false, type: String })
  @ApiOkEnvelopeResponse(
    ProductsListDataSwaggerDto,
    'Public products list retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters',
    unauthorized: false,
    notFound: false,
  })
  async getProducts(
    @Query() filters: PublicProductsFilterDto,
  ): Promise<ApiResponse<PublicProductsListResponse>> {
    const response = await this.publicCatalogService.getProducts(filters);

    return createSuccessResponse(response, {
      message: 'Public products list retrieved successfully',
    });
  }

  @Public()
  @Get('products/suggestions')
  @ApiOperation({ summary: 'Get diversified public product suggestions' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({ name: 'sessionKey', required: true, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'shopId', required: false, type: String })
  @ApiOkEnvelopeResponse(
    ProductSuggestionsDataSwaggerDto,
    'Public product suggestions retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters',
    unauthorized: false,
    notFound: false,
  })
  async getProductSuggestions(
    @Query() filters: PublicProductSuggestionsFilterDto,
  ): Promise<ApiResponse<PublicProductSuggestionsResponse>> {
    const response =
      await this.publicCatalogService.getProductSuggestions(filters);

    return createSuccessResponse(response, {
      message: 'Public product suggestions retrieved successfully',
    });
  }

  @Public()
  @Get('products/:id')
  @ApiOperation({ summary: 'Get one active product by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkEnvelopeResponse(
    ProductSwaggerDto,
    'Public product detail retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid product id',
    unauthorized: false,
    notFound: 'Product not found',
  })
  async getProductById(
    @Param('id', new ParseUUIDPipe()) productId: string,
  ): Promise<ApiResponse<ProductItem>> {
    const product = await this.publicCatalogService.getProductById(productId);

    return createSuccessResponse(product, {
      message: 'Public product detail retrieved successfully',
    });
  }

  @Put('products/:id/review')
  @Roles('CUSTOMER')
  @ApiOperation({
    summary: 'Create or update current customer review for a product',
  })
  @ApiAuthSchemes()
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkEnvelopeResponse(
    UpsertProductReviewDataSwaggerDto,
    'Product review upserted successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or product id',
    unauthorized: 'Authentication required',
    notFound: 'Product not found',
  })
  async upsertProductReview(
    @CurrentUser() currentUser: JwtPayload,
    @Param('id', new ParseUUIDPipe()) productId: string,
    @Body() payload: UpsertProductReviewDto,
  ): Promise<ApiResponse<UpsertProductReviewResponse>> {
    const response = await this.publicCatalogService.upsertProductReview(
      currentUser.sub,
      productId,
      payload,
    );

    return createSuccessResponse(response, {
      message: 'Product review upserted successfully',
    });
  }
}
