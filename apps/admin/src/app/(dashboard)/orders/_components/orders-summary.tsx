type OrdersSummaryProps = {
    totalItems: number;
    currentPageTotalAmount: number;
    pendingSettlementCount: number;
};

export function OrdersSummary({
    totalItems,
    currentPageTotalAmount,
    pendingSettlementCount,
}: OrdersSummaryProps) {
    return (
        <section className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total orders
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{totalItems}</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Current page amount
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                    {currentPageTotalAmount.toLocaleString("vi-VN")}d
                </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Pending settlement (page)
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                    {pendingSettlementCount}
                </p>
            </div>
        </section>
    );
}
