"use client";

import Dashboard from "./components/Dashboard";
import setBreadcrumb from "../lib/setBreadcrumb";

export default function Home() {
  setBreadcrumb([{ label: "Dashboard", href: "/cyber-security/dashboard" }]);

  return (
  <Dashboard />
  );
}
