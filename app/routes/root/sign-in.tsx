import { Link, redirect } from "react-router";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { loginWithGoogle } from "~/appwrite/auth";
import { account } from "~/appwrite/client";

export async function clientLoader() {
    try {
        const user = await account.get();
        // If the user is already logged in, move them to dashboard
        if (user?.$id) return redirect('/dashboard');
    } catch (e) {
        // Essential for Incognito: fail silently so the page renders
        return null;
    }
}

const SignIn = () => {
    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
            <section className="w-full max-w-md bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-10 flex flex-col items-center">
                    {/* Brand Header */}
                    <header className="flex flex-col items-center gap-4 mb-10">
                        <Link to="/" className="hover:scale-105 transition-transform">
                            <div className="size-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                                <img
                                    src="/assets/icons/logo.svg"
                                    alt="logo"
                                    className="size-8 invert"
                                />
                            </div>
                        </Link>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">BXL Travel</h1>
                    </header>

                    {/* Text Content */}
                    <article className="text-center space-y-3 mb-10">
                        <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                        <p className="text-slate-500 leading-relaxed">
                            Sign in to access your AI itineraries and manage your global adventures.
                        </p>
                    </article>

                    {/* Solid Tech Button */}
                    <ButtonComponent
                        type="button"
                        className="!h-14 !w-full !rounded-xl !bg-slate-900 !border-none transition-all hover:!bg-blue-600 active:scale-95 shadow-lg group"
                        onClick={loginWithGoogle}
                    >
                        <div className="flex items-center justify-center gap-3">
                            <img
                                src="/assets/icons/google.svg"
                                className="size-5"
                                alt="google"
                            />
                            <span className="text-base font-bold text-white uppercase tracking-wider">
                                Continue with Google
                            </span>
                        </div>
                    </ButtonComponent>

                    <p className="mt-8 text-xs text-slate-400 text-center uppercase tracking-widest">
                        Secure AI Authentication
                    </p>
                </div>
            </section>
        </main>
    );
};

export default SignIn;

