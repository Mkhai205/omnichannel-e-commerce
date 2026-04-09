import { mapProductToTodaySuggestionCardItem } from "@/lib/home-today-suggestions";
import { getTodaySuggestionProductsPage } from "@/services/catalog-service";
import { HomeTodaySuggestionsClient } from "./home-today-suggestions-client";

const TODAY_SUGGESTIONS_PAGE_SIZE = 20;

export async function HomeTodaySuggestions() {
    try {
        const pageResult = await getTodaySuggestionProductsPage(1, TODAY_SUGGESTIONS_PAGE_SIZE);
        const cardItems = pageResult.items.map(mapProductToTodaySuggestionCardItem);

        if (cardItems.length === 0) {
            return null;
        }

        const initialPage = pageResult.meta?.page ?? 1;
        const initialTotalPages = pageResult.meta?.totalPages ?? 1;

        return (
            <HomeTodaySuggestionsClient
                initialItems={cardItems}
                initialPage={initialPage}
                initialTotalPages={initialTotalPages}
                pageSize={TODAY_SUGGESTIONS_PAGE_SIZE}
            />
        );
    } catch {
        return null;
    }
}
