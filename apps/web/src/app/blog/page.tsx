import type { Metadata } from "next";
import { PenSquareIcon } from "lucide-react";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import { BlogListClient } from "@/app/blog/_components/blog-list-client";
import { getAllBlogPosts, getFeaturedBlogPost } from "@/app/blog/_lib/mock-blog-data";

export const metadata: Metadata = {
    title: "Blog | Ecommerce",
    description:
        "Cập nhật xu hướng bán lẻ đa kênh, vận hành website và xây dựng niềm tin thương hiệu.",
};

export default function BlogPage() {
    const posts = getAllBlogPosts();
    const featuredPost = getFeaturedBlogPost();

    return (
        <>
            <SiteBreadcrumb section="Kiến thức" current="Blog" />

            <main className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_52%,#ffffff_100%)] py-8 md:py-10">
                <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                    <section className="mb-7 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                            <PenSquareIcon className="size-3.5" />
                            Trung tâm kiến thức
                        </div>
                        <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-gray-900 md:text-4xl">
                            Chia sẻ kinh nghiệm phát triển thương hiệu bán lẻ đa kênh
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 md:text-base">
                            Tổng hợp bài viết thực chiến về vận hành website, tối ưu trải nghiệm mua
                            sắm và xây dựng niềm tin khách hàng trong mọi điểm chạm.
                        </p>
                    </section>

                    <BlogListClient posts={posts} featuredPost={featuredPost} />
                </div>
            </main>
        </>
    );
}
