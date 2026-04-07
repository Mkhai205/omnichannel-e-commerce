import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import type {
  ApiResponse,
  SellerPaymentsOverviewResponse,
  SellerPaymentsTransactionsResponse,
  SellerWalletSummaryResponse,
} from '@repo/shared-types';
import { CurrentUser, Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { SellerPaymentsFilterDto } from './dto/seller-payments-filter.dto';
import {
  SellerPaymentsOverviewSwaggerDto,
  SellerPaymentsTransactionsSwaggerDto,
  SellerWalletSummarySwaggerDto,
} from './dto/seller-payments-swagger.dto';
import { FinanceService } from './finance.service';

@ApiTags('Seller - Payments')
@Roles('SELLER')
@Controller('seller/payments')
export class SellerPaymentsController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('wallet')
  @ApiOperation({ summary: 'Get seller wallet summary' })
  @ApiAuthSchemes()
  @ApiOkEnvelopeResponse(
    SellerWalletSummarySwaggerDto,
    'Seller wallet summary retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: false,
    unauthorized: 'Authentication required',
    notFound: 'Seller shop not found',
  })
  async getWalletSummary(
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<ApiResponse<SellerWalletSummaryResponse>> {
    const wallet = await this.financeService.getSellerWalletSummary(
      currentUser.sub,
    );

    return createSuccessResponse(wallet, {
      message: 'Seller wallet summary retrieved successfully',
    });
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get seller payment transactions' })
  @ApiAuthSchemes()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['all', 'settled', 'pending', 'mismatch'],
  })
  @ApiOkEnvelopeResponse(
    SellerPaymentsTransactionsSwaggerDto,
    'Seller payment transactions retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters',
    unauthorized: 'Authentication required',
    notFound: false,
  })
  async getTransactions(
    @CurrentUser() currentUser: JwtPayload,
    @Query() filters: SellerPaymentsFilterDto,
  ): Promise<ApiResponse<SellerPaymentsTransactionsResponse>> {
    const transactions = await this.financeService.getSellerTransactions(
      currentUser.sub,
      filters,
    );

    return createSuccessResponse(transactions, {
      message: 'Seller payment transactions retrieved successfully',
    });
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get seller payments overview' })
  @ApiAuthSchemes()
  @ApiOkEnvelopeResponse(
    SellerPaymentsOverviewSwaggerDto,
    'Seller payments overview retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: false,
    unauthorized: 'Authentication required',
    notFound: false,
  })
  async getOverview(
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<ApiResponse<SellerPaymentsOverviewResponse>> {
    const overview = await this.financeService.getSellerPaymentsOverview(
      currentUser.sub,
    );

    return createSuccessResponse(overview, {
      message: 'Seller payments overview retrieved successfully',
    });
  }
}
