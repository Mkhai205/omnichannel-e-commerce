"use client";

import { useMemo, useState } from "react";
import { SearchIcon, SparklesIcon } from "lucide-react";
import { Input, cn } from "@/components/ui";
import { BlogCard } from "@/app/blog/_components/blog-card";
import type { BlogPost } from "@/app/blog/_lib/mock-blog-data";
import { formatBlogDate } from "@/app/blog/_lib/mock-blog-data";

type BlogListClientProps = {
    posts: BlogPost[];
    featuredPost?: BlogPost;
};

const ALL_CATEGORY = "Tất cả";

export function BlogListClient({ posts, featuredPost }: BlogListClientProps) {
    const [keyword, setKeyword] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);

    const categories = useMemo(
        () => [ALL_CATEGORY, ...new Set(posts.map((post) => post.category))],
        [posts],
    );

    const filteredPosts = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return posts.filter((post) => {
            const matchedCategory =
                activeCategory === ALL_CATEGORY || post.category === activeCategory;
            const matchedKeyword =
                normalizedKeyword.length === 0 ||
                post.title.toLowerCase().includes(normalizedKeyword) ||
                post.excerpt.toLowerCase().includes(normalizedKeyword) ||
                post.tags.some((tag) => tag.toLowerCase().includes(normalizedKeyword));

            return matchedCategory && matchedKeyword;
        });
    }, [activeCategory, keyword, posts]);

    return (
        <div className="space-y-7">
            {featuredPost ? (
                <article className="rounded-2xl border border-primary/15 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_48%,#f0fdf4_100%)] p-6 md:p-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-success-dark">
                        <SparklesIcon className="size-3.5" />
                        Bài viết nổi bật
                    </div>

                    <p className="mt-4 text-sm text-gray-500">
                        {formatBlogDate(featuredPost.publishedAt)} • {featuredPost.readTimeMinutes}{" "}
                        phút đọc
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold leading-tight text-gray-900 md:text-3xl">
                        {featuredPost.title}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 md:text-base">
                        {featuredPost.excerpt}
                    </p>
                </article>
            ) : null}

            <section className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                        <div className="relative">
                            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                value={keyword}
                                onChange={(event) => setKeyword(event.target.value)}
                                placeholder="Tìm bài viết theo tiêu đề, từ khóa..."
                                className="h-11 border-gray-200 pl-10"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setActiveCategory(category)}
                                    className={cn(
                                        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                                        activeCategory === category
                                            ? "border-success/50 bg-success/10 text-success-dark"
                                            : "border-gray-200 text-gray-600 hover:border-success/30 hover:text-success",
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {filteredPosts.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {filteredPosts.map((post) => (
                            <BlogCard key={post.slug} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Không tìm thấy bài viết phù hợp
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Thử đổi từ khóa khác hoặc bộ lọc để xem thêm nội dung.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
