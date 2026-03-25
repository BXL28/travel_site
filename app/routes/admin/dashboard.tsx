import * as React from "react";
import { Link } from "react-router";
import { BrandMark, CreateTripLink, TripCard } from "../../components";
import type { Route } from "./+types/dashboard";
import { getTripsUpTo } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";
import { aggregateTripPopularity } from "~/lib/trip-popularity";
import type { TripPopularityStats } from "~/lib/trip-popularity";

const LATEST_TRIP_COUNT = 3;
const STATS_TRIP_CAP = 500;

function shuffleStrings(arr: string[]): string[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function collectHeroImageUrls(documents: any[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const doc of documents) {
        const urls = doc.imageUrls;
        if (!Array.isArray(urls)) continue;
        for (const u of urls) {
            if (typeof u !== "string" || !u.trim()) continue;
            if (seen.has(u)) continue;
            seen.add(u);
            out.push(u);
        }
    }
    return shuffleStrings(out);
}

export const loader = async () => {
    const { documents, total } = await getTripsUpTo(STATS_TRIP_CAP);

    const trips = documents.slice(0, LATEST_TRIP_COUNT).map(({ $id, tripDetail, imageUrls }: any) => {
        const parsed = parseTripData(tripDetail);
        return {
            id: $id,
            ...parsed,
            imageUrls: imageUrls ?? [],
        };
    });

    const popularity = aggregateTripPopularity(documents);
    const heroImages = collectHeroImageUrls(documents);

    return {
        trips,
        total,
        popularity,
        sampleSize: documents.length,
        heroImages,
    };
};

const Dashboard = ({ loaderData }: Route.ComponentProps) => {
    const { trips, total, popularity, sampleSize, heroImages } = loaderData;

    const [InsightCharts, setInsightCharts] = React.useState<React.ComponentType<{
        popularity: TripPopularityStats;
        sampleSize: number;
    }> | null>(null);

    const [HeroSlideshow, setHeroSlideshow] = React.useState<React.ComponentType<{
        images: string[];
    }> | null>(null);

    React.useEffect(() => {
        void import("~/components/DashboardInsightCharts").then((m) =>
            setInsightCharts(() => m.default)
        );
        void import("~/components/DashboardHeroSlideshow").then((m) =>
            setHeroSlideshow(() => m.default)
        );
    }, []);

    return (
        <main className="dashboard pb-20 pt-6 md:pt-10 bg-[#FAFBFC]">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5">
                        <BrandMark size="lg" />
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                            BXL Travel
                        </h1>
                    </div>
                    <p className="mt-4 text-lg leading-relaxed text-slate-600 md:text-xl">
                        Plan trips with AI-built day-by-day itineraries, see what destinations and
                        styles are trending, and jump from inspiration to your next adventure in one
                        place.
                    </p>
                </div>

                <div className="mt-10">
                    {HeroSlideshow ? (
                        <HeroSlideshow images={heroImages} />
                    ) : (
                        <div
                            className="aspect-[16/10] min-h-[240px] max-h-[min(56vh,560px)] w-full animate-pulse rounded-[32px] border border-slate-100 bg-slate-100 shadow-md md:aspect-[2.2/1] md:min-h-[320px]"
                            aria-hidden
                        />
                    )}
                </div>

                {InsightCharts ? (
                    <InsightCharts popularity={popularity} sampleSize={sampleSize} />
                ) : (
                    <section className="mt-16" aria-hidden="true">
                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-slate-900">Travel insights</h2>
                            <p className="mt-1 text-slate-500">Loading charts…</p>
                        </div>
                        <div className="grid grid-cols-1 gap-10 xl:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-[380px] animate-pulse rounded-[32px] border border-slate-100 bg-white shadow-sm"
                                />
                            ))}
                        </div>
                    </section>
                )}

                <div className="mt-14 flex justify-center">
                    <CreateTripLink />
                </div>

                <section className="mt-20">
                    <div className="mb-8 text-center">
                        <div className="mb-2 flex items-center justify-center gap-3">
                            <BrandMark size="sm" />
                            <h2 className="text-3xl font-bold text-slate-900">Latest trips</h2>
                        </div>
                        <p className="mt-1 text-slate-500">
                            {total === 0
                                ? "No trips yet — generate your first itinerary."
                                : trips.length > 0
                                  ? `The ${trips.length} most recent itinerar${trips.length === 1 ? "" : "ies"}.`
                                  : `You have ${total} trip${total === 1 ? "" : "s"} in your library.`}
                        </p>
                    </div>

                    <div className="mb-10 flex justify-center">
                        <Link
                            to="/trips"
                            className="flex h-12 w-full max-w-sm items-center justify-center rounded-2xl border-2 border-slate-200 bg-white px-8 text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                        >
                            View all created trips
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {trips.length > 0 ? (
                            trips.map((trip: any) => (
                                <TripCard
                                    key={trip.id}
                                    id={trip.id}
                                    name={trip.name || "AI Trip"}
                                    imageUrl={trip.imageUrls[0]}
                                    location={
                                        trip.itinerary?.[0]?.location || trip.country || "Global"
                                    }
                                    tags={[
                                        typeof trip.interests === "string"
                                            ? trip.interests
                                            : trip.interests?.[0],
                                        trip.travelStyle,
                                    ].filter(Boolean)}
                                    price={trip.estimatedPrice || "Contact"}
                                />
                            ))
                        ) : (
                            <div className="col-span-full rounded-[32px] border border-dashed border-slate-200 bg-white py-20 text-center">
                                <p className="font-medium text-slate-500">
                                    No trips found. Start by creating one.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Dashboard;
