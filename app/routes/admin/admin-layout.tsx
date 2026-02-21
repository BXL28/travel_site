import { Outlet, useLocation } from "react-router"; // Add useLocation
import { Sidebar, MobileSidebar } from '~/components/index';

const AdminLayout = () => {
    // This hook gets the current location object safely
    const location = useLocation();

    return (
        <div className="relative flex min-h-screen w-full bg-[#FAFBFC]">
            <Sidebar />
            <MobileSidebar />
            <main className="flex-1 lg:pl-72">
                {/* Use location.pathname from the hook instead of window */}
                <Outlet key={location.pathname} />
            </main>
        </div>
    );
};

export default AdminLayout;