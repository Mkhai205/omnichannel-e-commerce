import type { CustomerOrderDetailResponse } from "@repo/shared-types";
import { Clock3Icon } from "lucide-react";
import { formatOrderDate, getOrderStatusLabel } from "../../_lib/order-presentation";

type OrderTrackingTimelineProps = {
    events: CustomerOrderDetailResponse["trackingTimeline"];
};

export function OrderTrackingTimeline({ events }: OrderTrackingTimelineProps) {
    if (events.length === 0) {
        return (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                Chưa có mốc theo dõi cho đơn hàng này.
            </div>
        );
    }

    return (
        <ol className="space-y-4">
            {events.map((event, index) => {
                const isLatest = index === events.length - 1;

                return (
                    <li key={`${event.eventType}-${event.timestamp}`} className="relative pl-8">
                        {index < events.length - 1 ? (
                            <span className="absolute left-2.75 top-6 h-full w-px bg-gray-200" />
                        ) : null}

                        <span
                            className={`absolute left-0 top-1 inline-flex size-6 items-center justify-center rounded-full border text-xs ${
                                isLatest
                                    ? "border-success/30 bg-success/15 text-success-dark"
                                    : "border-gray-300 bg-white text-gray-500"
                            }`}
                        >
                            <Clock3Icon className="size-3.5" />
                        </span>

                        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                                <span className="text-xs text-gray-500">
                                    {formatOrderDate(event.timestamp)}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                            <p className="mt-1 text-xs font-medium text-gray-500">
                                Trạng thái: {getOrderStatusLabel(event.status)}
                            </p>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}
