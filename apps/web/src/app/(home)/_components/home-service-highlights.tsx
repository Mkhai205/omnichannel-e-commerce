import { BadgeCheckIcon, HeadsetIcon, ShieldCheckIcon, TruckIcon } from "lucide-react";

const SERVICE_ITEMS = [
    {
        title: "Miến phí vận chuyển",
        description: "Miễn phí vận chuyển cho tất cả đơn hàng",
        icon: TruckIcon,
    },
    {
        title: "Hỗ trợ khách hàng 24/7",
        description: "Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn",
        icon: HeadsetIcon,
    },
    {
        title: "100% thanh toán an toàn",
        description: "Bảo mật thông tin và giao dịch của bạn",
        icon: ShieldCheckIcon,
    },
    {
        title: "Đảm bảo hoàn tiền",
        description: "30 ngày hoàn tiền nếu sản phẩm không như mô tả",
        icon: BadgeCheckIcon,
    },
];

export function HomeServiceHighlights() {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-5 md:px-6 md:py-6">
            <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4 lg:p-5">
                {SERVICE_ITEMS.map((item) => {
                    const Icon = item.icon;

                    return (
                        <article
                            key={item.title}
                            className="flex items-start gap-3 rounded-lg px-2 py-2"
                        >
                            <div className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                                <Icon className="size-4.5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">
                                    {item.title}
                                </h3>
                                <p className="mt-0.5 text-xs text-gray-500">{item.description}</p>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
