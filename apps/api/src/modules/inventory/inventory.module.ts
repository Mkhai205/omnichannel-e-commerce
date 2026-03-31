import { Module } from '@nestjs/common';
import { SellerInventoryController } from './seller-inventory.controller';
import { InventoryRepository } from './inventory.repository';
import { SellerInventoryService } from './seller-inventory.service';

@Module({
  controllers: [SellerInventoryController],
  providers: [InventoryRepository, SellerInventoryService],
  exports: [SellerInventoryService],
})
export class InventoryModule {}
