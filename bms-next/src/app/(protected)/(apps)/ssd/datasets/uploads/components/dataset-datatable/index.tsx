"use client";
import React from "react";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import CreateNewDatasetButtonWithModal from "../create-uploaded-dataset";
import { Dataset } from "../../../../components/type";
import { format } from "date-fns";

import { VIEW_DATE_TIME_FORMAT } from "@/ikon/utils/config/const";

const columns: DTColumnsProps<Dataset>[] = [
  {
    accessorKey: "datasetName",
    header: () => <div style={{ textAlign: "center" }}>Dataset name</div>,
    cell: ({ row }) => (
      <span>{row.original?.data.metadata.datasetName || "n/a"}</span>
    ),
  },
  {
    accessorKey: "datasetDescription",
    header: () => <div style={{ textAlign: "center" }}>Description</div>,
    cell: ({ row }) => (
      <span>{row.original?.data.metadata.datasetDescription || "n/a"}</span>
    ),
  },
  {
    accessorKey: "datasetSource",
    header: () => <div style={{ textAlign: "center" }}>Source</div>,
    cell: ({ row }) => <span>{row.original?.data.source || "n/a"}</span>,
  },
  {
    accessorKey: "updatedOn",
    header: "Updated On",
    cell: ({ row }) => {
      const formattedDate =
        (row?.original?.data.createdOn &&
          format(row.original.data.createdOn, VIEW_DATE_TIME_FORMAT)) ||
        "n/a";
      return <span>{formattedDate}</span>;
    },
  },
];

let testdataset: any[];
export default function DatasetDatatable({
  datasets,
}: {
  datasets: Dataset[];
}) {
  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    extraTools: [<CreateNewDatasetButtonWithModal />],
  };
  return (
    <>
      <DataTable columns={columns} data={datasets} extraParams={extraParams} />
    </>
  );
}
