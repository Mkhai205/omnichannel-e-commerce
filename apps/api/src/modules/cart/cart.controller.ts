import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type { ApiResponse, CartSummary } from '@repo/shared-types';
import { CurrentUser, Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import {
  CartSummarySwaggerDto,
  ClearCartResultSwaggerDto,
} from './dto/cart-swagger.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Customer - Cart')
@Roles('CUSTOMER')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current customer cart' })
  @ApiAuthSchemes()
  @ApiOkEnvelopeResponse(CartSummarySwaggerDto, 'Cart retrieved successfully')
  @ApiCommonErrorResponses({
    badRequest: false,
    unauthorized: 'Authentication required',
  })
  async getMyCart(
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<ApiResponse<CartSummary>> {
    const cart = await this.cartService.getMyCart(currentUser.sub);

    return createSuccessResponse(cart, {
      message: 'Cart retrieved successfully',
    });
  }

  @Post('items')
  @ApiOperation({ summary: 'Add one variant into cart' })
  @ApiAuthSchemes()
  @ApiBody({ type: AddToCartDto })
  @ApiOkEnvelopeResponse(CartSummarySwaggerDto, 'Cart updated successfully')
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or quantity exceeds stock',
    unauthorized: 'Authentication required',
    notFound: 'Product variant not found',
  })
  async addItem(
    @CurrentUser() currentUser: JwtPayload,
    @Body() payload: AddToCartDto,
  ): Promise<ApiResponse<CartSummary>> {
    const cart = await this.cartService.addItem(currentUser.sub, payload);

    return createSuccessResponse(cart, {
      message: 'Cart updated successfully',
    });
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Update quantity of one cart item' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'itemId', format: 'uuid' })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiOkEnvelopeResponse(CartSummarySwaggerDto, 'Cart updated successfully')
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or quantity exceeds stock',
    unauthorized: 'Authentication required',
    notFound: 'Cart item or product variant not found',
  })
  async updateItemQuantity(
    @CurrentUser() currentUser: JwtPayload,
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
    @Body() payload: UpdateCartItemDto,
  ): Promise<ApiResponse<CartSummary>> {
    const cart = await this.cartService.updateItemQuantity(
      currentUser.sub,
      itemId,
      payload,
    );

    return createSuccessResponse(cart, {
      message: 'Cart updated successfully',
    });
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove one item from cart' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'itemId', format: 'uuid' })
  @ApiOkEnvelopeResponse(CartSummarySwaggerDto, 'Cart updated successfully')
  @ApiCommonErrorResponses({
    badRequest: 'Invalid item id',
    unauthorized: 'Authentication required',
    notFound: 'Cart item not found',
  })
  async removeItem(
    @CurrentUser() currentUser: JwtPayload,
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
  ): Promise<ApiResponse<CartSummary>> {
    const cart = await this.cartService.removeItem(currentUser.sub, itemId);

    return createSuccessResponse(cart, {
      message: 'Cart updated successfully',
    });
  }

  @Delete('items')
  @ApiOperation({ summary: 'Clear current customer cart' })
  @ApiAuthSchemes()
  @ApiOkEnvelopeResponse(ClearCartResultSwaggerDto, 'Cart cleared successfully')
  @ApiCommonErrorResponses({
    badRequest: false,
    unauthorized: 'Authentication required',
    notFound: false,
  })
  async clearCart(
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<ApiResponse<{ success: boolean }>> {
    const result = await this.cartService.clearCart(currentUser.sub);

    return createSuccessResponse(result, {
      message: 'Cart cleared successfully',
    });
  }
}
