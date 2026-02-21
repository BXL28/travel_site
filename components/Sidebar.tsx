import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { sidebarItems } from "~/constants";
import { logoutUser, getUser } from "~/appwrite/auth"; // Import your auth functions
import { cn } from "~/lib/utils";

const Sidebar = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>(null);

    // Fetch real user data on mount
    useEffect(() => {
        const fetchUser = async () => {
            const data = await getUser();
            if (data && typeof data !== 'string') { // Ensure it's not a redirect response
                setUserData(data);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await logoutUser();
        navigate("/"); // Send back to landing page after exit
    };

    return (
        <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col border-r border-slate-100 bg-white p-6 lg:flex">
            <Link to="/dashboard" className="mb-12 flex items-center gap-3 px-2">
                <div className="size-10 bg-primary-500 rounded-xl flex items-center justify-center">
                    <img src="/assets/icons/logo.svg" className="size-6 invert" alt="logo" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">BXL Travel</span>
            </Link>

            <nav className="flex flex-1 flex-col gap-2">
                {sidebarItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.href}
                        className={({ isActive }) =>
                            cn(
                                "group flex items-center gap-4 rounded-2xl px-4 py-4 text-sm font-bold transition-all",
                                isActive
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )
                        }
                    >
                        {/* We destructure isActive here to use it for the icon styling */}
                        {({ isActive }) => (
                            <>
                                <img
                                    src={item.icon}
                                    alt={item.label}
                                    className={cn(
                                        "size-6 transition-all",
                                        isActive ? "brightness-0 invert" : "opacity-50 group-hover:opacity-100"
                                    )}
                                />
                                {item.label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>


            {/* User Section & Exit Button */}
            <div className="mt-auto border-t border-slate-100 pt-6 flex flex-col gap-4">
                <div className="flex items-center gap-3 px-2">
                    {/* Display Google Profile Image or Fallback */}

                    <img
                        src={userData?.imageUrl || `https://ui-avatars.com/api/?name=${userData?.name || 'User'}&background=random`}
                        className="size-10 rounded-full object-cover border border-slate-200"
                        alt="profile"
                    />
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-slate-900 truncate">{userData?.name || "Loading..."}</span>
                        <span className="text-[10px] text-slate-400 font-medium truncate">{userData?.email}</span>
                    </div>
                </div>

                {/* Exit / Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                >
                    <img src="/assets/icons/logout.svg" className="size-5 opacity-80" alt="exit" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;