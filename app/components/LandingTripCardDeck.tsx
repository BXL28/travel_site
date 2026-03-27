import * as React from "react";
import type { LandingShowcaseTrip } from "~/types/landing-showcase-trip";
import TripCard from "./TripCard";

type Props = {
    trips: LandingShowcaseTrip[];
};

function twoDigit(n: number) {
    return String(n).padStart(2, "0");
}

/**
 * Feature-preview style deck: framed card, circular nav, subtle index — matches site slate/primary theme.
 */
export default function LandingTripCardDeck({ trips }: Props) {
    const [index, setIndex] = React.useState(0);
    const count = trips.length;
    const safeIndex = count ? ((index % count) + count) % count : 0;

    const go = (delta: number) => {
        if (!count) return;
        setIndex((i) => (i + delta + count) % count);
    };

    if (!count) return null;

    const trip = trips[safeIndex]!;

    return (
        <div
            className="relative w-full max-w-md rounded-[1.25rem] border border-slate-200/90 bg-white px-5 pb-12 pt-6 shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_20px_-2px_rgba(16,24,40,0.06)] outline-none md:px-7 md:pb-14 md:pt-8 focus-visible:ring-2 focus-visible:ring-primary-500/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-roledescription="carousel"
            aria-label="Sample saved trips"
            tabIndex={0}
            onKeyDown={(e) => {
                if (!count || count < 2) return;
                if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    go(-1);
                }
                if (e.key === "ArrowRight") {
                    e.preventDefault();
                    go(1);
                }
            }}
        >
            <div className="relative mx-auto w-full max-w-sm">
                {count > 1 ? (
                    <>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                go(-1);
                            }}
                            className="absolute left-0 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent text-lg font-bold text-slate-800/40 shadow-none transition [text-shadow:0_0_10px_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.2)] hover:bg-slate-900/[0.06] hover:text-slate-900/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 md:left-1 md:size-11 md:text-xl"
                            aria-label="Previous trip"
                        >
                            ←
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                go(1);
                            }}
                            className="absolute right-0 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent text-lg font-bold text-slate-800/40 shadow-none transition [text-shadow:0_0_10px_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.2)] hover:bg-slate-900/[0.06] hover:text-slate-900/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 md:right-1 md:size-11 md:text-xl"
                            aria-label="Next trip"
                        >
                            →
                        </button>
                    </>
                ) : null}

                <div className="relative z-0">
                    <TripCard
                        key={trip.id}
                        id={trip.id}
                        name={trip.name}
                        imageUrl={trip.imageUrl}
                        location={trip.location}
                        tags={trip.tags}
                        price={trip.price}
                    />
                </div>
            </div>

            {count > 1 ? (
                <p
                    className="pointer-events-none absolute bottom-5 left-6 text-xs font-medium tabular-nums tracking-wide text-slate-400 md:bottom-6 md:left-8"
                    aria-live="polite"
                >
                    {twoDigit(safeIndex + 1)} / {twoDigit(count)}
                </p>
            ) : null}
        </div>
    );
}
