import { CircleHelpIcon, ShieldCheckIcon, TruckIcon } from "lucide-react";

const BENEFITS = [
    {
        key: "shipping",
        title: "Vận chuyển nhanh",
        description: "Giao hàng nội thành trong 2h",
        icon: TruckIcon,
    },
    {
        key: "warranty",
        title: "Bảo hành 12 tháng",
        description: "Cam kết chính hãng 100%",
        icon: ShieldCheckIcon,
    },
    {
        key: "support",
        title: "Hỗ trợ 24/7",
        description: "Tư vấn kỹ thuật chuyên sâu",
        icon: CircleHelpIcon,
    },
] as const;

export function CartServiceBenefits() {
    return (
        <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit) => {
                const Icon = benefit.icon;

                return (
                    <article
                        key={benefit.key}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-5 text-center"
                    >
                        <div className="mx-auto inline-flex size-8 items-center justify-center rounded-full bg-success/10 text-success">
                            <Icon className="size-4" />
                        </div>
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">
                            {benefit.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">{benefit.description}</p>
                    </article>
                );
            })}
        </section>
    );
}
