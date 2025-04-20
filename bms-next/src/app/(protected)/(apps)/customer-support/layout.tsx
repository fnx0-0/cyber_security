import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
const menuitems = [
  {
    title: "Dasboard",
    href: "/customer-support",
    iconName: "layout-dashboard",
  },
  {
    title: "Tickets",
    submenu: [
      {
        title: "Open tickets",
        href: "/customer-support/open-tickets",
        iconName: "ticket",
      },
      {
        title: "Closed tickets",
        href: "/customer-support/close-tickets",
        iconName: "ticket-check",
      },
    ],
    iconName: "file-stack",
  },
  {
    title: "Summary",
    href: "/customer-support/summary",
    iconName: "chart-pie",
  },
  {
    title: "Roster",
    href: "/customer-support/roster",
    iconName: "hourglass",
  },
  {
    title: "Connector",
    href: "/customer-support/connector",
    iconName: "cable",
  },
];

async function layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RenderAppSidebar menuItems={menuitems} />

      <RenderAppBreadcrumb
        breadcrumb={{
          level: 0,
          title: "Customer Support",
          href: "/customer-support/all-tickets",
        }}
      />
      {children}
    </>
  );
}

export default layout;
