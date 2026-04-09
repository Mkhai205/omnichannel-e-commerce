import { ChevronRightIcon, HomeIcon } from "lucide-react";
import Image from "next/image";

type SiteBreadcrumbProps = {
    section: string;
    current: string;
};

export function SiteBreadcrumb({ section, current }: SiteBreadcrumbProps) {
    return (
        <section className="relative overflow-hidden">
            <Image
                src="/breadcrumbs.svg"
                alt="Breadcrumbs background"
                fill
                priority
                className="absolute inset-0"
            />
            <div className="relative mx-auto flex h-28 w-full max-w-7xl items-center px-4 md:px-6">
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
