import {
  Body,
  Controller,
  Get,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type {
  ApiResponse,
  ProductItem,
  ProductVariantItem,
  SellerProductsListResponse,
  UploadCatalogImageResult,
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
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import {
  ProductSwaggerDto,
  ProductsListDataSwaggerDto,
  ProductVariantSwaggerDto,
  UploadCatalogImageResultSwaggerDto,
} from './dto/catalog-swagger.dto';
import { SellerProductsFilterDto } from './dto/seller-products-filter.dto';
import { UploadCatalogImageDto } from './dto/upload-catalog-image.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import type { CatalogImageUploadFile } from './seller-catalog.service';

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


    @Delete('products/:id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkEnvelopeResponse(
    ProductSwaggerDto,
    'Product deleted successfully',
  )
  async deleteMyProduct(
    @CurrentUser() currentUser: JwtPayload,
    @Param('id', new ParseUUIDPipe()) productId: string,
  ) {
    const result = await this.sellerCatalogService.deleteMyProduct(
      currentUser.sub,
      productId,
    );

    return createSuccessResponse(result, {
      message: 'Product deleted successfully',
    });
  }

  @Delete('variants/:variantId')
  @ApiOperation({ summary: 'Delete a variant' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'variantId', format: 'uuid' })
  @ApiOkEnvelopeResponse(
    ProductVariantSwaggerDto,
    'Variant deleted successfully',
  )
  async deleteMyVariant(
    @CurrentUser() currentUser: JwtPayload,
    @Param('variantId', new ParseUUIDPipe()) variantId: string,
  ) {
    const result = await this.sellerCatalogService.deleteMyVariant(
      currentUser.sub,
      variantId,
    );

    return createSuccessResponse(result, {
      message: 'Variant deleted successfully',
    });
  }

  @Post('images/upload')
  @ApiOperation({
    summary: 'Upload catalog image to MinIO and return object key',
  })
  @ApiAuthSchemes()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      required: ['entityType', 'entityId', 'file'],
      properties: {
        entityType: {
          type: 'string',
          enum: ['CATEGORY', 'PRODUCT', 'PRODUCT_VARIANT'],
        },
        entityId: {
          type: 'string',
          format: 'uuid',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedEnvelopeResponse(
    UploadCatalogImageResultSwaggerDto,
    'Catalog image uploaded successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid upload payload or unsupported image file',
    unauthorized: 'Authentication required',
    notFound: 'Category, product, or variant not found',
  })
  async uploadCatalogImage(
    @CurrentUser() currentUser: JwtPayload,
    @Body() payload: UploadCatalogImageDto,
    @UploadedFile() file?: CatalogImageUploadFile,
  ): Promise<ApiResponse<UploadCatalogImageResult>> {
    const result = await this.sellerCatalogService.uploadCatalogImage(
      currentUser.sub,
      payload,
      file,
    );

    return createSuccessResponse(result, {
      statusCode: 201,
      message: 'Catalog image uploaded successfully',
    });
  }
}
