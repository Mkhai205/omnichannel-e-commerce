import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
  ApiResponse,
  ShopDetail,
  UploadShopAvatarResult,
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
import { SellerUpdateShopDto } from './dto/seller-update-shop.dto';
import {
  ShopDetailSwaggerDto,
  UploadShopAvatarResultSwaggerDto,
} from './dto/shops-swagger.dto';
import {
  SellerShopsService,
  type ShopAvatarUploadFile,
} from './seller-shops.service';

@ApiTags('Seller - Shops')
@Roles('SELLER')
@Controller('seller/shops')
export class SellerShopsController {
  constructor(private readonly sellerShopsService: SellerShopsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current seller shop details' })
  @ApiAuthSchemes()
  @ApiOkEnvelopeResponse(
    ShopDetailSwaggerDto,
    'Seller shop details retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: false,
    unauthorized: 'Authentication required',
    notFound: 'Shop not found',
  })
  async getMyShop(
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<ApiResponse<ShopDetail>> {
    const shop = await this.sellerShopsService.getMyShop(currentUser.sub);

    return createSuccessResponse(shop, {
      message: 'Seller shop details retrieved successfully',
    });
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current seller shop profile' })
  @ApiAuthSchemes()
  @ApiBody({ type: SellerUpdateShopDto })
  @ApiOkEnvelopeResponse(
    ShopDetailSwaggerDto,
    'Seller shop updated successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'At least one valid field is required',
    unauthorized: 'Authentication required',
    notFound: 'Shop not found',
  })
  async updateMyShop(
    @CurrentUser() currentUser: JwtPayload,
    @Body() payload: SellerUpdateShopDto,
  ): Promise<ApiResponse<ShopDetail>> {
    const shop = await this.sellerShopsService.updateMyShop(
      currentUser.sub,
      payload,
    );

    return createSuccessResponse(shop, {
      message: 'Seller shop updated successfully',
    });
  }

  @Post('avatar/upload')
  @ApiOperation({ summary: 'Upload seller shop avatar to MinIO' })
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
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedEnvelopeResponse(
    UploadShopAvatarResultSwaggerDto,
    'Shop avatar uploaded successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid upload payload or unsupported image file',
    unauthorized: 'Authentication required',
    notFound: 'Shop not found',
  })
  async uploadMyShopAvatar(
    @CurrentUser() currentUser: JwtPayload,
    @UploadedFile() file?: ShopAvatarUploadFile,
  ): Promise<ApiResponse<UploadShopAvatarResult>> {
    const result = await this.sellerShopsService.uploadMyShopAvatar(
      currentUser.sub,
      file,
    );

    return createSuccessResponse(result, {
      statusCode: 201,
      message: 'Shop avatar uploaded successfully',
    });
  }
}
