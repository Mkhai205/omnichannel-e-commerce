import { Module } from '@nestjs/common';
import { AdminCatalogController } from './admin-catalog.controller';
import { AdminCatalogService } from './admin-catalog.service';
import { CatalogRepository } from './catalog.repository';
import { PublicCatalogService } from './public-catalog.service';
import { SellerCatalogController } from './seller-catalog.controller';
import { SellerCatalogService } from './seller-catalog.service';
import { CatalogController } from './catalog.controller';

@Module({
  controllers: [
    CatalogController,
    SellerCatalogController,
    AdminCatalogController,
  ],
  providers: [
    CatalogRepository,
    PublicCatalogService,
    SellerCatalogService,
    AdminCatalogService,
  ],
  exports: [PublicCatalogService, SellerCatalogService, AdminCatalogService],
})
export class CatalogModule {}
