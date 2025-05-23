import { Scans } from "./components/Scans";
import { RenderAppBreadcrumb } from "../misc/components/app-breadcrumb";

export default function ScansPage() {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 0,
          title: "Scans",
          href: "/cyber-security/scans",
        }}
      />
      <Scans />
    </>
  );
}
