"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { LOGIN_ROUTE } from "@/lib/auth-routes";
import { resetPassword } from "@/services/auth-service";
import { toFriendlyErrorMessage } from "@/lib/toast-messages";

export function ResetPasswordFormCard() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get("token")?.trim() ?? "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canSubmit = useMemo(() => {
        return (
            token.length > 0 &&
            password.trim().length >= 8 &&
            confirmPassword.trim().length >= 8 &&
            password === confirmPassword &&
            !isSubmitting
        );
    }, [confirmPassword, isSubmitting, password, token.length]);

    const handleSubmit = async () => {
        if (!canSubmit) {
            return;
        }

        setIsSubmitting(true);

        try {
            await resetPassword({ token, newPassword: password });
            toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
            router.replace(LOGIN_ROUTE);
        } catch (error) {
            toast.error(
                toFriendlyErrorMessage(error, "Đặt lại mật khẩu thất bại. Vui lòng thử lại."),
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token) {
        return (
            <Card className="mx-auto w-full max-w-120 border-gray-100 bg-white shadow-[0_0_56px_0_rgba(0,38,3,0.08)]">
                <CardHeader className="pb-1 text-center">
                    <CardTitle className="text-[32px] font-semibold leading-[1.2] text-gray-900">
                        Liên kết không hợp lệ
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <p className="text-center text-sm text-gray-600">
                        Liên kết đặt lại mật khẩu thiếu token hoặc đã hết hạn.
                    </p>
                    <p className="text-center text-sm text-gray-600">
                        <Link href="/forgot-password" className="font-semibold text-gray-900">
                            Gửi lại liên kết đặt mật khẩu
                        </Link>
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mx-auto w-full max-w-120 border-gray-100 bg-white shadow-[0_0_56px_0_rgba(0,38,3,0.08)]">
            <CardHeader className="pb-1 text-center">
                <CardTitle className="text-[32px] font-semibold leading-[1.2] text-gray-900">
                    Đặt lại mật khẩu
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
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

                <div className="relative">
                    <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        placeholder="Xác nhận mật khẩu mới"
                        className="h-12 rounded-md border-gray-200 px-4 pr-11 text-base text-gray-700 placeholder:text-gray-400"
                        onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                        {showConfirmPassword ? (
                            <EyeOffIcon className="size-4" />
                        ) : (
                            <EyeIcon className="size-4" />
                        )}
                    </button>
                </div>

                {password.length > 0 &&
                confirmPassword.length > 0 &&
                password !== confirmPassword ? (
                    <p className="text-sm text-rose-600">Mật khẩu xác nhận không khớp.</p>
                ) : null}

                <Button
                    type="button"
                    className="h-12 rounded-full bg-success text-sm font-semibold text-success-foreground hover:bg-success-dark"
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                >
                    {isSubmitting ? "Đang cập nhật..." : "Xác nhận"}
                </Button>

                <p className="text-center text-sm text-gray-600">
                    <Link href={LOGIN_ROUTE} className="font-semibold text-gray-900">
                        Quay lại đăng nhập
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
