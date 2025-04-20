import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
const menuitems = [
  {
    title: "Tenders",
    href: "/tender-management",
    iconName: "file-stack",
  },
  {
    title: "Buyer Configuration",
    submenu: [
      {
        title: "My RFPs",
        href: "/tender-management/buyer",
        iconName: "menu",
      },
      {
        title: "Templates",
        href: "/tender-management/buyer/my-templates",
        iconName: "hourglass",
      },
      {
        title: "My Tenders",
        href: "/tender-management/buyer/my-rfps",
        iconName: "hourglass",
      },
      {
        title: "My Suppliers",
        href: "/tender-management/buyer/my-suppliers",
        iconName: "hourglass",
      },
    ],
    iconName: "file-stack",
  },
  {
    title: "Supplier Configuration",
    submenu: [
      {
        title: "Response Uploads",
        href: "/tender-management/supplier/upload",
        iconName: "menu",
      },
      {
        title: "Templates",
        href: "/tender-management/supplier/template",
        iconName: "menu",
      },
    ],
    iconName: "file-stack",
  },
  {
    title: "Analytics",
    submenu: [
      {
        title: "Tender",
        href: "",
        iconName: "menu",
      },
      {
        title: "Supplier",
        href: "",
        iconName: "hourglass",
      },
    ],
    iconName: "file-stack",
  },
  {
    title: "Profile",
    href: "/tender-management/my-profile",
    iconName: "file-stack",
  },
  // {
  //   title: "Home",
  //   href: "/tender-management",
  //   iconName: "house",
  // },
  // {
  //   title: "My RFPs",
  //   href: "/tender-management/buyer/my-rfps",
  //   iconName: "file-check-2",
  // },
  // {
  //   title: "My Templates",
  //   href: "/tender-management/buyer/my-templates",
  //   iconName: "layout-template",
  // },
  // {
  //   title: "Analytics",
  //   href: "/tender-management/buyer/analytics",
  //   iconName: "chart-spline",
  // },
  // {
  //   title: "Response Upload",
  //   href: "/tender-management/supplier/upload",
  //   iconName: "file-up",
  // },
  // {
  //   title: "Response Template",
  //   href: "/tender-management/supplier/template",
  //   iconName: "layout-template",
  // },
];

async function layout({ children }: Readonly<{ children: ReactNode }>) {
  getSoftwareIdByNameVersion("Tender Management", "1");
  return (
    <>
      <RenderAppSidebar menuItems={menuitems} />
      <RenderAppBreadcrumb
        breadcrumb={{ level: 1, title: "RFP", href: "/tender-management" }}
      />
      {children}
    </>
  );
}

export default layout;
