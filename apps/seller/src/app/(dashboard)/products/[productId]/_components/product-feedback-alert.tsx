"use client";

type ProductFeedbackAlertProps = {
    tone: "error" | "success";
    message: string;
};

const ALERT_STYLE_BY_TONE: Record<ProductFeedbackAlertProps["tone"], string> = {
    error: "border-rose-200 bg-rose-50 text-rose-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function ProductFeedbackAlert({ tone, message }: ProductFeedbackAlertProps) {
    return (
        <section
            role="alert"
            className={`rounded-lg border px-4 py-3 text-sm ${ALERT_STYLE_BY_TONE[tone]}`}
        >
            {message}
        </section>
    );
}
