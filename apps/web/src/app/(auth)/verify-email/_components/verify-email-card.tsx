"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { LOGIN_ROUTE } from "@/lib/auth-routes";
import { verifyEmail } from "@/services/auth-service";
import { toFriendlyErrorMessage } from "@/lib/toast-messages";

export function VerifyEmailCard() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token")?.trim() ?? "";
    const email = searchParams.get("email")?.trim() ?? "";

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
        token ? "loading" : "idle",
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            return;
        }

        let isActive = true;

        const executeVerify = async () => {
            try {
                await verifyEmail({ token });
                if (isActive) {
                    setStatus("success");
                }
            } catch (error) {
                if (!isActive) {
                    return;
                }

                setStatus("error");
                setErrorMessage(
                    toFriendlyErrorMessage(error, "Xác minh email thất bại hoặc token đã hết hạn."),
                );
            }
        };

        void executeVerify();

        return () => {
            isActive = false;
        };
    }, [token]);

    const title = useMemo(() => {
        if (status === "loading") {
            return "Đang xác minh email...";
        }

        if (status === "success") {
            return "Email đã được xác minh";
        }

        if (status === "error") {
            return "Không thể xác minh email";
        }

        return "Xác minh email";
    }, [status]);

    return (
        <Card className="mx-auto w-full max-w-120 border-gray-100 bg-white shadow-[0_0_56px_0_rgba(0,38,3,0.08)]">
            <CardHeader className="pb-1 text-center">
                <CardTitle className="text-[32px] font-semibold leading-[1.2] text-gray-900">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                {status === "idle" ? (
                    <p className="text-center text-sm text-gray-600">
                        Chúng tôi đã gửi email xác minh{email ? ` đến ${email}` : ""}. Vui lòng mở
                        hộp thư và bấm vào liên kết xác minh.
                    </p>
                ) : null}

                {status === "loading" ? (
                    <p className="text-center text-sm text-gray-600">
                        Hệ thống đang xử lý liên kết xác minh của bạn.
                    </p>
                ) : null}

                {status === "success" ? (
                    <p className="text-center text-sm text-emerald-700">
                        Bạn có thể đăng nhập để tiếp tục mua sắm.
                    </p>
                ) : null}

                {status === "error" ? (
                    <p className="text-center text-sm text-rose-600">
                        {errorMessage ?? "Liên kết không hợp lệ hoặc đã hết hạn."}
                    </p>
                ) : null}

                <p className="text-center text-sm text-gray-600">
                    <Link href={LOGIN_ROUTE} className="font-semibold text-gray-900">
                        Đi đến trang đăng nhập
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
