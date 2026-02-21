import { NavLink } from "react-router";
import { sidebarItems } from "~/constants";
import { cn } from "~/lib/utils";

interface NavItemsProps {
    handleClick?: () => void;
}

const NavItems = ({ handleClick }: NavItemsProps) => {
    return (
        <div className="flex h-full flex-col bg-white p-6">
            <div className="mb-10 flex items-center gap-3">
                <div className="size-8 bg-primary-500 rounded-lg flex items-center justify-center">
                    <img src="/assets/icons/logo.svg" className="size-5 invert" alt="logo" />
                </div>
                <span className="text-lg font-bold text-slate-900">BXL Travel</span>
            </div>

            <nav className="flex flex-col gap-2">
                {sidebarItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.href}
                        onClick={handleClick}
                        className={({ isActive }) =>
                            cn(
                                "group flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold transition-all",
                                isActive
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <img
                                    src={item.icon}
                                    alt={item.label}
                                    className={cn("size-6 transition-all", isActive ? "brightness-0 invert" : "opacity-50")}
                                />
                                {item.label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default NavItems;
