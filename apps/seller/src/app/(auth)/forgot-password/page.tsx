"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { forgotPassword } from "@/services/auth-service";
import { isApiRequestError } from "@/services/http-client";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const canSubmit = email.trim().length > 0 && !isSubmitting;

    const handleSubmit = async () => {
        if (!canSubmit) {
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            await forgotPassword(email.trim().toLowerCase());
            setSuccessMessage("Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.");
        } catch (error) {
            const fallbackMessage = "Không thể gửi yêu cầu lúc này. Vui lòng thử lại.";
            if (isApiRequestError(error)) {
                setErrorMessage(error.message || fallbackMessage);
            } else {
                setErrorMessage(fallbackMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Quên mật khẩu</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Nhập email để nhận liên kết đặt lại mật khẩu.
                </p>

                <div className="mt-6 grid gap-3">
                    <Input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="seller@example.com"
                        className="h-11 border-slate-200"
                    />
                    <Button
                        type="button"
                        className="h-11 bg-blue-600 text-white hover:bg-blue-500"
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? "Đang xử lý..." : "Gửi yêu cầu"}
                    </Button>
                    {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
                    {successMessage ? (
                        <p className="text-sm text-emerald-700">{successMessage}</p>
                    ) : null}
                </div>

                <p className="mt-5 text-sm text-slate-600">
                    <Link href="/login" className="font-medium text-blue-700 hover:text-blue-600">
                        Quay lại đăng nhập
                    </Link>
                </p>
            </section>
        </main>
    );
}
