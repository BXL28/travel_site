import { Link } from "react-router";

const AppTopBar = () => {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center px-6 lg:px-10">
                <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-500">
                        <img src="/assets/icons/logo.svg" className="size-6 invert" alt="" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-900">BXL Travel</span>
                </Link>
            </div>
        </header>
    );
};

export default AppTopBar;
