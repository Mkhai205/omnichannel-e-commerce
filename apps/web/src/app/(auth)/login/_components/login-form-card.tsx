"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Input } from "@/components/ui";
import { useAuth } from "@/contexts/auth-context";
import { toFriendlyErrorMessage } from "@/lib/toast-messages";

function resolveSafeNextPath(candidate: string | null): string | null {
    if (!candidate || candidate.length === 0) {
        return null;
    }

    if (!candidate.startsWith("/") || candidate.startsWith("//")) {
        return null;
    }

    return candidate;
}

export function LoginFormCard() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canSubmit = useMemo(
        () => email.trim().length > 0 && password.trim().length > 0,
        [email, password],
    );

    const handleSubmit = async () => {
        if (!canSubmit || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            await login({
                email: email.trim().toLowerCase(),
                password,
            });

            toast.success("Đăng nhập thành công.");

            const nextPath = resolveSafeNextPath(searchParams.get("next"));
            router.replace(nextPath ?? "/");
        } catch (error) {
            toast.error(toFriendlyErrorMessage(error, "Đăng nhập thất bại. Vui lòng thử lại."));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="mx-auto w-full max-w-120 border-gray-100 bg-white shadow-[0_0_56px_0_rgba(0,38,3,0.08)]">
            <CardHeader className="pb-1 text-center">
                <CardTitle className="text-[32px] font-semibold leading-[1.2] text-gray-900">
                    Đăng nhập
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-3">
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        placeholder="Email"
                        className="h-12 rounded-md border-gray-200 px-4 text-base text-gray-700 placeholder:text-gray-400"
                        onChange={(event) => setEmail(event.target.value)}
                    />

                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            placeholder="Mật khẩu"
                            className="h-12 rounded-md border-gray-200 px-4 pr-11 text-base text-gray-700 placeholder:text-gray-400"
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                            {showPassword ? (
                                <EyeOffIcon className="size-4" />
                            ) : (
                                <EyeIcon className="size-4" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm text-gray-600">
                    <label htmlFor="remember-me" className="inline-flex items-center gap-2">
                        <Checkbox
                            id="remember-me"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                        />
                        <span>Ghi nhớ đăng nhập</span>
                    </label>
                    <Link href="#" className="hover:text-gray-900">
                        Quên mật khẩu
                    </Link>
                </div>

                <Button
                    type="button"
                    className="h-12 rounded-full bg-success text-sm font-semibold text-success-foreground hover:bg-success-dark"
                    disabled={!canSubmit || isSubmitting}
                    onClick={handleSubmit}
                >
                    {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>

                <p className="pt-1 text-center text-sm text-gray-600">
                    Chưa có tài khoản?{" "}
                    <Link href="/register" className="font-semibold text-gray-900">
                        Đăng ký
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
