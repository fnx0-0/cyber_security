import React from 'react';
import { AlarmProvider } from "./context/alarmsContext" // adjust path as needed
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{ level: 2, title: "Alarm & Events", href: "/bms/alarms" }}
            />
            <AlarmProvider>
                {children}
            </AlarmProvider>
        </>
    );
};

export default Layout;