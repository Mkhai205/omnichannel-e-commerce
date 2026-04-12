"use client";

import type { UserAddress } from "@repo/shared-types";
import { useEffect, useState } from "react";
import { Button, Input, Label } from "@/components/ui";

type BillingAddressFormValues = {
    recipientName: string;
    recipientPhone: string;
    streetAddress: string;
    wardDistrict: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
};

type BillingAddressFormProps = {
    address: UserAddress | null;
    isSubmitting: boolean;
    onSubmit: (values: BillingAddressFormValues) => Promise<void>;
};

export function BillingAddressForm({ address, isSubmitting, onSubmit }: BillingAddressFormProps) {
    const [formValues, setFormValues] = useState<BillingAddressFormValues>({
        recipientName: "",
        recipientPhone: "",
        streetAddress: "",
        wardDistrict: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Vietnam",
    });

    useEffect(() => {
        setFormValues({
            recipientName: address?.recipientName ?? "",
            recipientPhone: address?.recipientPhone ?? "",
            streetAddress: address?.streetAddress ?? "",
            wardDistrict: address?.wardDistrict ?? "",
            city: address?.city ?? "",
            state: address?.state ?? "",
            postalCode: address?.postalCode ?? "",
            country: address?.country ?? "Vietnam",
        });
    }, [address]);

    const updateField = (field: keyof BillingAddressFormValues, value: string) => {
        setFormValues((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    return (
        <form
            className="space-y-4"
            onSubmit={(event) => {
                event.preventDefault();
                void onSubmit(formValues);
            }}
        >
            <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="address-recipient-name">Người nhận</Label>
                    <Input
                        id="address-recipient-name"
                        value={formValues.recipientName}
                        onChange={(event) => updateField("recipientName", event.target.value)}
                        disabled={isSubmitting}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="address-recipient-phone">Số điện thoại</Label>
                    <Input
                        id="address-recipient-phone"
                        value={formValues.recipientPhone}
                        onChange={(event) => updateField("recipientPhone", event.target.value)}
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="address-street">Địa chỉ</Label>
                <Input
                    id="address-street"
                    value={formValues.streetAddress}
                    onChange={(event) => updateField("streetAddress", event.target.value)}
                    disabled={isSubmitting}
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="address-ward">Phường/Xã</Label>
                <Input
                    id="address-ward"
                    value={formValues.wardDistrict}
                    onChange={(event) => updateField("wardDistrict", event.target.value)}
                    disabled={isSubmitting}
                />
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-1.5">
                    <Label htmlFor="address-city">Thành phố</Label>
                    <Input
                        id="address-city"
                        value={formValues.city}
                        onChange={(event) => updateField("city", event.target.value)}
                        disabled={isSubmitting}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="address-state">Tỉnh/Bang</Label>
                    <Input
                        id="address-state"
                        value={formValues.state}
                        onChange={(event) => updateField("state", event.target.value)}
                        disabled={isSubmitting}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="address-postal">Mã bưu chính</Label>
                    <Input
                        id="address-postal"
                        value={formValues.postalCode}
                        onChange={(event) => updateField("postalCode", event.target.value)}
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="address-country">Quốc gia</Label>
                <Input
                    id="address-country"
                    value={formValues.country}
                    onChange={(event) => updateField("country", event.target.value)}
                    disabled={isSubmitting}
                />
            </div>

            <Button
                type="submit"
                className="bg-success text-success-foreground hover:bg-success-dark"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Đang lưu..." : "Save Changes"}
            </Button>
        </form>
    );
}
