import { RenderAppBreadcrumb } from "../../misc/components/app-breadcrumb"//"@/components/app-breadcrumb";
import CloudContainerTabs from "./components/CloudContainerTabs";
import "../../misc/styles/globals.css"//"./misc/styles/globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 0,
          title: "Scans",
          href: "/scans",
        }}
      />
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "Cloud & Container",
          href: "/scans/cloudContainer",
        }}
      />
      <div className="flex flex-col h-full">
        <CloudContainerTabs />
        {children}
      </div>
    </>
  );
}





