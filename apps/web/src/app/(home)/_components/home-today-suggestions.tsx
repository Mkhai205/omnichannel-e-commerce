import { randomUUID } from "node:crypto";
import { mapProductToTodaySuggestionCardItem } from "@/lib/home-today-suggestions";
import { getTodaySuggestionProductsChunk } from "@/services/catalog-service";
import { HomeTodaySuggestionsClient } from "./home-today-suggestions-client";

const TODAY_SUGGESTIONS_PAGE_SIZE = 20;

export async function HomeTodaySuggestions() {
    try {
        const sessionKey = randomUUID();
        const initialChunk = await getTodaySuggestionProductsChunk({
            sessionKey,
            limit: TODAY_SUGGESTIONS_PAGE_SIZE,
        });
        const cardItems = initialChunk.items.map(mapProductToTodaySuggestionCardItem);

        if (cardItems.length === 0) {
            return null;
        }

        return (
            <HomeTodaySuggestionsClient
                initialItems={cardItems}
                initialNextCursor={initialChunk.nextCursor}
                initialHasMore={initialChunk.hasMore}
                sessionKey={sessionKey}
                pageSize={TODAY_SUGGESTIONS_PAGE_SIZE}
            />
        );
    } catch {
        return null;
    }
}
