import { Building2Icon, Clock3Icon, MailIcon, PhoneCallIcon } from "lucide-react";
import { CONTACT_FAQS, CONTACT_INFO_ITEMS } from "@/app/contact/_lib/contact-options";

const INFO_ICONS = [PhoneCallIcon, MailIcon, Building2Icon] as const;

export function ContactInfo() {
    return (
        <div className="space-y-4">
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-xl font-semibold text-gray-900">Thông tin liên hệ</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                    Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn xây dựng lộ trình triển
                    khai phù hợp quy mô doanh nghiệp.
                </p>

                <div className="mt-5 space-y-3">
                    {CONTACT_INFO_ITEMS.map((item, index) => {
                        const ItemIcon = INFO_ICONS[index] ?? PhoneCallIcon;

                        return (
                            <article
                                key={item.label}
                                className="rounded-xl border border-gray-200 p-4"
                            >
                                <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <ItemIcon className="size-4 text-success" />
                                    {item.label}
                                </div>
                                <p className="mt-2 text-sm font-medium text-primary">
                                    {item.value}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">{item.note}</p>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-xl font-semibold text-gray-900">Câu hỏi thường gặp</h2>
                <div className="mt-4 space-y-3">
                    {CONTACT_FAQS.map((item) => (
                        <article
                            key={item.question}
                            className="rounded-xl border border-gray-200 p-4"
                        >
                            <h3 className="text-sm font-semibold text-gray-900">{item.question}</h3>
                            <p className="mt-2 text-sm leading-6 text-gray-600">{item.answer}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="rounded-2xl border border-success/20 bg-success/5 p-5">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-success-dark">
                    <Clock3Icon className="size-4" />
                    SLA phản hồi
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                    Yêu cầu tư vấn mới được xử lý trong 24 giờ làm việc. Case kỹ thuật khẩn cấp được
                    ưu tiên trong 2 giờ.
                </p>
            </section>
        </div>
    );
}
