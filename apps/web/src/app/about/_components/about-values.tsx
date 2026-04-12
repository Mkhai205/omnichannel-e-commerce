import { GemIcon, HandshakeIcon, HeartHandshakeIcon, LightbulbIcon } from "lucide-react";

const VALUES = [
    {
        icon: HandshakeIcon,
        title: "Minh bạch",
        description:
            "Thông tin sản phẩm, giá bán và chính sách phải rõ ràng trên mọi kênh để khách hàng an tâm ra quyết định.",
    },
    {
        icon: HeartHandshakeIcon,
        title: "Đồng hành",
        description:
            "Chúng tôi xem thành công của đội ngũ bán hàng là KPI cốt lõi của mọi giải pháp triển khai.",
    },
    {
        icon: LightbulbIcon,
        title: "Cải tiến liên tục",
        description:
            "Mọi tính năng được đánh giá bằng dữ liệu vận hành và phản hồi thực tế của khách hàng cuối.",
    },
    {
        icon: GemIcon,
        title: "Chất lượng bền vững",
        description:
            "Tập trung vào nền tảng và quy trình đúng chuẩn để mở rộng mà không vỡ vận hành.",
    },
] as const;

export function AboutValues() {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                    Giá trị cốt lõi
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-gray-900 md:text-3xl">
                    Những nguyên tắc vận hành được duy trì trong mọi dự án
                </h2>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                {VALUES.map((value) => (
                    <article key={value.title} className="rounded-xl border border-gray-200 p-5">
                        <value.icon className="size-5 text-success" />
                        <h3 className="mt-3 text-lg font-semibold text-gray-900">{value.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-gray-600">{value.description}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
