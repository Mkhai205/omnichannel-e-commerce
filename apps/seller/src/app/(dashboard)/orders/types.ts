import type { OrderStatus, SellerOrderItem } from "@repo/shared-types";

export type OrderStatusFilterValue = "all" | OrderStatus;

export type OrdersStatusOption = {
    value: OrderStatusFilterValue;
    label: string;
};

export interface OrdersFilterValues {
    status: OrderStatusFilterValue;
}

export type SellerOrdersTableRow = SellerOrderItem;
