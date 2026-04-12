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
                    Tổng đơn hàng
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{totalItems}</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Giá trị trang hiện tại
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                    {currentPageTotalAmount.toLocaleString("vi-VN")}đ
                </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Chờ đối soát (trang)
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                    {pendingSettlementCount}
                </p>
            </div>
        </section>
    );
}
