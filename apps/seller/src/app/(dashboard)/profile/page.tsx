"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ShopDetail } from "@repo/shared-types";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { isApiRequestError } from "@/services/http-client";
import {
    getMySellerShop,
    updateMySellerShop,
    uploadMySellerShopAvatar,
    uploadMySellerShopCover,
} from "@/services/seller-shop-service";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function toFriendlyError(error: unknown, fallbackMessage: string): string {
    if (isApiRequestError(error)) {
        return error.message || fallbackMessage;
    }

    return fallbackMessage;
}

function normalizeOptionalValue(value: string): string | undefined {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
}

function validateImageFile(file: File): string | null {
    if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
        return "Định dạng ảnh không được hỗ trợ. Vui lòng dùng JPG, PNG, WebP hoặc GIF.";
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return "Ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.";
    }

    return null;
}

function areShopFieldsChanged(
    shop: ShopDetail | null,
    values: { shopName: string; description: string; businessLicense: string },
): boolean {
    if (!shop) {
        return false;
    }

    return (
        values.shopName.trim() !== shop.shopName ||
        values.description.trim() !== (shop.description ?? "") ||
        values.businessLicense.trim() !== (shop.businessLicense ?? "")
    );
}

export default function ProfilePage() {
    const avatarInputRef = useRef<HTMLInputElement | null>(null);
    const coverInputRef = useRef<HTMLInputElement | null>(null);

    const [shop, setShop] = useState<ShopDetail | null>(null);
    const [shopName, setShopName] = useState("");
    const [description, setDescription] = useState("");
    const [businessLicense, setBusinessLicense] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadShop = async () => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const currentShop = await getMySellerShop();

                if (!isMounted) {
                    return;
                }

                if (!currentShop) {
                    setShop(null);
                    setErrorMessage("Không tìm thấy cửa hàng. Vui lòng hoàn tất onboarding trước.");
                    return;
                }

                setShop(currentShop);
                setShopName(currentShop.shopName);
                setDescription(currentShop.description ?? "");
                setBusinessLicense(currentShop.businessLicense ?? "");
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setErrorMessage(
                    toFriendlyError(error, "Không thể tải thông tin cửa hàng. Vui lòng thử lại."),
                );
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadShop();

        return () => {
            isMounted = false;
        };
    }, []);

    const hasChanges = useMemo(() => {
        return areShopFieldsChanged(shop, {
            shopName,
            description,
            businessLicense,
        });
    }, [businessLicense, description, shop, shopName]);

    const handleSave = async () => {
        if (!shop || !hasChanges || isSaving) {
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const updatedShop = await updateMySellerShop({
                shopName: shopName.trim(),
                description: normalizeOptionalValue(description),
                businessLicense: normalizeOptionalValue(businessLicense),
            });

            setShop(updatedShop);
            setShopName(updatedShop.shopName);
            setDescription(updatedShop.description ?? "");
            setBusinessLicense(updatedShop.businessLicense ?? "");
            setSuccessMessage("Đã cập nhật thông tin cửa hàng.");
        } catch (error) {
            setErrorMessage(toFriendlyError(error, "Không thể cập nhật thông tin cửa hàng."));
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file || !shop) {
            return;
        }

        const validationMessage = validateImageFile(file);
        if (validationMessage) {
            setErrorMessage(validationMessage);
            setSuccessMessage(null);
            return;
        }

        setIsUploadingAvatar(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const uploadResult = await uploadMySellerShopAvatar(file);
            const updatedShop = await updateMySellerShop({ avatarKey: uploadResult.objectKey });
            setShop(updatedShop);
            setSuccessMessage("Đã cập nhật ảnh đại diện cửa hàng.");
        } catch (error) {
            setErrorMessage(toFriendlyError(error, "Không thể tải ảnh đại diện."));
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file || !shop) {
            return;
        }

        const validationMessage = validateImageFile(file);
        if (validationMessage) {
            setErrorMessage(validationMessage);
            setSuccessMessage(null);
            return;
        }

        setIsUploadingCover(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const uploadResult = await uploadMySellerShopCover(file);
            const updatedShop = await updateMySellerShop({ coverKey: uploadResult.objectKey });
            setShop(updatedShop);
            setSuccessMessage("Đã cập nhật ảnh bìa cửa hàng.");
        } catch (error) {
            setErrorMessage(toFriendlyError(error, "Không thể tải ảnh bìa."));
        } finally {
            setIsUploadingCover(false);
        }
    };

    if (isLoading) {
        return (
            <section className="mx-auto grid w-full max-w-5xl gap-6 pb-10">
                <Card className="border-slate-200">
                    <CardContent className="p-6 text-sm text-slate-600">
                        Đang tải thông tin cửa hàng...
                    </CardContent>
                </Card>
            </section>
        );
    }

    if (!shop) {
        return (
            <section className="mx-auto grid w-full max-w-5xl gap-6 pb-10">
                <Card className="border-slate-200">
                    <CardContent className="p-6 text-sm text-rose-600">
                        {errorMessage ?? "Không thể hiển thị thông tin cửa hàng."}
                    </CardContent>
                </Card>
            </section>
        );
    }

    const coverImageUrl = shop.coverUrl ?? "/products/background.png";
    const avatarImageUrl = shop.avatarUrl ?? "/products/avartar.png";

    return (
        <section className="mx-auto grid w-full max-w-5xl gap-6 pb-10">
            <Card className="overflow-hidden border-slate-200">
                <CardContent className="p-0">
                    <div className="relative h-56 w-full bg-slate-100 md:h-64">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={coverImageUrl}
                            alt="Ảnh bìa cửa hàng"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                        <div className="absolute right-4 top-4">
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                disabled={isUploadingCover}
                                onClick={() => coverInputRef.current?.click()}
                            >
                                {isUploadingCover ? "Đang tải ảnh bìa..." : "Đổi ảnh bìa"}
                            </Button>
                        </div>
                        <input
                            ref={coverInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="hidden"
                            onChange={handleCoverUpload}
                        />
                    </div>

                    <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div className="flex items-center gap-4">
                            <div className="size-20 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={avatarImageUrl}
                                    alt="Ảnh đại diện cửa hàng"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div>
                                <p className="text-lg font-semibold text-slate-900">
                                    {shop.shopName}
                                </p>
                                <p className="text-sm text-slate-500">Mã cửa hàng: {shop.slug}</p>
                                <p className="mt-1 text-xs font-medium text-blue-700">
                                    Trạng thái: {shop.status}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                className="hidden"
                                onChange={handleAvatarUpload}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isUploadingAvatar}
                                onClick={() => avatarInputRef.current?.click()}
                            >
                                {isUploadingAvatar ? "Đang tải avatar..." : "Đổi avatar"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-200">
                <CardHeader>
                    <CardTitle className="text-xl text-slate-800">Thông tin cửa hàng</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="shop-name" className="text-sm font-medium text-slate-700">
                            Tên cửa hàng
                        </label>
                        <Input
                            id="shop-name"
                            value={shopName}
                            onChange={(event) => setShopName(event.target.value)}
                            placeholder="Nhập tên cửa hàng"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label
                            htmlFor="shop-description"
                            className="text-sm font-medium text-slate-700"
                        >
                            Mô tả cửa hàng
                        </label>
                        <textarea
                            id="shop-description"
                            rows={4}
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Giới thiệu ngắn gọn về cửa hàng của bạn"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label
                            htmlFor="business-license"
                            className="text-sm font-medium text-slate-700"
                        >
                            Giấy phép kinh doanh
                        </label>
                        <Input
                            id="business-license"
                            value={businessLicense}
                            onChange={(event) => setBusinessLicense(event.target.value)}
                            placeholder="Số hoặc đường dẫn giấy phép kinh doanh"
                        />
                    </div>

                    {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
                    {successMessage ? (
                        <p className="text-sm text-emerald-600">{successMessage}</p>
                    ) : null}

                    <div className="flex justify-end pt-2">
                        <Button
                            type="button"
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            disabled={!hasChanges || isSaving}
                            onClick={handleSave}
                        >
                            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
