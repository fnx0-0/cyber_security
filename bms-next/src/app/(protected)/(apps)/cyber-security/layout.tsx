import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "@/ikon/styles/globals.css";
// import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";
import { LoadingProvider } from "./misc/contexts/LoadingContext";
import GlobalLoadingSpinner from "./misc/components/GlobalLoadingSpinner";
import Layout from "./misc/components/Layout";
import ClientLayout from "./misc/components/ClientLayout";
// import { BreadcrumbProvider } from "./misc/contexts/BreadcrumbContext";
import { BreadcrumbProvider } from "./misc/components/app-breadcrumb/BreadcrumbProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SecureGuard - Security Platform",
  description: "Advanced security monitoring and compliance platform",
};

export default function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <LoadingProvider>
          <GlobalLoadingSpinner />
          <BreadcrumbProvider>
            <Providers>
              <ClientLayout>{children}</ClientLayout>
            </Providers>
          </BreadcrumbProvider>
        </LoadingProvider>
        </>
  );
}
