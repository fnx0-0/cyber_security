"use client";

import Dashboard from "../dashboard/components/Dashboard"//"@/app/dashboard/components/Dashboard";
import { RenderAppBreadcrumb } from "../misc/components/app-breadcrumb"//"@/components/app-breadcrumb";
import setBreadcrumb from "../misc/lib/setBreadcrumb"//"@/lib/setBreadcrumb";

export default function Home() {
  // setBreadcrumb([{ label: "Dashboard", href: "/dashboard" }]);

  return <>
    <RenderAppBreadcrumb
      breadcrumb={{
        level: 0,
        title: "Dashboard",
        href: "/cyber-security/dashboard",
      }}
    />
    <Dashboard />
  </>;
}
