"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button, Input, Label } from "@/components/ui";

type ChangePasswordFormProps = {
    isDisabled?: boolean;
};

export function ChangePasswordForm({ isDisabled }: ChangePasswordFormProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = () => {
        if (newPassword.length < 8) {
            toast.error("Mật khẩu mới phải có ít nhất 8 ký tự.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Xác nhận mật khẩu không khớp.");
            return;
        }

        if (currentPassword.trim().length === 0) {
            toast.error("Vui lòng nhập mật khẩu hiện tại.");
            return;
        }

        toast.info("Tính năng đổi mật khẩu đang được hoàn thiện ở phase tiếp theo.");
    };

    return (
        <form
            className="space-y-4"
            onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
            }}
        >
            <div className="space-y-1.5">
                <Label htmlFor="password-current">Current Password</Label>
                <Input
                    id="password-current"
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    disabled={isDisabled}
                />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="password-new">New Password</Label>
                    <Input
                        id="password-new"
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        disabled={isDisabled}
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="password-confirm">Confirm Password</Label>
                    <Input
                        id="password-confirm"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        disabled={isDisabled}
                    />
                </div>
            </div>

            <Button
                type="submit"
                className="bg-success text-success-foreground hover:bg-success-dark"
                disabled={isDisabled}
            >
                Change Password
            </Button>
        </form>
    );
}
