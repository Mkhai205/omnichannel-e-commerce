import Link from "next/link";
import { LeafIcon } from "lucide-react";

type BrandLogoProps = {
    dark?: boolean;
};

export function BrandLogo({ dark = false }: BrandLogoProps) {
    return (
        <Link href="/" className="inline-flex items-center gap-2">
            <LeafIcon className={`size-7 ${dark ? "text-success" : "text-success-dark"}`} />
            <span
                className={`text-3xl font-semibold tracking-tight ${
                    dark ? "text-white" : "text-[#002603]"
                }`}
            >
                Ecommerce
            </span>
        </Link>
    );
}
