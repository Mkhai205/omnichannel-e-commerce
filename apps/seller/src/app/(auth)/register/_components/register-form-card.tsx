"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@repo/ui";
import { Eye, EyeOff } from "lucide-react";
import { logoutSeller, registerSeller } from "@/services/auth-service";
import { isApiRequestError } from "@/services/http-client";

type RegisterFormState = {
    fullName: string;
    phoneNumber: string;
    businessEmail: string;
    storeName: string;
    password: string;
    acceptedTerms: boolean;
};

const INITIAL_REGISTER_FORM: RegisterFormState = {
    fullName: "",
    phoneNumber: "",
    businessEmail: "",
    storeName: "",
    password: "",
    acceptedTerms: false,
};

export function RegisterFormCard() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState(INITIAL_REGISTER_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const canSubmit = useMemo(() => {
        return (
            form.fullName.trim().length > 0 &&
            form.phoneNumber.trim().length > 0 &&
            form.businessEmail.trim().length > 0 &&
            form.storeName.trim().length > 0 &&
            form.password.trim().length > 0 &&
            form.acceptedTerms
        );
    }, [form]);

    const handleSubmit = async () => {
        if (!canSubmit || isSubmitting) {
            return;
        }

        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            await registerSeller({
                fullName: form.fullName.trim(),
                phone: form.phoneNumber.trim() || undefined,
                email: form.businessEmail.trim().toLowerCase(),
                password: form.password,
            });

            await logoutSeller();

            window.sessionStorage.setItem("seller_onboarding_store_name", form.storeName.trim());

            router.replace(`/verify-email?email=${encodeURIComponent(form.businessEmail.trim())}`);
        } catch (error) {
            const fallbackMessage = "Đăng ký thất bại. Vui lòng thử lại.";
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
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900 lg:text-4xl">
                    Tạo tài khoản mới
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-slate-600">
                    Bắt đầu hành trình kinh doanh chuyên nghiệp ngay hôm nay.
                </p>
            </div>

            <div className="mt-6 flex flex-col gap-3.5">
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="full-name"
                        className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500"
                    >
                        Họ và tên
                    </label>
                    <Input
                        id="full-name"
                        type="text"
                        value={form.fullName}
                        placeholder="Nguyễn Văn A"
                        onChange={(event) =>
                            setForm((prev) => ({ ...prev, fullName: event.target.value }))
                        }
                        className="h-11 border-slate-200 text-sm"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="phone-number"
                        className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500"
                    >
                        Số điện thoại
                    </label>
                    <Input
                        id="phone-number"
                        type="tel"
                        value={form.phoneNumber}
                        placeholder="090 123 4567"
                        onChange={(event) =>
                            setForm((prev) => ({ ...prev, phoneNumber: event.target.value }))
                        }
                        className="h-11 border-slate-200 text-sm"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="business-email"
                        className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500"
                    >
                        Email doanh nghiệp
                    </label>
                    <Input
                        id="business-email"
                        type="email"
                        value={form.businessEmail}
                        placeholder="contact@shopname.com"
                        onChange={(event) =>
                            setForm((prev) => ({ ...prev, businessEmail: event.target.value }))
                        }
                        className="h-11 border-slate-200 text-sm"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="store-name"
                        className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500"
                    >
                        Tên cửa hàng
                    </label>
                    <Input
                        id="store-name"
                        type="text"
                        value={form.storeName}
                        placeholder="Merchant Official Store"
                        onChange={(event) =>
                            setForm((prev) => ({ ...prev, storeName: event.target.value }))
                        }
                        className="h-11 border-slate-200 text-sm"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="password"
                        className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500"
                    >
                        Mật khẩu
                    </label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            placeholder="••••••••"
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, password: event.target.value }))
                            }
                            className="h-11 border-slate-200 pr-11 text-sm"
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

                <label className="mt-1 flex items-start gap-2 text-xs leading-relaxed text-slate-500 lg:text-sm">
                    <input
                        type="checkbox"
                        checked={form.acceptedTerms}
                        onChange={(event) =>
                            setForm((prev) => ({ ...prev, acceptedTerms: event.target.checked }))
                        }
                        className="mt-1 size-4 rounded border-slate-300 text-blue-600"
                    />
                    <span>
                        Tôi đồng ý với các{" "}
                        <Link href="#" className="font-semibold text-blue-700 hover:text-blue-600">
                            Điều khoản dịch vụ
                        </Link>{" "}
                        và{" "}
                        <Link href="#" className="font-semibold text-blue-700 hover:text-blue-600">
                            Chính sách bảo mật
                        </Link>
                        .
                    </span>
                </label>

                <Button
                    type="button"
                    variant="default"
                    className="mt-2 h-11 rounded-lg bg-blue-500 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:bg-blue-500/90 disabled:bg-blue-500 disabled:text-white disabled:opacity-100 lg:text-sm"
                    disabled={!canSubmit || isSubmitting}
                    onClick={handleSubmit}
                >
                    {isSubmitting ? "Đang xử lý..." : "Tạo tài khoản bán hàng"}
                </Button>

                {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}

                <p className="text-center text-sm text-slate-500">
                    Đã có tài khoản?{" "}
                    <Link href="/login" className="font-semibold text-blue-700 hover:text-blue-600">
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>
        </section>
    );
}
