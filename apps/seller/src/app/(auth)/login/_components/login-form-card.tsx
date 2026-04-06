"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { buildSellerGoogleLoginUrl, loginSeller } from "@/services/auth-service";
import { isApiRequestError } from "@/services/http-client";
import { getMySellerShop } from "@/services/seller-shop-service";

export function LoginFormCard() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberLogin, setRememberLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const canSubmit = useMemo(
        () => email.trim().length > 0 && password.trim().length > 0,
        [email, password],
    );

    const handleSubmit = async () => {
        if (!canSubmit || isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            await loginSeller({ email: email.trim(), password });

            const nextPath = new URLSearchParams(window.location.search).get("next");
            if (nextPath) {
                router.replace(nextPath);
                return;
            }

            const myShop = await getMySellerShop();
            router.replace(myShop ? "/" : "/onboarding");
        } catch (error) {
            const fallbackMessage = "Đăng nhập thất bại. Vui lòng thử lại.";
            if (isApiRequestError(error)) {
                setErrorMessage(error.message || fallbackMessage);
            } else {
                setErrorMessage(fallbackMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {
        const loginUrl = buildSellerGoogleLoginUrl();
        window.location.href = loginUrl;
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div>
                <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
                    Đăng nhập Người bán
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Chào mừng bạn trở lại. Hãy quản lý cửa hàng của mình ngay hôm nay.
                </p>
            </div>

            <div className="mt-8 grid gap-4">
                <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                        Email
                    </label>
                    <div className="relative">
                        <Mail
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                        />
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="example@company.com"
                            className="h-11 border-slate-200 pl-9"
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                            Mật khẩu
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-xs font-semibold text-blue-600 hover:text-blue-500"
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                        />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="h-11 border-slate-200 pl-9 pr-10"
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-500">
                    <input
                        type="checkbox"
                        className="size-4 rounded border-slate-300 text-blue-600"
                        checked={rememberLogin}
                        onChange={(event) => setRememberLogin(event.target.checked)}
                    />
                    Ghi nhớ đăng nhập
                </label>

                <Button
                    type="button"
                    variant="default"
                    className="mt-1 h-11 rounded-lg bg-blue-500 text-sm font-semibold text-white hover:bg-blue-500/90"
                    onClick={handleSubmit}
                    disabled={!canSubmit || isSubmitting}
                >
                    {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>

                {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
            </div>

            <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                <span>Hoặc đăng nhập với</span>
                <span className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-lg border-slate-200 bg-white text-sm font-semibold text-slate-700"
                    onClick={handleGoogleLogin}
                >
                    Google
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-lg border-slate-200 bg-white text-sm font-semibold text-slate-700"
                >
                    Facebook
                </Button>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
                Bạn là đối tác mới?{" "}
                <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500">
                    Đăng ký ngay
                </Link>
            </p>
        </div>
    );
}
