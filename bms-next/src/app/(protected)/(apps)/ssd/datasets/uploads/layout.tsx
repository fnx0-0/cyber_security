import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default function UploadsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 3,
          title: "Uploads",
          href: "/ssd/datasets/uploads",
        }}
      />
      {children}
    </>
  );
}
