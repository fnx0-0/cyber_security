"use client";
import { RfpData } from "../../utils/types";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import React from "react";
import { Button } from "@/shadcn/ui/button";
import CreateRFPButtonWithModal from "../rfp-upload";

const columns: DTColumnsProps<RfpData>[] = [
  {
    accessorKey: "Title",
    header: () => <div style={{ textAlign: "center" }}>Title</div>,
    cell: ({ row }) => <span>{row.original?.rfpTitle}</span>,
  },
  {
    accessorKey: "Deadline",
    header: () => <div style={{ textAlign: "center" }}>Deadline</div>,
    cell: ({ row }) => (
      <span>{row.original.rfpDeadline ? row.original.rfpDeadline : "N/A"}</span>
    ),
  },
  {
    accessorKey: "Sector",
    header: () => <div style={{ textAlign: "center" }}>Sector</div>,
    cell: ({ row }) => <span>{row.original?.sector}</span>,
  },
  {
    accessorKey: "Country",
    header: () => <div style={{ textAlign: "center" }}>Country</div>,
    cell: ({ row }) => (
      <span>{row.original.country ? row.original.country : "N/A"}</span>
    ),
  },
  {
    accessorKey: "resourceData.resourceName",
    header: () => <div style={{ textAlign: "center" }}>File</div>,
    cell: ({ row }) => (
      <span>
        {row.original?.resourceData
          ? row.original?.resourceData.resourceName
          : "No file"}
      </span>
    ),
  },
];

export default function RfpDataTable({ rfpData }: { rfpData: RfpData[] }) {
  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    extraTools: [<CreateRFPButtonWithModal />],
  };

  return (
    <>
      <DataTable columns={columns} data={rfpData} extraParams={extraParams} />
    </>
  );
}
