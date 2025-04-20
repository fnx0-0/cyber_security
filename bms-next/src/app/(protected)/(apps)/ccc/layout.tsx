import { RenderAppBreadcrumb } from '@/ikon/components/app-breadcrumb'
import { RenderAppSidebar } from '@/ikon/components/app-sidebar'
import React, { ReactNode } from 'react'
import { DiscoveryProvider } from './discovery/actions/context/DiscoveryContext';

interface LayoutProps {
    children: ReactNode;
}

const menuitems = [
    {
        title: "Dashboard",
        href: "/ccc",
        iconName: "layout-panel-top",
    },
    {
        title: "Discovery",
        href: "/ccc/discovery",
        iconName: "radio-tower",
    },
    {
        title: "Devices List",
        href: "/ccc/deviceList",
        iconName: "monitor",
    },
];

const Layout = ({ children }: LayoutProps) => {
    return (
     <DiscoveryProvider>
        <div>
            <RenderAppBreadcrumb
                breadcrumb={{ level: 1, title: "CCC", href: "/ccc" }}
            />
            <RenderAppSidebar menuItems={menuitems} />
            {children}
        </div>
      </DiscoveryProvider>
    );
};

export default Layout