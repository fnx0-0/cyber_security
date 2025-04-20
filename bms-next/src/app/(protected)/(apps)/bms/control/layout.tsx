import React from 'react';
import { HvacProvider } from "./contex/HvacContext" // adjust path as needed
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{ level: 2, title: "Control Interface", href: "/bms/control" }}
            />
            <HvacProvider>
                {children}
            </HvacProvider>
        </>
    );
};

export default Layout;