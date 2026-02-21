// @ts-nocheck

import {Link} from "react-router";
import {SidebarComponent} from "@syncfusion/ej2-react-navigations";
import NavItems from "./NavItems";

const MobileSidebar = () => {
    let sidebar: SidebarComponent;

    const toggleSidebar = () => {
        sidebar.toggle()
    }

    return (
        <div className="mobile-sidebar wrapper">
            <header className="flex lg:hidden items-center justify-between px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-30">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/assets/icons/logo.svg" alt="Logo" className="size-8" />
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">BXL Travel</h1>
                </Link>

                <button onClick={toggleSidebar} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <img src="/assets/icons/menu.svg" alt="menu" className="size-7" />
                </button>
            </header>

            <SidebarComponent
                width={270}
                ref={(Sidebar) => sidebar = Sidebar}
                created={() => sidebar.hide()}
                closeOnDocumentClick={true}
                showBackdrop={true}
                type="over"
            >
                <NavItems handleClick={toggleSidebar} />
            </SidebarComponent>
        </div>
    )
}
export default MobileSidebar