import { Module } from '@nestjs/common';
import { SellerInventoryDashboardController } from './seller-inventory-dashboard.controller';
import { SellerInventoryController } from './seller-inventory.controller';
import { InventoryRepository } from './inventory.repository';
import { SellerInventoryService } from './seller-inventory.service';

@Module({
  controllers: [SellerInventoryController, SellerInventoryDashboardController],
  providers: [InventoryRepository, SellerInventoryService],
  exports: [SellerInventoryService],
})
export class InventoryModule {}
