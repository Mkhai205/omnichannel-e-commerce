import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, Clock3Icon } from "lucide-react";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import {
    formatBlogDate,
    getBlogPostBySlug,
    getRelatedBlogPosts,
} from "@/app/blog/_lib/mock-blog-data";

type BlogDetailPageProps = {
    params: { slug: string } | Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
    const resolvedParams = await Promise.resolve(params);
    const post = getBlogPostBySlug(decodeURIComponent(resolvedParams.slug));

    if (!post) {
        return {
            title: "Blog | Ecommerce",
            description: "Nội dung blog Ecommerce",
        };
    }

    return {
        title: `${post.title} | Blog Ecommerce`,
        description: post.excerpt,
    };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const resolvedParams = await Promise.resolve(params);
    const slug = decodeURIComponent(resolvedParams.slug);
    const post = getBlogPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = getRelatedBlogPosts(post.slug, 3);

    return (
        <>
            <SiteBreadcrumb section="Blog" current={post.title} />

            <main className="bg-gray-50 py-8 md:py-10">
                <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                    <Link
                        href="/blog"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="size-4" />
                        Quay lại trang blog
                    </Link>

                    <article className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                            {post.category}
                        </div>
                        <h1 className="mt-4 text-3xl font-semibold leading-tight text-gray-900 md:text-4xl">
                            {post.title}
                        </h1>

                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            <span>Tác giả: {post.author}</span>
                            <span className="text-gray-300">•</span>
                            <span>{formatBlogDate(post.publishedAt)}</span>
                            <span className="text-gray-300">•</span>
                            <span className="inline-flex items-center gap-1">
                                <Clock3Icon className="size-3.5" />
                                {post.readTimeMinutes} phút đọc
                            </span>
                        </div>

                        <p className="mt-6 border-l-4 border-success/40 bg-success/5 px-4 py-3 text-base leading-7 text-gray-700">
                            {post.excerpt}
                        </p>

                        <div className="mt-8 space-y-8">
                            {post.sections.map((section) => (
                                <section key={section.heading} className="space-y-3">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {section.heading}
                                    </h2>
                                    <div className="space-y-3 text-base leading-7 text-gray-700">
                                        {section.paragraphs.map((paragraph, index) => (
                                            <p key={`${section.heading}-paragraph-${index + 1}`}>
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>

                                    {section.bullets && section.bullets.length > 0 ? (
                                        <ul className="list-disc space-y-2 pl-6 text-base text-gray-700">
                                            {section.bullets.map((bullet, index) => (
                                                <li key={`${section.heading}-bullet-${index + 1}`}>
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </section>
                            ))}
                        </div>
                    </article>

                    {relatedPosts.length > 0 ? (
                        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Bài viết liên quan
                            </h2>
                            <div className="mt-4 grid gap-3 md:grid-cols-3">
                                {relatedPosts.map((relatedPost) => (
                                    <Link
                                        key={relatedPost.slug}
                                        href={`/blog/${relatedPost.slug}`}
                                        className="rounded-xl border border-gray-200 p-4 transition hover:border-success/40 hover:bg-success/5"
                                    >
                                        <p className="text-xs font-medium uppercase tracking-[0.08em] text-primary">
                                            {relatedPost.category}
                                        </p>
                                        <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-gray-900">
                                            {relatedPost.title}
                                        </h3>
                                        <p className="mt-2 text-xs text-gray-500">
                                            {formatBlogDate(relatedPost.publishedAt)}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ) : null}
                </div>
            </main>
        </>
    );
}
