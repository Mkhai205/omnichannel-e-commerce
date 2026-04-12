import type { AdminOrderDetailResponse } from "@repo/shared-types";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

type OrderDetailHeaderProps = {
    detail: AdminOrderDetailResponse;
    onBack: () => void;
};

export function OrderDetailHeader({ detail, onBack }: OrderDetailHeaderProps) {
    return (
        <header className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Admin order detail
                </p>
                <h1 className="text-2xl font-semibold text-slate-900">{detail.orderNumber}</h1>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full border border-slate-200 bg-white px-2 py-1 font-semibold text-slate-700">
                        {detail.status}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                        {detail.settlementStatus}
                    </span>
                </div>
            </div>

            <Button type="button" variant="outline" onClick={onBack}>
                <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
                Back to orders
            </Button>
        </header>
    );
}
