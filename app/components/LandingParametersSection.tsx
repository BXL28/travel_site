import { Link } from "react-router";
import { LandingSplitBlock } from "./LandingSplitBlock";

/** Same split as the other landing blocks, but image left / text right on desktop. */
export default function LandingParametersSection() {
    return (
        <LandingSplitBlock
            imageFirst
            ariaLabel="Create trip parameters"
            kicker="Create trip"
            title="Parameters I give Gemini before it drafts a plan"
            imageSrc="/assets/landing/create-trip-parameters.png"
            imageAlt="Create trip form: destination Egypt, 10 days, friends, adventure style, historical sites interest, premium budget"
            imagePresentation="screenshot"
            imageZoomOnHover
        >
            <p>
                On <strong>Create trip</strong> I select everything the generator needs in one pass. That payload is
                what gets sent to Gemini so the model knows the destination, length, and vibe I’m asking for:
            </p>
            <ul className="list-inside list-disc space-y-2 marker:text-primary-500">
                <li>
                    <strong>Destination</strong> — country (searchable combo box).
                </li>
                <li>
                    <strong>Duration</strong> — number of days (1–14).
                </li>
                <li>
                    <strong>Travel style</strong> — e.g. relaxed, luxury, adventure, cultural, nature, city
                    exploration.
                </li>
                <li>
                    <strong>Interest</strong> — main theme (food, museums, beaches, hiking, etc.).
                </li>
                <li>
                    <strong>Budget</strong> — budget, mid-range, luxury, or premium.
                </li>
                <li>
                    <strong>Group type</strong> — solo, couple, family, friends, or business.
                </li>
            </ul>
            <p className="text-sm text-slate-500">
                <Link to="/travel/create" className="font-semibold text-primary-600 underline-offset-2 hover:underline">
                    Create trip
                </Link>{" "}
                — same form I use.
            </p>
        </LandingSplitBlock>
    );
}
