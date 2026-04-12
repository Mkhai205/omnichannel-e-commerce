"use client";

import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import {
    Button,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
} from "@/components/ui";
import { CONTACT_TOPICS } from "@/app/contact/_lib/contact-options";

type ContactFormState = {
    fullName: string;
    email: string;
    companyName: string;
    topic: string;
    message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_STATE: ContactFormState = {
    fullName: "",
    email: "",
    companyName: "",
    topic: CONTACT_TOPICS[0],
    message: "",
};

function validateForm(state: ContactFormState): ContactFormErrors {
    const errors: ContactFormErrors = {};

    if (state.fullName.trim().length < 2) {
        errors.fullName = "Vui lòng nhập họ tên tối thiểu 2 ký tự.";
    }

    if (!EMAIL_PATTERN.test(state.email.trim())) {
        errors.email = "Vui lòng nhập đúng định dạng email.";
    }

    if (state.companyName.trim().length < 2) {
        errors.companyName = "Vui lòng nhập tên doanh nghiệp.";
    }

    if (state.message.trim().length < 30) {
        errors.message = "Nội dung cần tối thiểu 30 ký tự để đội ngũ tư vấn đầy đủ hơn.";
    }

    return errors;
}

export function ContactForm() {
    const [formState, setFormState] = useState<ContactFormState>(INITIAL_STATE);
    const [errors, setErrors] = useState<ContactFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canSubmit = useMemo(() => !isSubmitting, [isSubmitting]);

    const handleFieldChange = (field: keyof ContactFormState, value: string) => {
        setFormState((prevState) => ({ ...prevState, [field]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateForm(formState);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            toast.warning("Vui lòng kiểm tra lại thông tin trước khi gửi.");
            return;
        }

        setIsSubmitting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 600));
            toast.success("Đã ghi nhận yêu cầu. Chúng tôi sẽ liên hệ với bạn sớm.");
            setFormState(INITIAL_STATE);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-7">
            <h2 className="text-xl font-semibold text-gray-900">Gửi yêu cầu tư vấn</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
                Chia sẻ nhanh nhu cầu hiện tại của bạn. Đội ngũ sẽ đề xuất lộ trình triển khai phù
                hợp và thực tế nhất.
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="contact-full-name">Họ và tên</Label>
                        <Input
                            id="contact-full-name"
                            value={formState.fullName}
                            onChange={(event) => handleFieldChange("fullName", event.target.value)}
                            placeholder="Nguyễn Văn A"
                            className="h-11"
                        />
                        {errors.fullName ? (
                            <p className="text-xs text-red-600">{errors.fullName}</p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact-email">Email</Label>
                        <Input
                            id="contact-email"
                            type="email"
                            value={formState.email}
                            onChange={(event) => handleFieldChange("email", event.target.value)}
                            placeholder="ban@example.com"
                            className="h-11"
                        />
                        {errors.email ? (
                            <p className="text-xs text-red-600">{errors.email}</p>
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="contact-company">Tên doanh nghiệp</Label>
                        <Input
                            id="contact-company"
                            value={formState.companyName}
                            onChange={(event) =>
                                handleFieldChange("companyName", event.target.value)
                            }
                            placeholder="Công ty ABC"
                            className="h-11"
                        />
                        {errors.companyName ? (
                            <p className="text-xs text-red-600">{errors.companyName}</p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <Label>Chủ đề</Label>
                        <Select
                            value={formState.topic}
                            onValueChange={(value) => handleFieldChange("topic", value)}
                        >
                            <SelectTrigger className="h-11 border-gray-200">
                                <SelectValue placeholder="Chọn chủ đề" />
                            </SelectTrigger>
                            <SelectContent>
                                {CONTACT_TOPICS.map((topic) => (
                                    <SelectItem key={topic} value={topic}>
                                        {topic}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="contact-message">Nội dung</Label>
                    <Textarea
                        id="contact-message"
                        value={formState.message}
                        onChange={(event) => handleFieldChange("message", event.target.value)}
                        placeholder="Bạn có thể mô tả mục tiêu kinh doanh, quy mô vận hành và khó khăn hiện tại..."
                        rows={6}
                        className="resize-none"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formState.message.trim().length} ký tự</span>
                        <span>Tối thiểu 30 ký tự</span>
                    </div>
                    {errors.message ? (
                        <p className="text-xs text-red-600">{errors.message}</p>
                    ) : null}
                </div>

                <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="h-11 bg-success text-white hover:bg-success-dark"
                >
                    {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu"}
                </Button>
            </form>
        </section>
    );
}
