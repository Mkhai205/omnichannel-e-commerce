import { Button } from "@/components/ui";

type OrdersErrorCardProps = {
    message: string;
    onRetry?: () => void;
};

export function OrdersErrorCard({ message, onRetry }: OrdersErrorCardProps) {
    return (
        <section className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p>{message}</p>
                {onRetry ? (
                    <Button type="button" variant="outline" onClick={onRetry}>
                        Thử lại
                    </Button>
                ) : null}
            </div>
        </section>
    );
}
