import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type {
  ApiResponse,
  CreateVnpayPaymentUrlResponse,
  PaymentStatusByOrderResponse,
  VnpayIpnResponse,
  VnpayReturnResponse,
} from '@repo/shared-types';
import type { Request, Response } from 'express';
import { CurrentUser, Public, Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CreateVnpayPaymentUrlDto } from './dto/create-vnpay-payment-url.dto';
import {
  CreateVnpayPaymentUrlResponseSwaggerDto,
  PaymentStatusByOrderResponseSwaggerDto,
  VnpayIpnResponseSwaggerDto,
  VnpayReturnResponseSwaggerDto,
} from './dto/payments-swagger.dto';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('vnpay/create-url')
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'Create VNPay payment URL for selected orders' })
  @ApiAuthSchemes()
  @ApiBody({ type: CreateVnpayPaymentUrlDto })
  @ApiOkEnvelopeResponse(
    CreateVnpayPaymentUrlResponseSwaggerDto,
    'VNPay payment URL created successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or VNPay amount',
    unauthorized: 'Authentication required',
    notFound: 'Some orders were not found or not pending payment',
  })
  async createVnpayPaymentUrl(
    @CurrentUser() currentUser: JwtPayload,
    @Body() payload: CreateVnpayPaymentUrlDto,
    @Req() request: Request,
  ): Promise<ApiResponse<CreateVnpayPaymentUrlResponse>> {
    const response = await this.paymentsService.createVnpayPaymentUrl(
      currentUser.sub,
      payload,
      this.extractRequestIp(request),
    );

    return createSuccessResponse(response, {
      message: 'VNPay payment URL created successfully',
    });
  }

  @Get(':orderId/status')
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'Get latest payment status by order id' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'orderId', format: 'uuid' })
  @ApiOkEnvelopeResponse(
    PaymentStatusByOrderResponseSwaggerDto,
    'Payment status retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid order id',
    unauthorized: 'Authentication required',
    notFound: 'Order not found',
  })
  async getPaymentStatusByOrder(
    @CurrentUser() currentUser: JwtPayload,
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<ApiResponse<PaymentStatusByOrderResponse>> {
    const response = await this.paymentsService.getPaymentStatusByOrder(
      currentUser.sub,
      orderId,
    );

    return createSuccessResponse(response, {
      message: 'Payment status retrieved successfully',
    });
  }

  @Get('vnpay/return')
  @Public()
  @ApiOperation({
    summary: 'Verify VNPay return URL payload (no state update)',
  })
  @ApiOkEnvelopeResponse(
    VnpayReturnResponseSwaggerDto,
    'VNPay return payload verified',
  )
  @ApiCommonErrorResponses({
    badRequest: false,
    unauthorized: false,
    notFound: false,
  })
  verifyVnpayReturn(@Req() request: Request): ApiResponse<VnpayReturnResponse> {
    const response = this.paymentsService.verifyVnpayReturn(
      request.query as Record<string, unknown>,
    );

    return createSuccessResponse(response, {
      message: 'VNPay return payload verified',
    });
  }

  @Get('vnpay/ipn')
  @Public()
  @ApiOperation({
    summary:
      'VNPay IPN webhook (public endpoint) to verify checksum and update orders',
  })
  @ApiOkResponse({
    description: 'IPN response for VNPay gateway',
    type: VnpayIpnResponseSwaggerDto,
  })
  async handleVnpayIpn(
    @Req() request: Request,
    @Res() response: Response<VnpayIpnResponse>,
  ): Promise<void> {
    const ipnResponse = await this.paymentsService.processVnpayIpn(
      request.query as Record<string, unknown>,
    );

    response.status(200).json(ipnResponse);
  }

  private extractRequestIp(request: Request): string {
    const fallbackIp = request.ip ?? '127.0.0.1';
    const forwardedFor = request.headers['x-forwarded-for'];

    if (typeof forwardedFor === 'string') {
      return forwardedFor.split(',')[0]?.trim() || fallbackIp;
    }

    if (Array.isArray(forwardedFor)) {
      const firstIp = forwardedFor[0]?.split(',')[0]?.trim();
      if (firstIp) {
        return firstIp;
      }
    }

    return fallbackIp;
  }
}
