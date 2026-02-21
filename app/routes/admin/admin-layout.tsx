// Inside app/routes/admin/admin-layout.tsx
import { Outlet } from "react-router";
// Use the absolute alias to avoid "path depth" math
import { Sidebar, MobileSidebar } from 'components/index';

const AdminLayout = () => {
    return (
        <div className="relative flex min-h-screen w-full bg-[#FAFBFC]">
            <Sidebar />
            <MobileSidebar />
            <main className="flex-1 lg:pl-72">
                {/* Adding a key here helps React track route transitions better */}
                <Outlet key={window.location.pathname} />
            </main>
        </div>
    );
};

export default AdminLayout;