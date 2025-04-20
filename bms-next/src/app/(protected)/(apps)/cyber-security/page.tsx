"use client";
import { redirect } from "next/navigation";
import { useBreadcrumb } from "./contexts/BreadcrumbContext";
import { useEffect } from "react";
import { Layout } from "lucide-react";
import Dashboard from "./components/Dashboard";

export default function Home() {
  const { setItems } = useBreadcrumb();

  useEffect(() => {
    setItems([{ label: "Dashboard", href: "/cyber-security/dashboard" }]);
  }, []);
  //redirect("/cyber-security/dashboard");

  return (
     <Layout>
       <Dashboard />
     </Layout>

  );
}
