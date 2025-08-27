import { Link } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import NavItems from "./NavItems";

const MobileSidebar = () => {
    let sidebar: SidebarComponent;

    const toggleSidebar = () => {
        sidebar.toggle();
    };

    return (
        <div className="mobile-sidebar wrapper">
            {/* Header */}
            <header className="w-full flex items-center justify-between p-4 bg-[#0F1115] text-[#EAEAEA]">
                <Link to="/" className="flex items-center gap-2">
                    <img
                        src="/assets/icons/logo.svg"
                        alt="Logo"
                        className="w-8 h-8"
                    />
                    <h1 className="text-lg font-bold">BXL Travel</h1>
                </Link>

                <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-white/10 transition-colors">
                    <img src="/assets/icons/menu.svg" alt="menu" className="w-7 h-7" />
                </button>
            </header>

            {/* Sidebar */}
            <SidebarComponent
                width={270}
                ref={(Sidebar) => (sidebar = Sidebar)}
                created={() => sidebar.hide()}
                closeOnDocumentClick={true}
                showBackdrop={true}
                type="over"
                cssClass="bg-[rgba(255,255,255,0.05)] backdrop-blur-md text-[#EAEAEA]"
            >
                <NavItems handleClick={toggleSidebar} />
            </SidebarComponent>
        </div>
    );
};

export default MobileSidebar;
