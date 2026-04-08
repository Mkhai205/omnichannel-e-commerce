import { ChevronRightIcon, HomeIcon } from "lucide-react";

type SiteBreadcrumbProps = {
    section: string;
    current: string;
};

export function SiteBreadcrumb({ section, current }: SiteBreadcrumbProps) {
    return (
        <section className="relative overflow-hidden bg-linear-to-r from-[#0f110f] via-[#1d241d] to-[#263b1f]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,205,92,0.2),transparent_30%),radial-gradient(circle_at_15%_90%,rgba(0,178,7,0.26),transparent_28%)]" />
            <div className="relative mx-auto flex h-28 w-full max-w-425 items-center px-4 md:px-6">
                <div className="inline-flex items-center gap-3 text-sm">
                    <HomeIcon className="size-4 text-gray-300" />
                    <ChevronRightIcon className="size-3.5 text-gray-400" />
                    <span className="text-gray-300">{section}</span>
                    <ChevronRightIcon className="size-3.5 text-gray-400" />
                    <span className="font-semibold text-success">{current}</span>
                </div>
            </div>
        </section>
    );
}
