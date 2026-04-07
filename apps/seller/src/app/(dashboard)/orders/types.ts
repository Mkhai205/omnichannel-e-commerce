import type { OrderStatus, SellerOrderItem } from "@repo/shared-types";

export type OrderStatusFilterValue = "ALL" | OrderStatus;

export interface OrdersFilterValues {
    keyword: string;
    placedFrom: string;
    placedTo: string;
    status: OrderStatusFilterValue;
}

export type SellerOrdersTableRow = SellerOrderItem;
