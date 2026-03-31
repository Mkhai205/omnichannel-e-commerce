import type { UUID } from "./common.js";

export interface RunAutoDeliveryResponse {
    runAt: string;
    overdueShippedOrders: number;
    eligibleOrders: number;
    skippedWithoutSuccessfulPayment: number;
    delivered: number;
    settled: number;
    processedOrderIds: UUID[];
}
