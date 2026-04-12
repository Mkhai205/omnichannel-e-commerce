"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { TOAST_REASON_MESSAGES } from "@/lib/toast-messages";

export function RouteToastListener() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const reason = searchParams.get("reason") as keyof typeof TOAST_REASON_MESSAGES | null;
        if (!reason || !(reason in TOAST_REASON_MESSAGES)) {
            return;
        }

        toast.info(TOAST_REASON_MESSAGES[reason]);

        const params = new URLSearchParams(searchParams.toString());
        params.delete("reason");
        const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.replace(nextUrl, { scroll: false });
    }, [pathname, router, searchParams]);

    return null;
}
