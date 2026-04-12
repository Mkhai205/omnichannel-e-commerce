"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircleIcon, UserCheckIcon, UserPlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";

type ShopActionsClientProps = {
    shopSlug: string;
    shopName: string;
};

const FOLLOWED_SHOP_STORAGE_KEY_PREFIX = "web:shop-followed:";

function buildStorageKey(shopSlug: string): string {
    return `${FOLLOWED_SHOP_STORAGE_KEY_PREFIX}${shopSlug}`;
}

export function ShopActionsClient({ shopSlug, shopName }: ShopActionsClientProps) {
    const storageKey = useMemo(() => buildStorageKey(shopSlug), [shopSlug]);
    const [isFollowed, setIsFollowed] = useState(false);

    useEffect(() => {
        try {
            const storedValue = window.localStorage.getItem(storageKey);
            setIsFollowed(storedValue === "1");
        } catch {
            setIsFollowed(false);
        }
    }, [storageKey]);

    function handleFollowToggle() {
        setIsFollowed((previousValue) => {
            const nextValue = !previousValue;

            try {
                if (nextValue) {
                    window.localStorage.setItem(storageKey, "1");
                    toast.success(`Da theo doi ${shopName}`);
                } else {
                    window.localStorage.removeItem(storageKey);
                    toast.info(`Da bo theo doi ${shopName}`);
                }
            } catch {
                toast.error("Khong the cap nhat trang thai theo doi");
            }

            return nextValue;
        });
    }

    function handleOpenChat() {
        toast("Tinh nang chat se duoc ket noi API trong phase sau");
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Button
                type="button"
                variant={isFollowed ? "secondary" : "default"}
                onClick={handleFollowToggle}
                className="min-w-32"
            >
                {isFollowed ? (
                    <UserCheckIcon className="size-4" />
                ) : (
                    <UserPlusIcon className="size-4" />
                )}
                {isFollowed ? "Dang theo doi" : "Theo doi"}
            </Button>
            <Button type="button" variant="outline" onClick={handleOpenChat} className="min-w-28">
                <MessageCircleIcon className="size-4" />
                Chat
            </Button>
        </div>
    );
}
