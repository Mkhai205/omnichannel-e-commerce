import { Button, Card, CardContent } from "@repo/ui";
import { AlertTriangle } from "lucide-react";
import type { PaymentDiscrepancyWarning } from "../types";

type PaymentsWarningCardProps = {
  warning: PaymentDiscrepancyWarning;
};

function formatCurrency(value: number) {
  const absoluteValue = Math.abs(value).toLocaleString("vi-VN");
  return `${value < 0 ? "- " : ""}${absoluteValue}`;
}

export function PaymentsWarningCard({ warning }: PaymentsWarningCardProps) {
  return (
    <Card className="border-red-200 bg-red-50/50 shadow-none">
      <CardContent className="px-6 py-6">
        <div className="inline-flex items-center gap-3 text-red-500">
          <AlertTriangle aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em]">{warning.title}</p>
        </div>

        <p className="mt-4 text-4xl font-semibold leading-none text-red-700">
          {formatCurrency(warning.amountVnd)} <span className="text-xl font-medium text-red-500">VND</span>
        </p>

        <p className="mt-4 text-sm leading-relaxed text-red-500">{warning.description}</p>

        <Button
          type="button"
          className="mt-5 h-10 w-full rounded-xl bg-red-500 text-xs font-semibold tracking-[0.12em] text-white hover:bg-red-500/90"
        >
          {warning.ctaLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
