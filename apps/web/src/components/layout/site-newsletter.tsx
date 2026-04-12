"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button, Input } from "@/components/ui";

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function SiteNewsletter() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const normalizedEmail = email.trim();
        if (!isValidEmail(normalizedEmail)) {
            toast.warning("Vui lòng nhập email hợp lệ để đăng ký bản tin.");
            return;
        }

        setIsSubmitting(true);

        try {
            toast.success("Đăng ký bản tin thành công.");
            setEmail("");
        } catch {
            toast.error("Không thể đăng ký bản tin. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="bg-gray-50">
            <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 md:grid-cols-[1fr_auto] md:items-center md:px-6">
                <div>
                    <h3 className="text-3xl font-semibold text-gray-900">Đăng ký nhận bản tin</h3>
                    <p className="mt-1 max-w-xl text-sm text-gray-500">
                        Cập nhật ưu đãi mới, sản phẩm nổi bật và các chương trình khuyến mãi sớm
                        nhất.
                    </p>
                </div>

                <form
                    className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center"
                    onSubmit={handleSubmit}
                >
                    <Input
                        type="email"
                        placeholder="Nhập địa chỉ email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="h-12 min-w-0 rounded-full border-gray-200 bg-white px-6"
                    />
                    <Button
                        type="submit"
                        className="h-12 rounded-full bg-success px-8 text-sm text-white hover:bg-success-dark"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
                    </Button>
                </form>
            </div>
        </section>
    );
}
