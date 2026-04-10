import { redirect } from "next/navigation";
import { DEFAULT_POPULAR_CATEGORY_SLUG } from "@/lib/popular-categories";

export default function CategoriesPage() {
    redirect(`/categories/${DEFAULT_POPULAR_CATEGORY_SLUG}`);
}
