import { cn } from "@/components/ui";

type OrderFeedbackAlertProps = {
    message: string;
    tone?: "error" | "info";
};

export function OrderFeedbackAlert({ message, tone = "error" }: OrderFeedbackAlertProps) {
    return (
        <section
            className={cn(
                "rounded-lg border px-4 py-3 text-sm",
                tone === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-sky-200 bg-sky-50 text-sky-700",
            )}
        >
            {message}
        </section>
    );
}
