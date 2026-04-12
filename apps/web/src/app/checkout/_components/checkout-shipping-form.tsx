import type { AddressType, CreateAddressRequest } from "@repo/shared-types";
import { useMemo, useState } from "react";
import {
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
    Checkbox,
} from "@/components/ui";

export type CheckoutSubmitPayload = {
    address: CreateAddressRequest;
    note?: string;
};

type CheckoutShippingFormProps = {
    initialFullName?: string | null;
    initialPhone?: string | null;
    initialEmail?: string;
    isSubmitting: boolean;
    onSubmit: (payload: CheckoutSubmitPayload) => Promise<void>;
};

type FormState = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    streetAddress: string;
    wardDistrict: string;
    city: string;
    postalCode: string;
    country: string;
    note: string;
    addressType: AddressType;
    setAsDefault: boolean;
};

function splitFullName(fullName?: string | null): { firstName: string; lastName: string } {
    const normalizedName = fullName?.trim() ?? "";

    if (!normalizedName) {
        return {
            firstName: "",
            lastName: "",
        };
    }

    const parts = normalizedName.split(/\s+/);

    if (parts.length === 1) {
        return {
            firstName: "",
            lastName: parts[0] ?? "",
        };
    }

    return {
        firstName: parts.slice(0, parts.length - 1).join(" "),
        lastName: parts.at(-1) ?? "",
    };
}

function isEmailValid(email: string): boolean {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
        return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
}

