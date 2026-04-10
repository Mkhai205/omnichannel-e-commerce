import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import { mapProductToTodaySuggestionCardItem } from "@/lib/home-today-suggestions";
import {
    getCatalogProductById,
    getCatalogProductReviews,
    getCatalogProducts,
} from "@/services/catalog-service";
import { isApiRequestError } from "@/services/http-client";
import { getPublicShopById } from "@/services/shop-service";
import { ProductDetailClient } from "./_components/product-detail-client";

type ProductPageProps = {
    params: { id: string } | Promise<{ id: string }>;
};

const INITIAL_REVIEW_LIMIT = 5;
const RELATED_PRODUCTS_LIMIT = 10;

export default async function ProductDetailPage({ params }: ProductPageProps) {
    const resolvedParams = await Promise.resolve(params);
    const productId = decodeURIComponent(resolvedParams.id);

    try {
        const product = await getCatalogProductById(productId);
        const [shop, reviewsResponse, relatedProductsResponse] = await Promise.all([
            getPublicShopById(product.shopId),
            getCatalogProductReviews(product.id, {
                page: 1,
                limit: INITIAL_REVIEW_LIMIT,
            }),
            getCatalogProducts({
                page: 1,
                limit: RELATED_PRODUCTS_LIMIT,
                categoryId: product.categoryId,
            }),
        ]);

        const relatedProducts = relatedProductsResponse.data.filter(
            (item) => item.id !== product.id,
        );

        return (
            <main>
                {/* <SiteBreadcrumb section="Sản phẩm" current={product.name} /> */}

                <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
                    <ProductDetailClient
                        product={product}
                        shop={shop}
                        initialReviews={reviewsResponse.data}
                        initialReviewMeta={reviewsResponse.meta}
                    />

                    {relatedProducts.length > 0 ? (
                        <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900">Sản phẩm liên quan</h2>
                            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
                                {relatedProducts.slice(0, 5).map((relatedProduct) => {
                                    const cardItem =
                                        mapProductToTodaySuggestionCardItem(relatedProduct);

                                    return (
                                        <Link
                                            key={relatedProduct.id}
                                            href={cardItem.href}
                                            className="group rounded-2xl border border-gray-200 p-3 transition hover:-translate-y-0.5 hover:border-success/40 hover:shadow-sm"
                                        >
                                            <div className="relative overflow-hidden rounded-xl bg-gray-50">
                                                <div className="relative aspect-square">
                                                    <Image
                                                        src={cardItem.imageSrc}
                                                        alt={cardItem.name}
                                                        fill
                                                        sizes="(max-width: 768px) 50vw, 20vw"
                                                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                                    />
                                                </div>
                                            </div>
                                            <p className="mt-2 line-clamp-2 text-sm font-semibold text-gray-900">
                                                {cardItem.name}
                                            </p>
                                            <p className="mt-1 text-sm font-bold text-success">
                                                {cardItem.displayPrice}
                                            </p>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    ) : null}
                </section>
            </main>
        );
    } catch (error) {
        if (isApiRequestError(error) && (error.statusCode === 404 || error.statusCode === 400)) {
            notFound();
        }

        throw error;
    }
}
