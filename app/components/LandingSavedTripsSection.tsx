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
                        
                    </p>
                )
            }
        >
            <p>
                A finished plan will have a day-by-day itinerary, travel tips, and an estimate of budget and costs.
                Access any other plan previously made to compare or follow.
            </p>
            
        </LandingSplitBlock>
    );
}
