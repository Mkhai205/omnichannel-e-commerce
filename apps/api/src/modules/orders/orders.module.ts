import { Module } from '@nestjs/common';
import { InventoryModule } from '../inventory/inventory.module';
import { PaymentsModule } from '../payments/payments.module';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { SellerOrdersController } from './seller-orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [InventoryModule, PaymentsModule],
  controllers: [OrdersController, SellerOrdersController],
  providers: [OrdersRepository, OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
