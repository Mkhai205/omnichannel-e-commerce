"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/components/ui";

const HERO_SLIDES = [
    {
        src: "/hero/hero0.webp",
        alt: "Sale mung dai le nang tam doi song",
        badge: "Mega Campaign",
    },
    {
        src: "/hero/hero1.webp",
        alt: "Macbook campaign",
        badge: "Tech Deal",
    },
    {
        src: "/hero/hero2.webp",
        alt: "Voucher cho nguoi dung moi",
        badge: "New User",
    },
    {
        src: "/hero/hero3.webp",
        alt: "Shopee dong hanh mua xang",
        badge: "Xu Reward",
    },
    {
        src: "/hero/hero4.webp",
        alt: "Voucher xtra",
        badge: "Voucher",
    },
    {
        src: "/hero/hero5.webp",
        alt: "Deal me va be",
        badge: "Family",
    },
    {
        src: "/hero/hero6.webp",
        alt: "Shopee vip",
        badge: "VIP",
    },
    {
        src: "/hero/hero7.webp",
        alt: "Shopee premium",
        badge: "Premium",
    },
];

export function HomeHeroCarousel() {
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
        }, 4500);

        return () => {
            clearInterval(timer);
        };
    }, [api]);

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pt-8 pb-6 md:px-6 md:pt-10">
            <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
                <CarouselContent className="ml-0">
                    {HERO_SLIDES.map((slide) => (
                        <CarouselItem key={slide.src} className="pl-0">
                            <Link href="/shop" className="group block">
                                <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-orange-50 shadow-sm">
                                    <Image
                                        src={slide.src}
                                        alt={slide.alt}
                                        width={1600}
                                        height={520}
                                        priority={slide.src === "/hero/hero0.webp"}
                                        className="h-47 w-full object-cover transition-transform duration-500 group-hover:scale-[1.01] sm:h-65 lg:h-90"
                                    />
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/45 to-transparent" />
                                    <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-gray-800">
                                        {slide.badge}
                                    </div>
                                    <div className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-orange-700">
                                        Mua ngay
                                        <ArrowRightIcon className="size-3" />
                                    </div>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="left-3 size-8 border-white/80 bg-white/90 hover:bg-white" />
                <CarouselNext className="right-3 size-8 border-white/80 bg-white/90 hover:bg-white" />
            </Carousel>

            <div className="mt-4 flex items-center justify-center gap-2">
                {HERO_SLIDES.map((slide, index) => (
                    <button
                        key={slide.src}
                        type="button"
                        aria-label={`Di den banner ${index + 1}`}
                        onClick={() => api?.scrollTo(index)}
                        className={cn(
                            "h-2.5 rounded-full transition-all",
                            current === index
                                ? "w-7 bg-success"
                                : "w-2.5 bg-gray-300 hover:bg-gray-400",
                        )}
                    />
                ))}
            </div>
        </section>
    );
}
