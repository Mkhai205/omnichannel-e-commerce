"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button, Input } from "@/components/ui";
import { resetPassword } from "@/services/auth-service";
import { isApiRequestError } from "@/services/http-client";

export default function ResetPasswordPage() {
    const [token, setToken] = useState("");
    const [isReady, setIsReady] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const currentToken = new URLSearchParams(window.location.search).get("token");
        setToken(currentToken ?? "");
        setIsReady(true);
    }, []);

    const canSubmit = useMemo(() => {
        return (
            token.length > 0 &&
            password.length >= 8 &&
            confirmPassword.length >= 8 &&
            password === confirmPassword &&
            !isSubmitting
        );
    }, [confirmPassword, isSubmitting, password, token.length]);

    const handleSubmit = async () => {
        if (!canSubmit) {
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            await resetPassword(token, password);
            setSuccessMessage("Đặt lại mật khẩu thành công. Bạn có thể đăng nhập lại.");
        } catch (error) {
            const fallbackMessage = "Đặt lại mật khẩu thất bại. Vui lòng thử lại.";
            if (isApiRequestError(error)) {
                setErrorMessage(error.message || fallbackMessage);
            } else {
                setErrorMessage(fallbackMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isReady) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
                <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <p className="text-sm text-slate-600">Đang tải dữ liệu...</p>
                </section>
            </main>
        );
    }

    if (!token) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
                <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-semibold text-slate-900">Liên kết không hợp lệ</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Liên kết đặt lại mật khẩu thiếu token hoặc đã hết hạn.
                    </p>
                    <Link
                        href="/forgot-password"
                        className="mt-6 inline-block text-sm font-medium text-blue-700 hover:text-blue-600"
                    >
                        Gửi lại liên kết đặt mật khẩu
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Đặt lại mật khẩu</h1>

                <div className="mt-6 grid gap-3">
                    <Input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
                        className="h-11 border-slate-200"
                    />
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        className="h-11 border-slate-200"
                    />

                    <Button
                        type="button"
                        className="h-11 bg-blue-600 text-white hover:bg-blue-500"
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? "Đang cập nhật..." : "Xác nhận"}
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
