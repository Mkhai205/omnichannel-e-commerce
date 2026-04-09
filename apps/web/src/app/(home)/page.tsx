import { HomeHeroCarousel } from "./_components/home-hero-carousel";
import { HomeHotDealsBanner } from "./_components/home-hot-deals-banner";
import { HomeHotDealsProducts } from "./_components/home-hot-deals-products";
import { HomeEntryPopup } from "./_components/home-entry-popup";
import { HomePopularCategories } from "./_components/home-popular-categories";
import { HomeServiceHighlights } from "./_components/home-service-highlights";
import { HomeTestimonialsSection } from "./_components/home-testimonials-section";

export default function Home() {
    return (
        <main className="bg-[linear-gradient(180deg,#ffffff_0%,#fff7ed_40%,#ffffff_100%)]">
            <HomeEntryPopup />
            <HomeHeroCarousel />
            <HomeServiceHighlights />
            <HomePopularCategories />
            <HomeHotDealsBanner />
            <HomeHotDealsProducts />
            <HomeTestimonialsSection />
        </main>
    );
}
