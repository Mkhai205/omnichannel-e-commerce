"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

type ProductImagePanelProps = {
    imageUrl?: string | null;
    imageKey?: string | null;
    isCreateMode: boolean;
    isUploading: boolean;
    disabled?: boolean;
    onUpload: (file: File) => Promise<void>;
};

const PRODUCT_IMAGE_FALLBACK_URL = "/products/image.webp";

export function ProductImagePanel({
    imageUrl,
    imageKey,
    isCreateMode,
    isUploading,
    disabled,
    onUpload,
}: ProductImagePanelProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const previewUrl =
        imageUrl && imageUrl.trim().length > 0 ? imageUrl : PRODUCT_IMAGE_FALLBACK_URL;
    const isUploadDisabled = disabled || isUploading || isCreateMode;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Ảnh sản phẩm</CardTitle>
                <CardDescription>
                    {isCreateMode
                        ? "Tạo sản phẩm trước, sau đó tải ảnh đại diện."
                        : "Hỗ trợ JPEG, PNG, WEBP, GIF (tối đa 5MB)."}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                    <Image
                        src={previewUrl}
                        alt="Ảnh sản phẩm"
                        width={720}
                        height={720}
                        unoptimized
                        className="aspect-square h-auto w-full object-cover"
                    />
                </div>

                <div className="space-y-1 text-xs text-slate-500">
                    <p>{imageKey ? `Image key: ${imageKey}` : "Chưa có ảnh được tải lên."}</p>
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(event) => {
                        const [file] = Array.from(event.target.files ?? []);
                        event.currentTarget.value = "";

                        if (!file || isUploadDisabled) {
                            return;
                        }

                        void onUpload(file);
                    }}
                />

                <Button
                    type="button"
                    variant="outline"
                    disabled={Boolean(isUploadDisabled)}
                    onClick={() => inputRef.current?.click()}
                >
                    {isUploading ? "Đang tải ảnh..." : "Tải ảnh sản phẩm"}
                </Button>
            </CardContent>
        </Card>
    );
}
