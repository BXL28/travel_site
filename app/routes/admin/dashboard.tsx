import type { Route } from "./+types/dashboard";
import LandingOverviewSection from "~/components/LandingOverviewSection";
import LandingParametersSection from "~/components/LandingParametersSection";
import LandingSavedTripsSection from "~/components/LandingSavedTripsSection";
import type { LandingShowcaseTrip } from "~/types/landing-showcase-trip";
import { getTripsUpTo } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";

const SHOWCASE_SAMPLE_CAP = 80;
const FALLBACK_CARD_IMAGE =
    "data:image/svg+xml," +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect fill="#e2e8f0" width="400" height="240"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="14">Trip</text></svg>`
    );

function documentToShowcaseTrip(doc: any): LandingShowcaseTrip | null {
    const parsed = parseTripData(doc.tripDetail);
    if (!parsed) return null;
    const imageUrls = doc.imageUrls ?? [];
    const imageUrl =
        typeof imageUrls[0] === "string" && imageUrls[0].trim() ? imageUrls[0] : FALLBACK_CARD_IMAGE;

    const tags = [
        typeof parsed.interests === "string" ? parsed.interests : parsed.interests?.[0],
        parsed.travelStyle,
    ].filter(Boolean) as string[];

    const rawPrice = parsed.estimatedPrice;
    const price =
        rawPrice === undefined || rawPrice === null || rawPrice === ""
            ? "—"
            : typeof rawPrice === "number"
              ? String(rawPrice)
              : String(rawPrice);

    return {
        id: doc.$id,
        name: parsed.name || "AI Trip",
        imageUrl,
        location: parsed.itinerary?.[0]?.location || parsed.country || "Global",
        tags: tags.length ? tags : ["Trip"],
        price,
    };
}

function buildShowcaseTrips(documents: any[]): LandingShowcaseTrip[] {
    return documents.map(documentToShowcaseTrip).filter((t): t is LandingShowcaseTrip => t != null);
}

/** Landing / home. Header lives in `AppTopBar` (admin layout). */
export const loader = async () => {
    const { documents } = await getTripsUpTo(SHOWCASE_SAMPLE_CAP);
    return { showcaseTrips: buildShowcaseTrips(documents) };
};

const Dashboard = ({ loaderData }: Route.ComponentProps) => {
    const { showcaseTrips } = loaderData as { showcaseTrips: LandingShowcaseTrip[] };

    return (
        <main className="dashboard min-h-[50vh] bg-[#FAFBFC] pb-20 pt-6 md:pt-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 md:gap-10 lg:px-10">
                <LandingOverviewSection />
                <LandingParametersSection />
                <LandingSavedTripsSection showcaseTrips={showcaseTrips} />
            </div>
        </main>
    );
};

export default Dashboard;
