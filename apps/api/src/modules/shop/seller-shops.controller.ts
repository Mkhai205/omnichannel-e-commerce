import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { ApiResponse, ShopDetail } from '@repo/shared-types';
import { CurrentUser, Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { SellerUpdateShopDto } from './dto/seller-update-shop.dto';
import { ShopDetailSwaggerDto } from './dto/shops-swagger.dto';
import { SellerShopsService } from './seller-shops.service';

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
}
