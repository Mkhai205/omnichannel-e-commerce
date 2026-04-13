import { Button, Card, CardContent, CardHeader } from "@/components/ui";
import { Download, Ellipsis } from "lucide-react";
import type { SellerAnalyticsRevenuePoint } from "@repo/shared-types";

type RevenueCardProps = {
    title: string;
    total: string;
    growth: string;
    points: SellerAnalyticsRevenuePoint[];
};

export function RevenueCard({ title, total, growth, points }: RevenueCardProps) {
    const columnTemplate = `repeat(${Math.max(1, points.length)}, minmax(0, 1fr))`;
    const highestValue = Math.max(1, ...points.map((point) => point.value));

    const getBarHeight = (value: number) => {
        const percentage = Math.round((value / highestValue) * 100);
        return `${Math.max(8, percentage)}%`;
    };

    return (
        <Card className="border-slate-200 bg-white">
            <CardHeader className="grid gap-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xl font-semibold uppercase tracking-wide text-slate-900">
                            {title}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                            <p className="text-5xl font-semibold tracking-tight text-slate-900">
                                {total}
                            </p>
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                                {growth}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-9 rounded-lg border-slate-200 text-slate-600"
                        >
                            <Download aria-hidden="true" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-9 rounded-lg border-slate-200 text-slate-600"
                        >
                            <Ellipsis aria-hidden="true" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="rounded-xl bg-slate-50 px-4 pb-4 pt-6">
                    <div
                        className="grid items-end gap-2"
                        style={{ gridTemplateColumns: columnTemplate }}
                    >
                        {points.map((point) => (
                            <div key={point.label} className="flex flex-col items-center gap-3">
                                <div className="relative h-52 w-full rounded-md bg-slate-200/70">
                                    <div
                                        className={`absolute bottom-0 left-0 right-0 rounded-t-md ${point.emphasize ? "bg-blue-500" : "bg-blue-200"}`}
                                        style={{ height: getBarHeight(point.value) }}
                                    />
                                </div>
                                <span
                                    className={
                                        point.emphasize
                                            ? "text-xs font-semibold text-blue-600"
                                            : "text-xs font-semibold text-slate-500"
                                    }
                                >
                                    {point.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
