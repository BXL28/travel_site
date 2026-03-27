import { Outlet, useLocation } from "react-router";
import AppTopBar from "~/components/AppTopBar";

const AdminLayout = () => {
    const location = useLocation();

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#FAFBFC]">
            <AppTopBar />
            <main className="w-full flex-1 pt-28 sm:pt-24">
                <Outlet key={location.pathname} />
            </main>
        </div>
    );
};

export default AdminLayout;
