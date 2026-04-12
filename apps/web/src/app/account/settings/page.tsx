"use client";

import type {
    CreateAddressRequest,
    UpdateAddressRequest,
    UpdateProfileRequest,
    UserAddress,
} from "@repo/shared-types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { toFriendlyErrorMessage } from "@/lib/toast-messages";
import {
    createMyAddress,
    getMyAddresses,
    updateMyAddress,
    updateMyProfile,
} from "@/services/users-service";
import { AccountPageHeader } from "../_components/account-page-header";
import { BillingAddressForm } from "./_components/billing-address-form";
import { ChangePasswordForm } from "./_components/change-password-form";
import { ProfileSettingsForm } from "./_components/profile-settings-form";

function normalizeAddressInput(value: string): string | undefined {
    const nextValue = value.trim();
    return nextValue.length > 0 ? nextValue : undefined;
}

export default function AccountSettingsPage() {
    const { user, refreshProfile, isInitializing: isAuthInitializing } = useAuth();
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [addresses, setAddresses] = useState<UserAddress[]>([]);

    useEffect(() => {
        let isActive = true;

        const loadAddresses = async () => {
            setIsLoadingAddresses(true);

            try {
                const response = await getMyAddresses();
                if (!isActive) {
                    return;
                }

                setAddresses(response.addresses);
            } catch (error) {
                if (!isActive) {
                    return;
                }

                toast.error(toFriendlyErrorMessage(error, "Không thể tải địa chỉ của bạn."));
            } finally {
                if (isActive) {
                    setIsLoadingAddresses(false);
                }
            }
        };

        void loadAddresses();

        return () => {
            isActive = false;
        };
    }, []);

    const defaultAddress = useMemo(() => {
        if (addresses.length === 0) {
            return null;
        }

        return addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;
    }, [addresses]);

    const refreshAddresses = async () => {
        const response = await getMyAddresses();
        setAddresses(response.addresses);
    };

    const handleSaveProfile = async (values: { fullName: string; phone: string }) => {
        if (!user) {
            toast.error("Không tìm thấy thông tin người dùng.");
            return;
        }

        const payload: UpdateProfileRequest = {};
        const nextName = values.fullName.trim();
        const nextPhone = values.phone.trim();

        if (nextName.length < 2) {
            toast.error("Họ tên phải có ít nhất 2 ký tự.");
            return;
        }

        if (nextName !== user.fullName) {
            payload.fullName = nextName;
        }

        if (nextPhone !== (user.phone ?? "")) {
            payload.phone = nextPhone;
        }

        if (!payload.fullName && payload.phone === undefined) {
            toast.info("Không có thay đổi nào để lưu.");
            return;
        }

        setIsSavingProfile(true);

        try {
            await updateMyProfile(payload);
            await refreshProfile();
            toast.success("Cập nhật thông tin tài khoản thành công.");
        } catch (error) {
            toast.error(toFriendlyErrorMessage(error, "Không thể cập nhật hồ sơ."));
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleSaveAddress = async (values: {
        recipientName: string;
        recipientPhone: string;
        streetAddress: string;
        wardDistrict: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    }) => {
        const normalizedRecipientName = values.recipientName.trim();
        const normalizedRecipientPhone = values.recipientPhone.trim();
        const normalizedStreetAddress = values.streetAddress.trim();
        const normalizedCity = values.city.trim();
        const normalizedState = values.state.trim();
        const normalizedPostalCode = values.postalCode.trim();
        const normalizedCountry = values.country.trim();

        if (
            normalizedRecipientName.length < 2 ||
            normalizedRecipientPhone.length === 0 ||
            normalizedStreetAddress.length < 5 ||
            normalizedCity.length === 0 ||
            normalizedState.length === 0 ||
            normalizedPostalCode.length === 0 ||
            normalizedCountry.length === 0
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin địa chỉ hợp lệ.");
            return;
        }

        setIsSavingAddress(true);

        try {
            if (defaultAddress) {
                const payload: UpdateAddressRequest = {
                    recipientName: normalizedRecipientName,
                    recipientPhone: normalizedRecipientPhone,
                    streetAddress: normalizedStreetAddress,
                    wardDistrict: normalizeAddressInput(values.wardDistrict),
                    city: normalizedCity,
                    state: normalizedState,
                    postalCode: normalizedPostalCode,
                    country: normalizedCountry,
                    isDefault: true,
                };

                await updateMyAddress(defaultAddress.id, payload);
            } else {
                const payload: CreateAddressRequest = {
                    type: "HOME",
                    recipientName: normalizedRecipientName,
                    recipientPhone: normalizedRecipientPhone,
                    streetAddress: normalizedStreetAddress,
                    wardDistrict: normalizeAddressInput(values.wardDistrict),
                    city: normalizedCity,
                    state: normalizedState,
                    postalCode: normalizedPostalCode,
                    country: normalizedCountry,
                    isDefault: true,
                };

                await createMyAddress(payload);
            }

            await refreshAddresses();
            toast.success("Cập nhật địa chỉ thành công.");
        } catch (error) {
            toast.error(toFriendlyErrorMessage(error, "Không thể cập nhật địa chỉ."));
        } finally {
            setIsSavingAddress(false);
        }
    };

    return (
        <>
            <AccountPageHeader
                title="Account Settings"
                description="Quản lý thông tin cá nhân, địa chỉ thanh toán và bảo mật tài khoản."
            />

            {isAuthInitializing ? (
                <section className="h-60 animate-pulse rounded-2xl border border-gray-200 bg-white" />
            ) : null}

            {!isAuthInitializing ? (
                <>
                    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                        <h2 className="text-base font-semibold text-gray-900">Profile Settings</h2>
                        <div className="mt-4">
                            <ProfileSettingsForm
                                email={user?.email}
                                fullName={user?.fullName}
                                phone={user?.phone}
                                isSubmitting={isSavingProfile}
                                onSubmit={handleSaveProfile}
                            />
                        </div>
                    </section>

                    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                        <h2 className="text-base font-semibold text-gray-900">Billing Address</h2>
                        <div className="mt-4">
                            <BillingAddressForm
                                address={defaultAddress}
                                isSubmitting={isSavingAddress || isLoadingAddresses}
                                onSubmit={handleSaveAddress}
                            />
                        </div>
                    </section>

                    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                        <h2 className="text-base font-semibold text-gray-900">Change Password</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Form này đã sẵn sàng UI và validation, API sẽ được tích hợp ở phase tiếp
                            theo.
                        </p>
                        <div className="mt-4">
                            <ChangePasswordForm />
                        </div>
                    </section>
                </>
            ) : null}
        </>
    );
}
