import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { ApiResponse, RunAutoDeliveryResponse } from '@repo/shared-types';
import { Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import { RunAutoDeliveryResponseSwaggerDto } from './dto/shipping-swagger.dto';
import { ShippingService } from './shipping.service';

@ApiTags('Admin - Shipping')
@Roles('ADMIN')
@Controller('admin/shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('auto-delivery/run')
  @ApiOperation({
    summary: 'Trigger auto-delivery simulation tick and settlement run',
  })
  @ApiAuthSchemes()
  @ApiOkEnvelopeResponse(
    RunAutoDeliveryResponseSwaggerDto,
    'Auto-delivery simulation run completed successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: false,
    unauthorized: 'Authentication required',
    notFound: false,
  })
  async runAutoDelivery(): Promise<ApiResponse<RunAutoDeliveryResponse>> {
    const result = await this.shippingService.processAutoDelivery();

    return createSuccessResponse(result, {
      message: 'Auto-delivery simulation run completed successfully',
    });
  }
}
