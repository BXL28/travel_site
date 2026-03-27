import { Link } from "react-router";
import LandingTripCardDeck from "./LandingTripCardDeck";
import { LandingSplitBlock } from "./LandingSplitBlock";
import type { LandingShowcaseTrip } from "~/types/landing-showcase-trip";

export type { LandingShowcaseTrip };

type Props = {
    showcaseTrips: LandingShowcaseTrip[];
};

export default function LandingSavedTripsSection({ showcaseTrips }: Props) {
    return (
        <LandingSplitBlock
            ariaLabel="Saved trips"
            kicker="Saved runs"
            title="Finished plan and saved drafts"
            mediaSlot={
                showcaseTrips.length > 0 ? (
                    <LandingTripCardDeck trips={showcaseTrips} />
                ) : (
                    <p className="max-w-sm px-4 text-center text-sm leading-relaxed text-slate-500">
                        No saved trips yet—once I generate some, you can flip through them here.{" "}
                        <Link to="/travel/create" className="font-semibold text-primary-600 underline-offset-2 hover:underline">
                            Create a trip
                        </Link>
                        .
                    </p>
                )
            }
        >
            <p>
                A finished plan will have a day-by-day itinerary, travel tips, and an estimate of budget and costs.
                I can also access any other plan I made previously if I want to compare.
            </p>
            <p className="text-sm text-slate-500">
                <Link to="/trips" className="font-semibold text-primary-600 underline-offset-2 hover:underline">
                    My trips list
                </Link>
                .
            </p>
        </LandingSplitBlock>
    );
}
