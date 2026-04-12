import type { ProductReviewListItem } from "@repo/shared-types";
import { Loader2Icon, StarIcon } from "lucide-react";
import { Button, cn } from "@/components/ui";

type ProductReviewsSectionProps = {
    ratingAverage: number;
    ratingCount: number;
    reviews: ProductReviewListItem[];
    totalReviewItems: number;
    canLoadMoreReviews: boolean;
    isLoadingMoreReviews: boolean;
    reviewsLoadError: string | null;
    onLoadMoreReviews: () => void;
};

function formatReviewDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Vừa xong";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function ReviewStars({ rating }: { rating: number }) {
    return (
        <div className="inline-flex items-center gap-0.5 text-amber-400" aria-hidden>
            {Array.from({ length: 5 }, (_, index) => (
                <StarIcon
                    key={`review-star-${index}`}
                    className={cn("size-3.5", index < rating ? "fill-current" : "text-gray-300")}
                />
            ))}
        </div>
    );
}

export function ProductReviewsSection({
    ratingAverage,
    ratingCount,
    reviews,
    totalReviewItems,
    canLoadMoreReviews,
    isLoadingMoreReviews,
    reviewsLoadError,
    onLoadMoreReviews,
}: ProductReviewsSectionProps) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Đánh giá sản phẩm</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        {ratingAverage.toFixed(1)} / 5 từ {ratingCount} lượt đánh giá
                    </p>
                </div>
                <span className="text-sm text-gray-500">
                    Hiển thị {reviews.length}/{totalReviewItems}
                </span>
            </div>

            {reviews.length > 0 ? (
                <div className="space-y-3">
                    {reviews.map((review) => (
                        <article
                            key={review.id}
                            className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-gray-900">
                                    {review.reviewerName}
                                </p>
                                <span className="text-xs text-gray-500">
                                    {formatReviewDate(review.createdAt)}
                                </span>
                            </div>
                            <div className="mt-2">
                                <ReviewStars rating={review.rating} />
                            </div>
                            {review.comment ? (
                                <p className="mt-2 text-sm leading-6 text-gray-700">
                                    {review.comment}
                                </p>
                            ) : (
                                <p className="mt-2 text-sm text-gray-500">
                                    Người dùng không để lại bình luận.
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            ) : (
                <p className="rounded-xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-600">
                    Sản phẩm này chưa có đánh giá nào.
                </p>
            )}

            {canLoadMoreReviews ? (
                <div className="mt-5 flex items-center justify-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onLoadMoreReviews}
                        disabled={isLoadingMoreReviews}
                    >
                        {isLoadingMoreReviews ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                Đang tải thêm đánh giá...
                            </>
                        ) : (
                            "Xem thêm đánh giá"
                        )}
                    </Button>
                </div>
            ) : null}

            {reviewsLoadError ? (
                <p className="mt-3 text-center text-sm text-red-600">{reviewsLoadError}</p>
            ) : null}
        </section>
    );
}
