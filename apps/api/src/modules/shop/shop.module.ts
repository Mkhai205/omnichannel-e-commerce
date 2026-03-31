import { Module } from '@nestjs/common';
import { AdminShopsController } from './admin-shops.controller';
import { AdminShopsService } from './admin-shops.service';
import { PublicShopsService } from './public-shops.service';
import { SellerShopsController } from './seller-shops.controller';
import { SellerShopsService } from './seller-shops.service';
import { ShopsController } from './shops.controller';
import { ShopsRepository } from './shops.repository';

@Module({
  controllers: [ShopsController, SellerShopsController, AdminShopsController],
  providers: [
    ShopsRepository,
    PublicShopsService,
    SellerShopsService,
    AdminShopsService,
  ],
  exports: [PublicShopsService, SellerShopsService, AdminShopsService],
})
export class ShopModule {}
