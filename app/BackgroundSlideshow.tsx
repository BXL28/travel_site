import { useEffect, useState } from "react";

const images = [
    "/assets/images/auth-img.webp",
    "/assets/images/hero-img.png",
    "/assets/images/card-img-1.png",
    "/assets/images/card-img-2.png",
    "/assets/images/card-img-3.png",
    "/assets/images/card-img-4.png",
    "/assets/images/card-img-5.png",
    "/assets/images/card-img-6.png",
];

export default function BackgroundSlideshow() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="absolute inset-0 -z-10 w-full h-full"
            style={{
                width: "100vw",
                height: "100vh",
            }}
        >
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === current ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                        backgroundImage: `url(${img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
            ))}
        </div>
    );
}



