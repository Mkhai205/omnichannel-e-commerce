"use client";

import { useEffect, useState } from "react";
import { Button, Input, Label } from "@/components/ui";

type ProfileSettingsFormProps = {
    email?: string;
    fullName?: string;
    phone?: string | null;
    isSubmitting: boolean;
    onSubmit: (payload: { fullName: string; phone: string }) => Promise<void>;
};

export function ProfileSettingsForm({
    email,
    fullName,
    phone,
    isSubmitting,
    onSubmit,
}: ProfileSettingsFormProps) {
    const [nextFullName, setNextFullName] = useState(fullName ?? "");
    const [nextPhone, setNextPhone] = useState(phone ?? "");

    useEffect(() => {
        setNextFullName(fullName ?? "");
        setNextPhone(phone ?? "");
    }, [fullName, phone]);

    return (
        <form
            className="space-y-4"
            onSubmit={(event) => {
                event.preventDefault();
                void onSubmit({
                    fullName: nextFullName,
                    phone: nextPhone,
                });
            }}
        >
            <div className="space-y-1.5">
                <Label htmlFor="profile-full-name">Họ tên</Label>
                <Input
                    id="profile-full-name"
                    value={nextFullName}
                    onChange={(event) => setNextFullName(event.target.value)}
                    placeholder="Nguyen Van A"
                    disabled={isSubmitting}
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="profile-email">Email</Label>
                <Input id="profile-email" value={email ?? ""} disabled readOnly />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="profile-phone">Số điện thoại</Label>
                <Input
                    id="profile-phone"
                    value={nextPhone}
                    onChange={(event) => setNextPhone(event.target.value)}
                    placeholder="+84909123456"
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
