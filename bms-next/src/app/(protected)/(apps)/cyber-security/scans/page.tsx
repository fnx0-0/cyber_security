"use client";

import { Scans } from "./components/Scans";
import { useBreadcrumb } from "../contexts/BreadcrumbContext";
import { useEffect } from "react";
import React from "react";

export default function ScansPage() {
  const { setItems } = useBreadcrumb();
  useEffect(() => {
    setItems([{ label: "Scans", href: "/cyber-security/scans" }]);
  }, []);

  return <Scans />;
}
