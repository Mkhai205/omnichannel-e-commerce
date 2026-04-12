import Link from "next/link";
import { Building2Icon, ShieldCheckIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui";

const TRUST_METRICS = [
    { label: "Năm đồng hành doanh nghiệp", value: "7+" },
    { label: "Thương hiệu đã triển khai", value: "250+" },
    { label: "Đơn hàng được xử lý mỗi ngày", value: "120K+" },
] as const;

const HIGHLIGHTS = [
    {
        icon: Building2Icon,
        title: "Kiến trúc đa kênh thống nhất",
        description: "Đồng bộ website, social và điểm bán trong cùng một vận hành.",
    },
    {
        icon: ShieldCheckIcon,
        title: "Ưu tiên độ tin cậy",
        description: "Minh bạch thông tin đơn hàng, giao hàng và chính sách đổi trả.",
    },
    {
        icon: UsersIcon,
        title: "Đồng hành đội ngũ bán hàng",
        description: "Tập trung vào hiệu suất bán hàng và trải nghiệm khách hàng lâu dài.",
    },
] as const;

export function AboutHero() {
    return (
        <section className="rounded-2xl border border-gray-200 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_45%,#f0fdf4_100%)] p-6 md:p-8">
            <p className="inline-flex rounded-full border border-primary/25 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                Về chúng tôi
            </p>
            <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-gray-900 md:text-4xl">
                Xây dựng hệ sinh thái thương mại điện tử đa kênh đáng tin cậy cho doanh nghiệp Việt
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-600 md:text-base">
                Chúng tôi phát triển nền tảng giúp nhà bán lẻ kết nối mọi điểm chạm của khách hàng,
                tối ưu vận hành và nâng cao chất lượng dịch vụ hậu mãi. Mọi quyết định sản phẩm đều
                hướng đến mục tiêu duy nhất: tăng niềm tin và tốc độ tăng trưởng bền vững.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="bg-success text-white hover:bg-success-dark">
                    <Link href="/contact">Liên hệ tư vấn</Link>
                </Button>
                <Button
                    asChild
                    variant="outline"
                    className="border-gray-200 text-gray-700 hover:text-success"
                >
                    <Link href="/blog">Khám phá blog</Link>
                </Button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {TRUST_METRICS.map((metric) => (
                    <div
                        key={metric.label}
                        className="rounded-xl border border-white/70 bg-white/80 p-4"
                    >
                        <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                        <p className="mt-1 text-sm text-gray-600">{metric.label}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
                {HIGHLIGHTS.map((highlight) => (
                    <article
                        key={highlight.title}
                        className="rounded-xl border border-primary/10 bg-white p-4"
                    >
                        <highlight.icon className="size-5 text-success" />
                        <h2 className="mt-3 text-base font-semibold text-gray-900">
                            {highlight.title}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            {highlight.description}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}
