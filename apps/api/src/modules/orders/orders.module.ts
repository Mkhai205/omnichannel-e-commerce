import { Module } from '@nestjs/common';
import { PaymentsModule } from '../payments/payments.module';
import { AdminOrdersController } from './admin-orders.controller';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { SellerOrdersController } from './seller-orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [PaymentsModule],
  controllers: [
    OrdersController,
    SellerOrdersController,
    AdminOrdersController,
  ],
  providers: [OrdersRepository, OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
