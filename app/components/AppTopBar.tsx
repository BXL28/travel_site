import { Link } from "react-router";
import { BrandMark } from "./BrandMark";
import { CreateTripLink } from "./CreateTripLink";

const AppTopBar = () => {
    return (
        <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-slate-200/90 bg-[#FAFBFC]/95 shadow-sm backdrop-blur-md">
            <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-2.5 lg:px-10">
                <Link
                    to="/"
                    className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90"
                >
                    <BrandMark size="md" />
                    <span className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                        BXL Travel
                    </span>
                </Link>
                <div className="flex flex-wrap items-center justify-end gap-3 sm:ml-auto">
                    <Link
                        to="/trips"
                        className="inline-flex h-11 min-w-[9.5rem] shrink-0 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white px-5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    >
                        View all trips
                    </Link>
                    <CreateTripLink className="!h-11 !min-h-0 !w-auto !max-w-none !px-6 !py-2.5 !text-sm !normal-case !tracking-normal" />
                </div>
            </div>
        </header>
    );
};

export default AppTopBar;
