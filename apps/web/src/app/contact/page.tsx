import type { Metadata } from "next";
import { MessageSquareMoreIcon } from "lucide-react";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import { ContactForm } from "@/app/contact/_components/contact-form";
import { ContactInfo } from "@/app/contact/_components/contact-info";

export const metadata: Metadata = {
    title: "Contact | Ecommerce",
    description:
        "Kết nối với đội ngũ tư vấn để xây dựng lộ trình triển khai thương mại điện tử đa kênh phù hợp doanh nghiệp bạn.",
};

export default function ContactPage() {
    return (
        <>
            <SiteBreadcrumb section="Hỗ trợ" current="Liên hệ" />

            <main className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_52%,#ffffff_100%)] py-8 md:py-10">
                <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                    <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-success/25 bg-success/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-success-dark">
                            <MessageSquareMoreIcon className="size-3.5" />
                            Trung tâm liên hệ
                        </div>
                        <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-gray-900 md:text-4xl">
                            Liên hệ để được tư vấn lộ trình thương mại điện tử đa kênh
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 md:text-base">
                            Chúng tôi ưu tiên các đề bài thực tế và có tính khả thi cao. Càng rõ mục
                            tiêu, đội ngũ càng dễ đề xuất giải pháp sát với vận hành doanh nghiệp
                            của bạn.
                        </p>
                    </section>

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
                        <ContactForm />
                        <ContactInfo />
                    </div>
                </div>
            </main>
        </>
    );
}