export function CheckoutShippingForm({
    initialFullName,
    initialPhone,
    initialEmail,
    isSubmitting,
    onSubmit,
}: CheckoutShippingFormProps) {
    const nameParts = useMemo(() => splitFullName(initialFullName), [initialFullName]);

    const [form, setForm] = useState<FormState>({
        firstName: nameParts.firstName,
        lastName: nameParts.lastName,
        email: initialEmail ?? "",
        phone: initialPhone ?? "",
        streetAddress: "",
        wardDistrict: "",
        city: "",
        postalCode: "",
        country: "Vietnam",
        note: "",
        addressType: "HOME",
        setAsDefault: true,
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prevForm) => ({
            ...prevForm,
            [key]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const firstName = form.firstName.trim();
        const lastName = form.lastName.trim();
        const recipientName = `${firstName} ${lastName}`.trim();
        const phone = form.phone.trim();
        const streetAddress = form.streetAddress.trim();
        const wardDistrict = form.wardDistrict.trim();
        const city = form.city.trim();
        const postalCode = form.postalCode.trim();
        const country = form.country.trim();

        if (!recipientName || recipientName.length < 2) {
            setErrorMessage("Vui lòng nhập đầy đủ họ tên người nhận.");
            return;
        }

        if (!isEmailValid(form.email)) {
            setErrorMessage("Email không hợp lệ.");
            return;
        }

        if (!phone) {
            setErrorMessage("Vui lòng nhập số điện thoại người nhận.");
            return;
        }

        if (!streetAddress || streetAddress.length < 5) {
            setErrorMessage("Vui lòng nhập địa chỉ cụ thể (ít nhất 5 ký tự).");
            return;
        }

        if (!city) {
            setErrorMessage("Vui lòng nhập thành phố hoặc tỉnh.");
            return;
        }

        if (!postalCode) {
            setErrorMessage("Vui lòng nhập mã bưu chính.");
            return;
        }

        if (!country) {
            setErrorMessage("Vui lòng nhập quốc gia.");
            return;
        }

        setErrorMessage(null);

        await onSubmit({
            address: {
                type: form.addressType,
                recipientName,
                recipientPhone: phone,
                streetAddress,
                wardDistrict: wardDistrict || undefined,
                city,
                state: city,
                postalCode,
                country,
                isDefault: form.setAsDefault,
            },
            note: form.note.trim() || undefined,
        });
    };

    return (
        <form id="checkout-shipping-form" className="space-y-5" onSubmit={handleSubmit}>
            <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">Thông tin giao hàng</h2>
                    <p className="text-sm text-primary">Nhập thông tin để tạo đơn hàng</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="checkout-first-name">Họ</Label>
                        <Input
                            id="checkout-first-name"
                            value={form.firstName}
                            disabled={isSubmitting}
                            onChange={(event) => setField("firstName", event.target.value)}
                            placeholder="Nguyễn"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="checkout-last-name">Tên</Label>
                        <Input
                            id="checkout-last-name"
                            value={form.lastName}
                            disabled={isSubmitting}
                            onChange={(event) => setField("lastName", event.target.value)}
                            placeholder="Văn A"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="checkout-email">Email</Label>
                    <Input
                        id="checkout-email"
                        type="email"
                        value={form.email}
                        disabled={isSubmitting}
                        onChange={(event) => setField("email", event.target.value)}
                        placeholder="example@gmail.com"
                    />
                    <p className="text-xs text-gray-500">
                        Thông tin email dùng để gửi trạng thái đơn hàng.
                    </p>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="checkout-phone">Số điện thoại</Label>
                    <Input
                        id="checkout-phone"
                        value={form.phone}
                        disabled={isSubmitting}
                        onChange={(event) => setField("phone", event.target.value)}
                        placeholder="090 123 4567"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="checkout-address-type">Loại địa chỉ</Label>
                    <Select
                        value={form.addressType}
                        disabled={isSubmitting}
                        onValueChange={(value) => setField("addressType", value as AddressType)}
                    >
                        <SelectTrigger id="checkout-address-type" className="w-full">
                            <SelectValue placeholder="Chọn loại địa chỉ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="HOME">Nhà riêng</SelectItem>
                            <SelectItem value="WORK">Cơ quan</SelectItem>
                            <SelectItem value="OTHER">Khác</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="checkout-street-address">Địa chỉ cụ thể</Label>
                    <Input
                        id="checkout-street-address"
                        value={form.streetAddress}
                        disabled={isSubmitting}
                        onChange={(event) => setField("streetAddress", event.target.value)}
                        placeholder="Số nhà, tên đường"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5 sm:col-span-1">
                        <Label htmlFor="checkout-city">Thành phố / Tỉnh</Label>
                        <Input
                            id="checkout-city"
                            value={form.city}
                            disabled={isSubmitting}
                            onChange={(event) => setField("city", event.target.value)}
                            placeholder="Hồ Chí Minh"
                        />
                    </div>

                    <div className="space-y-1.5 sm:col-span-1">
                        <Label htmlFor="checkout-district">Quận / Huyện</Label>
                        <Input
                            id="checkout-district"
                            value={form.wardDistrict}
                            disabled={isSubmitting}
                            onChange={(event) => setField("wardDistrict", event.target.value)}
                            placeholder="Quận 1"
                        />
                    </div>

                    <div className="space-y-1.5 sm:col-span-1">
                        <Label htmlFor="checkout-postal-code">Mã bưu chính</Label>
                        <Input
                            id="checkout-postal-code"
                            value={form.postalCode}
                            disabled={isSubmitting}
                            onChange={(event) => setField("postalCode", event.target.value)}
                            placeholder="700000"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="checkout-note">Ghi chú cho đơn hàng</Label>
                    <Textarea
                        id="checkout-note"
                        value={form.note}
                        disabled={isSubmitting}
                        onChange={(event) => setField("note", event.target.value)}
                        placeholder="Ví dụ: Giao giờ hành chính"
                        rows={3}
                    />
                </div>

                <div className="flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                    <Checkbox
                        id="checkout-default-address"
                        checked={form.setAsDefault}
                        disabled={isSubmitting}
                        onCheckedChange={(checked) => setField("setAsDefault", checked === true)}
                    />
                    <div>
                        <Label
                            htmlFor="checkout-default-address"
                            className="cursor-pointer text-sm font-medium text-gray-800"
                        >
                            Đặt làm địa chỉ mặc định
                        </Label>
                        <p className="text-xs text-gray-500">
                            Địa chỉ sẽ được lưu trong sổ địa chỉ tài khoản của bạn.
                        </p>
                    </div>
                </div>

                {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
            </section>
        </form>
    );
}
