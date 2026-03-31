import { Injectable, Logger } from '@nestjs/common';
import type { RunAutoDeliveryResponse } from '@repo/shared-types';
import { FinanceService } from '../finance/finance.service';
import { ShippingRepository } from './shipping.repository';

interface AutoShippingConfig {
  deliveryAfterMinutes: number;
  batchSize: number;
}

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);
  private readonly config: AutoShippingConfig = {
    deliveryAfterMinutes: 3,
    batchSize: 50,
  };

  constructor(
    private readonly shippingRepository: ShippingRepository,
    private readonly financeService: FinanceService,
  ) {}

  async processAutoDelivery(
    now: Date = new Date(),
  ): Promise<RunAutoDeliveryResponse> {
    const shippedCutoff = new Date(
      now.getTime() - this.config.deliveryAfterMinutes * 60 * 1000,
    );

    const overdueShippedOrders =
      await this.shippingRepository.countOverdueShippedOrders(shippedCutoff);

    const candidates = await this.shippingRepository.findAutoDeliverableOrders(
      shippedCutoff,
      this.config.batchSize,
    );

    const eligibleOrders = candidates.length;
    const skippedWithoutSuccessfulPayment = Math.max(
      0,
      overdueShippedOrders - eligibleOrders,
    );

    if (eligibleOrders === 0) {
      return {
        runAt: now.toISOString(),
        overdueShippedOrders,
        eligibleOrders,
        skippedWithoutSuccessfulPayment,
        delivered: 0,
        settled: 0,
        processedOrderIds: [],
      };
    }

    const processedOrderIds = candidates.map((order) => order.id);

    const result = await this.shippingRepository.runInTransaction(
      async (tx) => {
        const deliveredUpdate =
          await this.shippingRepository.markOrdersAsDelivered(
            processedOrderIds,
            now,
            tx,
          );

        const settledUpdate = await this.shippingRepository.markOrdersAsSettled(
          processedOrderIds,
          now,
          tx,
        );

        if (settledUpdate.count > 0) {
          await this.financeService.settleSellerOnDeliveredOrders(
            processedOrderIds,
            tx,
          );
        }

        return {
          runAt: now.toISOString(),
          overdueShippedOrders,
          eligibleOrders,
          skippedWithoutSuccessfulPayment,
          delivered: deliveredUpdate.count,
          settled: settledUpdate.count,
          processedOrderIds,
        };
      },
    );

    this.logger.log(
      `[AUTO_SHIPPING] overdue=${result.overdueShippedOrders} eligible=${result.eligibleOrders} skipped_unpaid=${result.skippedWithoutSuccessfulPayment} delivered=${result.delivered} settled=${result.settled}`,
    );

    return result;
  }
}
