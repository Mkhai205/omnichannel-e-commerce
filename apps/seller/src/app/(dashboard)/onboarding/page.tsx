"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@repo/ui";
import { isApiRequestError } from "@/services/http-client";
import { createOnboardingShop, getMySellerShop } from "@/services/seller-shop-service";

export default function SellerOnboardingPage() {
    const router = useRouter();
    const [shopName, setShopName] = useState("");
    const [description, setDescription] = useState("");
    const [businessLicense, setBusinessLicense] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const cachedStoreName = window.sessionStorage.getItem("seller_onboarding_store_name");

        if (cachedStoreName) {
            setShopName(cachedStoreName);
        }

        let isMounted = true;
        const checkExistingShop = async () => {
            const shop = await getMySellerShop();
            if (shop && isMounted) {
                router.replace("/");
            }
        };

        void checkExistingShop();

        return () => {
            isMounted = false;
        };
    }, [router]);

    const canSubmit = useMemo(() => {
        return shopName.trim().length >= 3 && !isSubmitting;
    }, [isSubmitting, shopName]);

    const handleSubmit = async () => {
        if (!canSubmit) {
            return;
        }

        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            await createOnboardingShop({
                shopName: shopName.trim(),
                description: description.trim() || undefined,
                businessLicense: businessLicense.trim() || undefined,
            });

            window.sessionStorage.removeItem("seller_onboarding_store_name");
            router.replace("/");
        } catch (error) {
            const fallbackMessage = "Không thể tạo hồ sơ cửa hàng lúc này. Vui lòng thử lại.";
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
        <section className="mx-auto w-full max-w-2xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <h1 className="text-2xl font-semibold text-slate-900">
                    Hoàn tất thiết lập người bán
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                    Bạn cần tạo thông tin cửa hàng trước khi truy cập các tính năng vận hành.
                </p>

                <div className="mt-6 grid gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="shop-name" className="text-sm font-medium text-slate-700">
                            Tên cửa hàng
                        </label>
                        <Input
                            id="shop-name"
                            value={shopName}
                            onChange={(event) => setShopName(event.target.value)}
                            placeholder="Cửa hàng chính hãng"
                            className="h-11 border-slate-200"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label
                            htmlFor="shop-description"
                            className="text-sm font-medium text-slate-700"
                        >
                            Mô tả cửa hàng (tùy chọn)
                        </label>
                        <textarea
                            id="shop-description"
                            rows={4}
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Giới thiệu ngắn gọn về cửa hàng của bạn"
                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label
                            htmlFor="business-license"
                            className="text-sm font-medium text-slate-700"
                        >
                            Giấy phép kinh doanh (tùy chọn)
                        </label>
                        <Input
                            id="business-license"
                            value={businessLicense}
                            onChange={(event) => setBusinessLicense(event.target.value)}
                            placeholder="Số hoặc đường dẫn giấy phép kinh doanh"
                            className="h-11 border-slate-200"
                        />
                    </div>

                    <Button
                        type="button"
                        className="h-11 bg-blue-600 text-white hover:bg-blue-500"
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? "Đang tạo cửa hàng..." : "Hoàn tất thiết lập"}
                    </Button>

                    {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
                </div>
            </div>
        </section>
    );
}
