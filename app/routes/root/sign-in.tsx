import {Link, redirect, useNavigate, useSearchParams} from "react-router";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { loginWithGoogle } from "~/appwrite/auth";
import { account } from "~/appwrite/client";
import { useEffect, useState } from "react";

const images = [
    "/background/b5.jpg",
    "/background/b2.jpg",
    "/background/b3.jpg",
    "/background/b6.jpg",
    "/background/b4.jpg",
    "/background/b1.jpg",
    "/assets/images/card-img-6.png",
    "/assets/images/card-img-5.png",
];

export async function clientLoader() {
    try {
        const user = await account.get();
        if (user.$id) return redirect('/dashboard'); // Redirect to dashboard if already logged in
    } catch (e) {
        console.log("Error fetching user", e);
    }
}

const SignIn = () => {
    const navigate = useNavigate(); // <- useNavigate for redirects
    const [searchParams] = useSearchParams();
    const initialPage = Number(searchParams.get("page") || "1");
    const [currentPage, setCurrentPage] = useState(initialPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.location.search = `?page=${page}`;
    };

    const [currentImage, setCurrentImage] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    // Wrapper for Google login
    const handleGoogleSignIn = async () => {
        try {
            await loginWithGoogle(); // your existing Appwrite login
            navigate("/dashboard"); // redirect after successful login
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <div className="relative min-h-screen w-full">
            {/* Slideshow background */}
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentImage ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                        backgroundImage: `url(${img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        zIndex: 10,
                        pointerEvents: "none",
                    }}
                />
            ))}

            <main className="auth relative z-10">
                <section className="flex-center size-full glassmorphism px-6">
                    <div className="sign-in-card">
                        <header className="header">
                            <Link to="/"></Link>
                            <h1 className="p-28-bold text-dark-100">BXL Travel</h1>
                        </header>

                        <article>
                            <h2 className="p-28-semibold text-dark-100 text-center">
                                Start Your Travel Journey
                            </h2>
                            <p className="p-18-regular text-center text-gray-100 !leading-7">
                                Sign in with Google to manage destinations, itineraries, and user
                                activity with ease.
                            </p>
                        </article>

                        <ButtonComponent
                            type="button"
                            iconCss="e-search-icon"
                            className="button-class !h-11 !w-full"
                            onClick={handleGoogleSignIn} // <- use wrapper
                        >
                            <img
                                src="/assets/icons/google.svg"
                                className="size-5"
                                alt="google"
                            />
                            <span className="p-18-semibold text-white">
                Sign in with Google
              </span>
                        </ButtonComponent>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SignIn;


