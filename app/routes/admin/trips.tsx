import { Header, TripCard } from "../../components";
import { type LoaderFunctionArgs, useSearchParams } from "react-router";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";
import type { Route } from './+types/trips';
import { useState } from "react";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

// --- Types ---
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
    const page = parseInt(url.searchParams.get('page') || "1", 10);
    const offset = (page - 1) * limit;

    const { allTrips, total } = await getAllTrips(limit, offset);

    return {
        // FIX: Ensure key is 'tripDetail' to match your Appwrite action
        trips: (allTrips || []).map(({ $id, tripDetail, imageUrls }: any) => ({
            id: $id,
            ...parseTripData(tripDetail),
            imageUrls: imageUrls ?? []
        })),
        total
    }
}

const Trips = ({ loaderData }: Route.ComponentProps) => {
    const { trips, total } = loaderData;
    const typedTrips = trips as Trip[];

    const [searchParams] = useSearchParams();
    const initialPage = Number(searchParams.get('page') || '1');

    const [currentPage, setCurrentPage] = useState(initialPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Using window.location for a full refresh to handle server-side offset correctly
        window.location.search = `?page=${page}`;
    }

    return (
        <main className="dashboard wrapper">
            <Header
                title="Explore All Trips"
                description="Manage and view all AI-generated travel itineraries in one place."
                ctaText="Create a trip"
                ctaUrl="/travel/create" // Updated to match your path naming
            />

            <section className="container mt-10">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-semibold text-dark-100">
                        Manage Created Trips ({total})
                    </h2>
                </div>

                {/* Grid following the Dashboard format */}
                <div className="trip-grid mb-10">
                    {typedTrips.length > 0 ? (
                        typedTrips.map((trip) => (
                            <TripCard
                                key={trip.id}
                                id={trip.id}
                                name={trip.name || 'Untitled Trip'}
                                imageUrl={trip.imageUrls[0]}
                                // Logic matches the Dashboard: Day 1 location or Country
                                location={trip.itinerary?.[0]?.location || trip.country || 'Global'}
                                tags={[
                                    typeof trip.interests === 'string' ? trip.interests : trip.interests?.[0],
                                    trip.travelStyle
                                ].filter(Boolean)}
                                price={trip.estimatedPrice || 'Contact'}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">No trips found. Start by creating one!</p>
                        </div>
                    )}
                </div>

                {/* Pagination following the Dashboard style */}
                <div className="flex justify-center pb-10">
                    <PagerComponent
                        totalRecordsCount={total}
                        pageSize={8}
                        currentPage={currentPage}
                        click={(args) => handlePageChange(args.currentPage)}
                        cssClass="custom-pager !border-none !shadow-none"
                    />
                </div>
            </section>
        </main>
    )
}

export default Trips;
