import { Header } from "../../../components";
import { ColumnsDirective, ColumnDirective, GridComponent } from "@syncfusion/ej2-react-grids";
import { cn, formatDate } from "~/lib/utils";
import { getAllUsers } from "~/appwrite/auth";
import type { Route } from "./+types/all-users";
import { useState, useEffect } from "react";

const images = [
    "/background/b1.jpg",
    "/background/b2.jpg",
    "/background/b3.jpg",
    "/background/b4.jpg",
    "/background/b5.jpg",
    "/background/b6.jpg",
    "/assets/images/card-img-5.png",
    "/assets/images/card-img-6.png",
];

export const loader = async () => {
    const { users, total } = await getAllUsers(10, 0);
    return { users, total };
};

const AllUsers = ({ loaderData }: Route.ComponentProps) => {
    const { users } = loaderData;

    // State for slideshow
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 6000); // change image every 6 seconds
        return () => clearInterval(interval);
    }, []);

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
                        zIndex: 10,        // behind content
                        pointerEvents: "none",
                    }}
                />
            ))}

            {/* Optional overlay for readability */}
            <div className="absolute inset-0 bg-black/40 z-0"></div>

            {/* Main content */}
            <main className="all-users wrapper relative z-10">
                <Header
                    title="Manage Users"
                    description="Filter, sort, and access detailed user profiles"
                />

                <GridComponent dataSource={users} gridLines="None">
                    <ColumnsDirective>
                        <ColumnDirective
                            field="name"
                            headerText="Name"
                            width="200"
                            textAlign="Left"
                            template={(props: UserData) => (
                                <div className="flex items-center gap-1.5 px-4">
                                    <img
                                        src={props.imageUrl}
                                        alt="user"
                                        className="rounded-full size-8 aspect-square"
                                        referrerPolicy="no-referrer"
                                    />
                                    <span>{props.name}</span>
                                </div>
                            )}
                        />
                        <ColumnDirective
                            field="email"
                            headerText="Email Address"
                            width="200"
                            textAlign="Left"
                        />
                        <ColumnDirective
                            field="joinedAt"
                            headerText="Date Joined"
                            width="140"
                            textAlign="Left"
                            template={({ joinedAt }: { joinedAt: string }) => formatDate(joinedAt)}
                        />
                        <ColumnDirective
                            field="status"
                            headerText="Type"
                            width="100"
                            textAlign="Left"
                            template={({ status }: UserData) => (
                                <article className={cn('status-column', status === 'user' ? 'bg-success-50' : 'bg-light-300')}>
                                    <div className={cn('size-1.5 rounded-full', status === 'user' ? 'bg-success-500' : 'bg-gray-500')} />
                                    <h3 className={cn('font-inter text-xs font-medium', status === 'user' ? 'text-success-700' : 'text-gray-500')}>
                                        {status}
                                    </h3>
                                </article>
                            )}
                        />
                    </ColumnsDirective>
                </GridComponent>
            </main>
        </div>
    );
};

export default AllUsers;
