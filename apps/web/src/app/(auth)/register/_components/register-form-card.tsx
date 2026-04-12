"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Input } from "@/components/ui";
import { VERIFY_EMAIL_ROUTE } from "@/lib/auth-routes";
import { useAuth } from "@/contexts/auth-context";
import { toFriendlyErrorMessage } from "@/lib/toast-messages";
import Image from "next/image";
import { buildCustomerGoogleLoginUrl } from "@/services/auth-service";

function deriveFullNameFromEmail(email: string): string {
    const localPart = email.split("@")[0] ?? "";
    const normalized = localPart
        .replace(/[._-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (normalized.length >= 2) {
        return normalized
            .split(" ")
            .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
            .join(" ");
    }

    return "Khách hàng";
}

export function RegisterFormCard() {
    const router = useRouter();
    const { register } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canSubmit = useMemo(
        () =>
            email.trim().length > 0 &&
            password.trim().length >= 8 &&
            confirmPassword.trim().length >= 8 &&
            acceptedTerms,
        [acceptedTerms, confirmPassword, email, password],
    );

    const handleGoogleLogin = () => {
        window.location.href = buildCustomerGoogleLoginUrl();
    };

    const handleSubmit = async () => {
        if (!canSubmit || isSubmitting) {
            return;
        }

        if (password !== confirmPassword) {
            toast.warning("Mật khẩu xác nhận không khớp.");
            return;
        }

        setIsSubmitting(true);

        try {
            await register({
                email: email.trim().toLowerCase(),
                password,
                fullName: deriveFullNameFromEmail(email),
            });

            toast.success("Tạo tài khoản thành công. Vui lòng xác minh email để tiếp tục.");

            router.replace(
                `${VERIFY_EMAIL_ROUTE}?email=${encodeURIComponent(email.trim().toLowerCase())}`,
            );
        } catch (error) {
            toast.error(toFriendlyErrorMessage(error, "Tạo tài khoản thất bại. Vui lòng thử lại."));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="mx-auto w-full max-w-120 border-gray-100 bg-white shadow-[0_0_56px_0_rgba(0,38,3,0.08)]">
            <CardHeader className="pb-1 text-center">
                <CardTitle className="text-[32px] font-semibold leading-[1.2] text-gray-900">
                    Tạo tài khoản
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

                    <div className="relative">
                        <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            placeholder="Xác nhận mật khẩu"
                            className="h-12 rounded-md border-gray-200 px-4 pr-11 text-base text-gray-700 placeholder:text-gray-400"
                            onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            aria-label={
                                showConfirmPassword
                                    ? "Ẩn mật khẩu xác nhận"
                                    : "Hiện mật khẩu xác nhận"
                            }
                        >
                            {showConfirmPassword ? (
                                <EyeOffIcon className="size-4" />
                            ) : (
                                <EyeIcon className="size-4" />
                            )}
                        </button>
                    </div>
                </div>

                <label
                    htmlFor="accepted-terms"
                    className="inline-flex items-start gap-2 text-sm text-gray-600"
                >
                    <Checkbox
                        id="accepted-terms"
                        checked={acceptedTerms}
                        onCheckedChange={(checked) => setAcceptedTerms(Boolean(checked))}
                    />
                    <span>Đồng ý tất cả điều khoản và điều kiện</span>
                </label>

                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.08em] text-gray-400">
                    <span className="h-px flex-1 bg-gray-200" />
                    <span>Hoặc tiếp tục với</span>
                    <span className="h-px flex-1 bg-gray-200" />
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-full border-gray-200 text-sm font-semibold text-gray-700"
                    onClick={handleGoogleLogin}
                >
                    <Image src="/icon/google.svg" alt="Google" width={18} height={18} />
                    Đăng nhập với Google
                </Button>

                <Button
                    type="button"
                    className="h-12 rounded-full bg-success text-sm font-semibold text-success-foreground hover:bg-success-dark"
                    disabled={!canSubmit || isSubmitting}
                    onClick={handleSubmit}
                >
                    {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                </Button>

                <p className="pt-1 text-center text-sm text-gray-600">
                    Đã có tài khoản?{" "}
                    <Link href="/login" className="font-semibold text-gray-900">
                        Đăng nhập
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
