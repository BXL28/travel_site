import { type LoaderFunctionArgs, useSearchParams } from "react-router";
import { CreateTripLink, PageHeading, PageShell, TripCard } from "../../components";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";
import type { Route } from "./+types/trips";
import { useState } from "react";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

interface DayPlan {
    day: number;
    location: string;
    activities: { time: string; description: string }[];
}

interface Trip {
    id: string;
    name: string;
    imageUrls: string[];
    itinerary: DayPlan[];
    interests: string;
    travelStyle: string;
    estimatedPrice: string;
    country?: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const limit = 8;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;

    const { allTrips, total } = await getAllTrips(limit, offset);

    return {
        trips: (allTrips || []).map(({ $id, tripDetail, imageUrls }: any) => ({
            id: $id,
            ...parseTripData(tripDetail),
            imageUrls: imageUrls ?? [],
        })),
        total,
    };
};

const Trips = ({ loaderData }: Route.ComponentProps) => {
    const { trips, total } = loaderData;
    const typedTrips = trips as Trip[];

    const [searchParams] = useSearchParams();
    const initialPage = Number(searchParams.get("page") || "1");
    const [currentPage, setCurrentPage] = useState(initialPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.location.search = `?page=${page}`;
    };

    return (
        <PageShell>
            <PageHeading
                title="All trips"
                description="Trips I’ve already generated. Open a card for the full day-by-day breakdown."
            />

            <div className="mb-12 flex justify-center">
                <CreateTripLink />
            </div>

            <section>
                <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {total} trip{total === 1 ? "" : "s"} total
                </p>

                <div className="trip-grid mb-10">
                    {typedTrips.length > 0 ? (
                        typedTrips.map((trip) => (
                            <TripCard
                                key={trip.id}
                                id={trip.id}
                                name={trip.name || "Untitled Trip"}
                                imageUrl={trip.imageUrls[0]}
                                location={trip.itinerary?.[0]?.location || trip.country || "Global"}
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
                                Nothing here yet—I can generate one from the new itinerary form.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-center pb-6">
                    <PagerComponent
                        totalRecordsCount={total}
                        pageSize={8}
                        currentPage={currentPage}
                        click={(args) => handlePageChange(args.currentPage)}
                        cssClass="custom-pager !border-none !shadow-none"
                    />
                </div>
            </section>
        </PageShell>
    );
};

export default Trips;
