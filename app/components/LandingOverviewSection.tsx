import { LandingSplitBlock } from "./LandingSplitBlock";

export default function LandingOverviewSection() {
    return (
        <LandingSplitBlock
            ariaLabel="Overview"
            kicker="Overview"
            title="Planning trips is hard and time consuming"
            titleLevel="h1"
            titleClassName="gemini-gen-heading"
            imageSrc="/assets/icons/gemini-logo.svg"
            imageAlt="Google Gemini logo"
        >
            <p>
                So I got <strong className="gemini-gen-accent">Gemini</strong> to help me by giving me a plan to
                follow with advice and suggestions.
            </p>
        </LandingSplitBlock>
    );
}
