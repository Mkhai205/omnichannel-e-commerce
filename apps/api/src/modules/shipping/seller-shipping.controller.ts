import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
  ApiResponse,
  SellerShippingMetricsResponse,
} from '@repo/shared-types';
import { CurrentUser, Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { SellerShippingMetricsResponseSwaggerDto } from './dto/shipping-swagger.dto';
import { ShippingService } from './shipping.service';

@ApiTags('Seller - Shipping')
@Roles('SELLER')
@Controller('seller/shipping')
export class SellerShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get seller shipping metrics' })
  @ApiAuthSchemes()
  @ApiOkEnvelopeResponse(
    SellerShippingMetricsResponseSwaggerDto,
    'Seller shipping metrics retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: false,
    unauthorized: 'Authentication required',
    notFound: false,
  })
  async getMetrics(
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<ApiResponse<SellerShippingMetricsResponse>> {
    const metrics = await this.shippingService.getSellerShippingMetrics(
      currentUser.sub,
    );

    return createSuccessResponse(metrics, {
      message: 'Seller shipping metrics retrieved successfully',
    });
  }
}
