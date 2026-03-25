import { Link } from "react-router";
import { cn } from "~/lib/utils";

/** Primary CTA — brand gradient, no icon. */
export function CreateTripLink({ className }: { className?: string }) {
    return (
        <Link
            to="/travel/create"
            className={cn(
                "inline-flex min-h-14 w-full max-w-md items-center justify-center rounded-2xl bg-gradient-to-b from-primary-100 to-primary-500 px-10 py-4 text-center text-base font-bold uppercase tracking-wide text-white shadow-lg shadow-primary-500/30 ring-2 ring-white/20 transition hover:shadow-xl hover:shadow-primary-500/45 hover:brightness-105 md:min-h-16 md:text-lg",
                className
            )}
        >
            Create a trip
        </Link>
    );
}
