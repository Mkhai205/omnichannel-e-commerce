"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui";

const POPUP_STORAGE_KEY = "home-promo-popup-seen";
const POPUP_DELAY_MS = 450;

export function HomeEntryPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const hasSeenPopup = window.sessionStorage.getItem(POPUP_STORAGE_KEY) === "1";
        if (hasSeenPopup) {
            return;
        }

        const timer = window.setTimeout(() => {
            setIsOpen(true);
        }, POPUP_DELAY_MS);

        return () => {
            window.clearTimeout(timer);
        };
    }, []);

    const closePopup = () => {
        if (typeof window !== "undefined") {
            window.sessionStorage.setItem(POPUP_STORAGE_KEY, "1");
        }
        setIsOpen(false);
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(nextOpen) => (nextOpen ? setIsOpen(true) : closePopup())}
        >
            <DialogContent
                showCloseButton={false}
                className="max-w-[min(92vw,430px)] border-0 bg-transparent p-0 shadow-none ring-0"
            >
                <DialogTitle className="sr-only">Promotion popup</DialogTitle>

                <div className="relative">
                    <Link
                        href="/categories"
                        onClick={closePopup}
                        className="group block overflow-hidden rounded-4xl"
                    >
                        <Image
                            src="/popup.webp"
                            alt="Khuyen mai noi bat"
                            width={576}
                            height={768}
                            priority
                            className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                        />
                    </Link>

                    <button
                        type="button"
                        aria-label="Dong popup"
                        onClick={closePopup}
                        className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-full bg-black/40 text-lg font-semibold text-white hover:bg-black/55"
                    >
                        x
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
