"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { LOGIN_ROUTE } from "@/lib/auth-routes";
import { forgotPassword } from "@/services/auth-service";
import { toFriendlyErrorMessage } from "@/lib/toast-messages";

export function ForgotPasswordFormCard() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const canSubmit = useMemo(
        () => email.trim().length > 0 && !isSubmitting,
        [email, isSubmitting],
    );

    const handleSubmit = async () => {
        if (!canSubmit) {
            return;
        }

        setIsSubmitting(true);

        try {
            await forgotPassword({ email: email.trim().toLowerCase() });
            setIsSubmitted(true);
            toast.success("Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.");
        } catch (error) {
            toast.error(
                toFriendlyErrorMessage(error, "Không thể gửi yêu cầu lúc này. Vui lòng thử lại."),
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="mx-auto w-full max-w-120 border-gray-100 bg-white shadow-[0_0_56px_0_rgba(0,38,3,0.08)]">
            <CardHeader className="pb-1 text-center">
                <CardTitle className="text-[32px] font-semibold leading-[1.2] text-gray-900">
                    Quên mật khẩu
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <p className="text-center text-sm text-gray-600">
                    Nhập email của bạn, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
                </p>

                <Input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="Email"
                    className="h-12 rounded-md border-gray-200 px-4 text-base text-gray-700 placeholder:text-gray-400"
                    onChange={(event) => setEmail(event.target.value)}
                />

                <Button
                    type="button"
                    className="h-12 rounded-full bg-success text-sm font-semibold text-success-foreground hover:bg-success-dark"
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                >
                    {isSubmitting ? "Đang gửi..." : "Gửi liên kết"}
                </Button>

                {isSubmitted ? (
                    <p className="text-center text-sm text-emerald-700">
                        Kiểm tra hộp thư đến và spam để tiếp tục.
                    </p>
                ) : null}

                <p className="text-center text-sm text-gray-600">
                    <Link href={LOGIN_ROUTE} className="font-semibold text-gray-900">
                        Quay lại đăng nhập
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
