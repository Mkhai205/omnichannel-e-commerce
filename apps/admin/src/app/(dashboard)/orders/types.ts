import type { AdminOrderListItem, OrderStatus, SettlementStatus } from "@repo/shared-types";

export type OrderStatusFilterValue = "ALL" | OrderStatus;
export type SettlementStatusFilterValue = "ALL" | SettlementStatus;

export interface OrdersFilterValues {
    keyword: string;
    placedFrom: string;
    placedTo: string;
    status: OrderStatusFilterValue;
    settlementStatus: SettlementStatusFilterValue;
}

export type AdminOrdersTableRow = AdminOrderListItem;
