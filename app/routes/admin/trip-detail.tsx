import { Link, type LoaderFunctionArgs } from "react-router";
import { getAllTrips, getTripById } from "~/appwrite/trips";
import type { Route } from './+types/trip-detail';
import { cn, parseTripData } from "~/lib/utils";
import { BrandMark, InfoPill, PageHeading, PageShell, TripCard } from "../../components";
import { ChipDirective, ChipListComponent, ChipsDirective } from "@syncfusion/ej2-react-buttons";

// --- Interfaces ---
interface DayPlan {
    day: number;
    location: string;
    activities: { time: string; description: string }[];
}

interface TripData {
    name: string;
    description: string;
    estimatedPrice: string;
    duration: number;
    budget: string;
    travelStyle: string;
    country: string;
    interests: string | string[];
    groupType: string;
    bestTimeToVisit: string[];
    weatherInfo: string[];
    location: {
        city: string;
        coordinates: [number, number];
        openStreetMap: string;
    };
    itinerary: DayPlan[];
}

// --- Loader ---
export const loader = async ({ params }: LoaderFunctionArgs) => {
    const { tripId } = params;

    // Guard: Prevent this loader from running if we are actually trying to create a trip
    if (tripId === "create") return null;

    try {
        const trip = await getTripById(tripId as string);
        if (!trip) {
            throw new Response("Trip Not Found", { status: 404 });
        }

        // Other saved trips for the bottom carousel
        const { allTrips } = await getAllTrips(4, 0);

        return {
            trip,
            relatedTrips: (allTrips || []).map((doc: any) => ({
                id: doc.$id,
                ...parseTripData(doc.tripDetail),
                imageUrls: doc.imageUrls ?? []
            }))
        };
    } catch (error) {
        console.error("Loader Error:", error);
        throw new Response("Error loading trip data", { status: 500 });
    }
};

// --- Component ---
const TripDetail = ({ loaderData }: Route.ComponentProps) => {
    // If we are on /trips/create, loaderData will be null due to our guard
    if (!loaderData || !loaderData.trip) {
        return null;
    }

    const { trip, relatedTrips } = loaderData;
    const tripData: TripData = parseTripData(trip?.tripDetail);
    const imageUrls = trip?.imageUrls || [];

    const {
        name, duration, itinerary, travelStyle,
        groupType, budget, interests, estimatedPrice,
        description, bestTimeToVisit, weatherInfo, country, location
    } = tripData || {};

    const pillItems = [
        { text: travelStyle, bg: '!bg-pink-50 !text-pink-500' },
        { text: groupType, bg: '!bg-primary-50 !text-primary-500' },
        { text: budget, bg: '!bg-success-50 !text-success-700' },
        { text: typeof interests === 'string' ? interests : interests?.[0], bg: '!bg-navy-50 !text-navy-500' },
    ].filter(p => p.text);

    const getBookingLink = (city: string, country: string) => {
        const query = encodeURIComponent(`${city} ${country} tours tickets`);
        return `https://www.viator.com/search/${query}?mcid=56757`;
        // Alternatively, use GetYourGuide:
        // return `https://www.getyourguide.com/s/?q=${query}`;
    };

    return (
        <PageShell className="trip-detail">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 flex justify-center">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-slate-500 transition-colors hover:text-slate-900"
                    >
                        <img src="/assets/icons/arrow-left.svg" alt="" className="h-5 w-5" />
                        <span className="font-medium">Back to home</span>
                    </Link>
                </div>

                <section>
                    <header className="mb-10 text-center">
                        <div className="mb-6 flex items-center justify-center gap-3">
                            <BrandMark size="sm" />
                            <span className="text-lg font-bold tracking-tight text-slate-900">
                                BXL Travel
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">{name}</h1>
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                            <InfoPill text={`${duration} Days in ${country}`} image="/assets/icons/calendar.svg" />
                            {location?.city && (
                                <InfoPill text={location.city} image="/assets/icons/location-mark.svg" />
                            )}
                        </div>
                    </header>

                    {/* Image Gallery */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
                        {imageUrls.map((url: string, i: number) => (
                            <img
                                key={i}
                                src={url}
                                alt={name}
                                className={cn(
                                    "rounded-2xl object-cover w-full shadow-sm",
                                    i === 0 ? "md:col-span-2 md:row-span-2 h-[400px]" : "h-[195px]"
                                )}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <section className="mb-10">
                                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                                <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-bold mb-6">Daily Itinerary</h2>
                                <div className="space-y-10">
                                    {itinerary?.map((dayPlan) => (
                                        <div key={dayPlan.day} className="relative pl-8 border-l-2 border-blue-100">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
                                            <h3 className="text-xl font-semibold mb-4 text-blue-900">
                                                Day {dayPlan.day}: {dayPlan.location}
                                            </h3>
                                            <div className="bg-slate-50 rounded-xl p-5 space-y-4">
                                                {dayPlan.activities.map((act, idx) => (
                                                    <div key={idx} className="flex gap-4">
                                                        <span className="text-sm font-bold text-blue-600 uppercase w-20 pt-1">{act.time}</span>
                                                        <p className="flex-1 text-gray-700">{act.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <aside className="space-y-8">
                            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                                <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
                                    Rough estimate
                                </p>
                                <h2 className="mb-6 text-4xl font-bold text-blue-600">{estimatedPrice}</h2>

                                <a
                                    href={getBookingLink(location?.city || "", country)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mb-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700"
                                >
                                    Book tickets & tours
                                </a>

                                <ChipListComponent id="trip-tags">
                                    <ChipsDirective>
                                        {pillItems.map((pill, i) => (
                                            <ChipDirective
                                                key={i}
                                                text={pill.text}
                                                cssClass={`${pill.bg} !rounded-lg`}
                                            />
                                        ))}
                                    </ChipsDirective>
                                </ChipListComponent>
                            </div>

                            <div className="rounded-3xl bg-slate-900 p-6 text-white">
                                <h3 className="text-lg font-bold mb-4">Travel Tips</h3>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-blue-400 text-sm font-bold mb-2">Best Time to Visit</h4>
                                        <ul className="text-sm space-y-2 opacity-90">
                                            {bestTimeToVisit?.map((t, i) => <li key={i}>{t}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-blue-400 text-sm font-bold mb-2">Weather</h4>
                                        <ul className="text-sm space-y-2 opacity-90">
                                            {weatherInfo?.map((w, i) => <li key={i}>{w}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>

                <section className="mt-20 border-t border-slate-100 pt-16">
                    <PageHeading
                        as="h2"
                        size="section"
                        title="Other trips I’ve saved"
                        description="More drafts in my library—open one if I want to compare or revisit an older idea."
                    />
                    <div className="trip-grid">
                        {relatedTrips.map((trip) => (
                            <TripCard
                                key={trip.id}
                                id={trip.id}
                                name={trip.name}
                                imageUrl={trip.imageUrls[0]}
                                location={trip.itinerary?.[0]?.location ?? ""}
                                tags={[trip.interests, trip.travelStyle]}
                                price={trip.estimatedPrice}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </PageShell>
    );
};

export default TripDetail;