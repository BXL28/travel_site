import { Link } from "react-router";
import { useNavigate } from "react-router";

export default function LandingPage() {
    const navigate = useNavigate();

    // Explicit function to handle the click
    const goToSignIn = () => {
        console.log("Navigating to sign-in...");
        navigate("/sign-in");
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Simple Navbar */}
            <nav className="relative z-50 flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="size-10 bg-primary-500 rounded-xl flex items-center justify-center">
                        <img src="/assets/icons/logo.svg" className="size-6 invert" alt="logo" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">BXL Travel</span>
                </div>

                <button
                    onClick={goToSignIn}
                    className="cursor-pointer bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-slate-800 transition-all text-sm"
                >
                    Sign In
                </button>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 -mt-20">
                <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-primary-600 uppercase bg-primary-50 rounded-full">
                    AI-Powered Itineraries
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-slate-900 tracking-tight">
                    Your Next Adventure, <br/>
                    <span className="text-primary-500">Managed in Seconds.</span>
                </h1>
                <p className="text-slate-500 mb-10 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                    Stop planning and start traveling. Generate personalized,
                    AI-driven travel plans tailored to your style, budget, and interests.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={goToSignIn}
                        className="cursor-pointer bg-primary-500 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary-200 hover:bg-primary-600 transition-all"
                    >
                        Get Started for Free
                    </button>
                </div>
            </main>

            <footer className="p-8 text-center text-slate-400 text-sm">
                © 2026 BXL Travel. All rights reserved.
            </footer>
        </div>
    );
}