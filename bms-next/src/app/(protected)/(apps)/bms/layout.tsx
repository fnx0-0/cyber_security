import type { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
import { DiscoveryProvider } from './discovery/actions/context/DiscoveryContext';
import './custom-scrollbar.css';

const menuitems = [
  {
    title: "Dashboard",
    href: "/bms",
    iconName: "house",

  },
  {
    title: "Alarms & Events",
    href: "/bms/alarms",
    iconName: "bell",
  },
  {
    title: "Discovery",
    href: "/bms/discovery",
    iconName: "radio-tower",
  },
  {
    title: "Devices List",
    href: "/bms/deviceList",
    iconName: "monitor",
  },
  {
    title: "Trend Analysis",
    href: "/bms/trends",
    iconName: "chart-line",
  },
  {
    title: "Control Interface",
    href: "/bms/control",
    iconName: "sliders",
  },
  {
    title: "Digital Twin",
    href: "/bms/digital-twin",
    iconName: "building-2",
  },
  {
    title: "IoT Devices",
    href: "/bms/iot-devices",
    iconName: "cpu",
  },
  {
    title: "Warning Devices",
    href: "/bms/warning-devices",
    iconName: "triangle-alert",
  },
  // {
  //   title: "Support Tickets",
  //   href: "/bms/support-tickets",
  //   iconName: "ticket",
  // },
  {
    title: "Reports",
    href: "/bms/reports",
    iconName: "file-chart-column-increasing",
  },
  {
    title: "Predictive Analysis",
    href: "/bms/predictive",
    iconName: "brain",
  },
  {
    title: "AI Assistant",
    href: "/bms/ai-assistant",
    iconName: "bot",
  },
  {
    title: "User Management",
    href: "/bms/users",
    iconName: "users",
  },
  {
    title: "System Config",
    href: "/bms/config",
    iconName: "settings",
  },
  {
    title: "Security",
    href: "/bms/security",
    iconName: "shield",
  },
];

function layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <DiscoveryProvider>
        <RenderAppSidebar menuItems={menuitems} />
        <RenderAppBreadcrumb
          breadcrumb={{ level: 1, title: "BMS", href: "/bms" }}

        />
        <div className="h-full overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </DiscoveryProvider>
    </>
  );
}

export default layout;
