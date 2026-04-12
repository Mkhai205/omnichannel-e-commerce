import Link from "next/link";
import { ArrowRightIcon, Clock3Icon } from "lucide-react";
import { Button } from "@/components/ui";
import type { BlogPost } from "@/app/blog/_lib/mock-blog-data";
import { formatBlogDate } from "@/app/blog/_lib/mock-blog-data";

type BlogCardProps = {
    post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
    return (
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-primary">
                <span className="rounded-full bg-primary/10 px-2 py-1">{post.category}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{formatBlogDate(post.publishedAt)}</span>
            </div>

            <h2 className="mt-3 line-clamp-2 text-xl font-semibold leading-snug text-gray-900">
                {post.title}
            </h2>

            <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{post.excerpt}</p>

            <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                    <span
                        key={tag}
                        className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-600"
                    >
                        #{tag}
                    </span>
                ))}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="text-sm text-gray-500">
                    <p className="font-medium text-gray-700">{post.author}</p>
                    <p className="mt-1 inline-flex items-center gap-1">
                        <Clock3Icon className="size-3.5" />
                        {post.readTimeMinutes} phút đọc
                    </p>
                </div>

                <Button asChild size="sm" className="bg-success text-white hover:bg-success-dark">
                    <Link href={`/blog/${post.slug}`}>
                        Đọc bài
                        <ArrowRightIcon className="size-4" />
                    </Link>
                </Button>
            </div>
        </article>
    );
}
