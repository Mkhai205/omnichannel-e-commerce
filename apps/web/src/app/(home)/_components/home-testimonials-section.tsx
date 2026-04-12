"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, QuoteIcon } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/components/ui";
import { HomeTestimonialCard, type HomeTestimonial } from "./home-testimonial-card";

const TESTIMONIALS: HomeTestimonial[] = [
    {
        name: "Nguyễn Văn An",
        role: "Chuyên gia thu mua",
        company: "An Phát Retail",
        quote: "Giao diện dễ dùng, danh mục rõ ràng và phần gợi ý sản phẩm rất đúng nhu cầu của đội ngũ chúng tôi.",
        rating: 5,
        avatarUrl: "/categories/men-fashion.webp",
    },
    {
        name: "Trần Bảo Châu",
        role: "Trưởng nhóm Marketing",
        company: "Moon Cosmetics",
        quote: "Banner khuyến mãi cập nhật nhanh, tốc độ tải trang tốt trên mobile nên tỷ lệ chuyển đổi tăng rõ rệt.",
        rating: 5,
        avatarUrl: "/categories/beauty-health.webp",
    },
    {
        name: "Phạm Đức Kiên",
        role: "Chủ cửa hàng",
        company: "Kien Mobile",
        quote: "Phần danh mục và gợi ý giúp khách tìm sản phẩm nhanh hơn, đơn hàng mỗi ngày ổn định hơn trước.",
        rating: 4,
        avatarUrl: "/categories/mobile.webp",
    },
    {
        name: "Lê Thu Hà",
        role: "Vận hành",
        company: "Happy Home",
        quote: "Phần dịch vụ và danh mục trình bày gọn, dễ tạo niềm tin với khách hàng ngay từ lần đầu truy cập.",
        rating: 5,
        avatarUrl: "/categories/household-appliances.webp",
    },
    {
        name: "Võ Quốc Huy",
        role: "Nhà sáng lập",
        company: "Huy Sport",
        quote: "Trải nghiệm slider rất mượt, nội dung hiển thị rõ trên nhiều kích thước màn hình và dễ mở rộng thêm.",
        rating: 4,
        avatarUrl: "/categories/sports.webp",
    },
];

export function HomeTestimonialsSection() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        const updateCurrent = () => {
            setCurrent(api.selectedScrollSnap());
        };

        updateCurrent();
        api.on("select", updateCurrent);
        api.on("reInit", updateCurrent);

        return () => {
            api.off("select", updateCurrent);
            api.off("reInit", updateCurrent);
        };
    }, [api]);

    useEffect(() => {
        if (!api) {
            return;
        }

        const timer = setInterval(() => {
            api.scrollNext();
        }, 5000);

        return () => {
            clearInterval(timer);
        };
    }, [api]);

    return (
        <section className="bg-green-50/60 py-14">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
                    <h2 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
                        Khách hàng nói gì về chúng tôi
                    </h2>

                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-success hover:text-success-dark"
                    >
                        Xem thêm
                        <ArrowRightIcon className="size-4" />
                    </Link>
                </div>

                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-green-100">
                    <QuoteIcon className="size-3.5 text-success" />
                    Được tin tưởng bởi khách hàng và đối tác trên toàn quốc
                </div>

                <Carousel className="w-full" opts={{ loop: true, align: "start" }} setApi={setApi}>
                    <CarouselContent className="-ml-3">
                        {TESTIMONIALS.map((testimonial) => (
                            <CarouselItem
                                key={testimonial.name}
                                className="basis-full pl-3 md:basis-1/2 xl:basis-1/3"
                            >
                                <HomeTestimonialCard testimonial={testimonial} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 top-1/2 border-white bg-white" />
                    <CarouselNext className="right-2 top-1/2 border-white bg-white" />
                </Carousel>

                <div className="mt-5 flex items-center justify-center gap-2">
                    {TESTIMONIALS.map((item, index) => (
                        <button
                            key={item.name}
                            type="button"
                            aria-label={`Đi đến đánh giá ${index + 1}`}
                            onClick={() => api?.scrollTo(index)}
                            className={cn(
                                "h-2 rounded-full transition-all",
                                current === index
                                    ? "w-7 bg-success"
                                    : "w-2.5 bg-gray-300 hover:bg-gray-400",
                            )}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
