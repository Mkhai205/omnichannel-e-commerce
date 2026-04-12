import type { Metadata } from "next";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import { AboutHero } from "@/app/about/_components/about-hero";
import { AboutMilestones } from "@/app/about/_components/about-milestones";
import { AboutTeam } from "@/app/about/_components/about-team";
import { AboutValues } from "@/app/about/_components/about-values";

export const metadata: Metadata = {
    title: "About | Ecommerce",
    description:
        "Tìm hiểu về tầm nhìn, giá trị cốt lõi và đội ngũ đang xây dựng nền tảng thương mại điện tử đa kênh đáng tin cậy.",
};

export default function AboutPage() {
    return (
        <>
            <SiteBreadcrumb section="Thông tin" current="Giới thiệu" />

            <main className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_56%,#ffffff_100%)] py-8 md:py-10">
                <div className="mx-auto w-full max-w-7xl space-y-6 px-4 md:px-6">
                    <AboutHero />
                    <AboutValues />
                    <AboutMilestones />
                    <AboutTeam />
                </div>
            </main>
        </>
    );
}
