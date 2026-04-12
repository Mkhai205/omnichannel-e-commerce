type CheckoutStepperProps = {
    currentStep: 1 | 2 | 3;
};

const STEPS = ["Vận chuyển", "Giao hàng", "Thanh toán"] as const;

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
    return (
        <ol className="grid grid-cols-3 gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
            {STEPS.map((label, index) => {
                const step = (index + 1) as 1 | 2 | 3;
                const isActive = step === currentStep;
                const isCompleted = step < currentStep;

                return (
                    <li
                        key={label}
                        className="flex items-center gap-2 overflow-hidden rounded-lg border border-transparent px-2 py-1.5"
                    >
                        <span
                            className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                isCompleted || isActive
                                    ? "bg-success text-success-foreground"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {step}
                        </span>
                        <span
                            className={`truncate text-sm ${
                                isActive ? "font-semibold text-gray-900" : "text-gray-600"
                            }`}
                        >
                            {label}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
