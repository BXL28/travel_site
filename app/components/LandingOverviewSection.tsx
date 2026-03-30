import { LandingSplitBlock } from "./LandingSplitBlock";

export default function LandingOverviewSection() {
    return (
        <LandingSplitBlock
            ariaLabel="Overview"
            kicker="Overview"
            title="Planing vacations is hard so let us do it for you"
            titleLevel="h1"
            titleClassName="gemini-gen-heading"
            mediaSlot={
                <video
                    src="/assets/landing/bxltravel-showcase.mp4"
                    muted
                    playsInline
                    autoPlay
                    loop
                    className="h-full w-full rounded-xl object-cover"
                />
            }
        >
            <p>Generates day-by-day guides for your next vacation and have tips on when to visit.</p>
        </LandingSplitBlock>
    );
}
