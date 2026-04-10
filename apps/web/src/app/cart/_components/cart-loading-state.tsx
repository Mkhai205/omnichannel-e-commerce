function LoadingLine({ className }: { className?: string }) {
    return <div className={`animate-pulse rounded bg-gray-200 ${className ?? ""}`.trim()} />;
}

export function CartLoadingState() {
    return (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
            <div className="space-y-4">
                {[0, 1, 2].map((index) => (
                    <div
                        key={`cart-loading-item-${index}`}
                        className="rounded-2xl border border-gray-200 bg-white p-4"
                    >
                        <div className="flex gap-4">
                            <LoadingLine className="h-20 w-20 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <LoadingLine className="h-4 w-3/4" />
                                <LoadingLine className="h-3 w-1/2" />
                                <LoadingLine className="h-6 w-28" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <LoadingLine className="h-6 w-1/3" />
                <div className="mt-4 space-y-3">
                    <LoadingLine className="h-4 w-full" />
                    <LoadingLine className="h-4 w-full" />
                    <LoadingLine className="h-10 w-full" />
                </div>
            </div>
        </section>
    );
}
