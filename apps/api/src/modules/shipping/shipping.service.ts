import { Injectable, Logger } from '@nestjs/common';
import { ShippingRepository } from './shipping.repository';

interface AutoShippingConfig {
  deliveryAfterMinutes: number;
  batchSize: number;
}

export interface AutoShippingResult {
  scanned: number;
  delivered: number;
  settled: number;
  processedOrderIds: string[];
}

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);
  private readonly config: AutoShippingConfig = {
    deliveryAfterMinutes: 3,
    batchSize: 50,
  };

  constructor(private readonly shippingRepository: ShippingRepository) {}

  async processAutoDelivery(
    now: Date = new Date(),
  ): Promise<AutoShippingResult> {
    const shippedCutoff = new Date(
      now.getTime() - this.config.deliveryAfterMinutes * 60 * 1000,
    );

    const candidates = await this.shippingRepository.findAutoDeliverableOrders(
      shippedCutoff,
      this.config.batchSize,
    );

    if (candidates.length === 0) {
      return {
        scanned: 0,
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

        return {
          scanned: candidates.length,
          delivered: deliveredUpdate.count,
          settled: settledUpdate.count,
          processedOrderIds,
        };
      },
    );

    this.logger.log(
      `[AUTO_SHIPPING] scanned=${result.scanned} delivered=${result.delivered} settled=${result.settled}`,
    );

    return result;
  }
}
