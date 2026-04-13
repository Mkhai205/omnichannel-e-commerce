import { Button } from "@/components/ui";
import { CalendarDays } from "lucide-react";
import type { SellerAnalyticsTimeRange } from "@repo/shared-types";

type TimeFilterOption = {
    id: SellerAnalyticsTimeRange;
    label: string;
};

type AnalyticsHeaderProps = {
    title: string;
    description: string;
    selectedTimeRange: SellerAnalyticsTimeRange;
    timeFilters: TimeFilterOption[];
    onTimeRangeChange: (nextRange: SellerAnalyticsTimeRange) => void;
};

export function AnalyticsHeader({
    title,
    description,
    selectedTimeRange,
    timeFilters,
    onTimeRangeChange,
}: AnalyticsHeaderProps) {
    return (
        <header className="grid gap-4 border-b border-slate-200 pb-6 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
                <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
                <p className="mt-2 max-w-3xl text-balance text-lg text-slate-600">{description}</p>
            </div>

            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-1 rounded-xl bg-slate-100 p-1">
                {timeFilters.map((filter) => (
                    <Button
                        key={filter.id}
                        type="button"
                        variant="ghost"
                        onClick={() => onTimeRangeChange(filter.id)}
                        className={
                            filter.id === selectedTimeRange
                                ? "h-10 rounded-lg bg-white text-sm font-semibold text-blue-600 shadow-sm hover:bg-white"
                                : "h-10 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-200"
                        }
                    >
                        {filter.label}
                    </Button>
                ))}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-10 rounded-lg text-slate-600 hover:bg-slate-200"
                >
                    <CalendarDays aria-hidden="true" />
                </Button>
            </div>
        </header>
    );
}
