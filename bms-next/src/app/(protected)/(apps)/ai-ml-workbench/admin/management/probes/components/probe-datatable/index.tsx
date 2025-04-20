"use client";

import { ProbeData } from "@/app/(protected)/(apps)/ai-ml-workbench/components/type";
import { ActionMenuProps } from "@/ikon/components/action-menu/type";
import { DataTable } from "@/ikon/components/data-table";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import { VIEW_DATE_TIME_FORMAT } from "@/ikon/utils/config/const";
import { format } from "date-fns";
import {
  Activity,
  Ban,
  Check,
  FilePenIcon,
  Hourglass,
  Radio,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import CreateProbeButtonWithModal from "../create-probe";

const columns: DTColumnsProps<ProbeData, unknown>[] = [
  {
    header: "Probe Name",
    accessorKey: "PROBE_NAME", // Use the correct key in your data
    cell: (row) => <span>{row.row.original.PROBE_NAME}</span>,
  },
  {
    header: "Probe ID",
    accessorKey: "PROBE_ID",
    cell: (row) => <span>{row.row.original.PROBE_ID}</span>,
  },
  {
    header: "Alive",
    accessorKey: "ACTIVE",
    cell: (row) =>
      row.row.original.ACTIVE ? (
        <span className="text-green-600">
          <ThumbsUp />
        </span>
      ) : (
        <span className="text-red-600">
          <ThumbsDown />
        </span>
      ),
  },
  {
    header: "Status",
    accessorKey: "Status",
    cell: (row) => <span>{row.row.original.Status ?? "Inactive"}</span>,
  },
  {
    header: "User",
    accessorKey: "USER_NAME",
    cell: (row) => <span>{row.row.original.USER_NAME}</span>,
  },
  {
    header: "Last Heartbeat",
    accessorKey: "lastHeartBeat",
    cell: (row) => (
      <span>
        {row.row.original.LAST_HEARTBEAT !== null
          ? format(row.row.original.LAST_HEARTBEAT, VIEW_DATE_TIME_FORMAT)
          : "NO HEARTBEAT"}
      </span>
    ),
  },
];

const actionMenus: ActionMenuProps[] = [
  {
    label: "Live Instruction",
    icon: Radio,
    onClick: (row) => {
      console.log(row);
    },
  },
  { label: "Instruction History", icon: Hourglass },
  { label: "Live Logs", icon: Activity },
  { label: "Edit Probe", icon: FilePenIcon },
  { label: "Deactivate Probe", icon: Ban },
  { label: "Activate Probe", icon: Check },
];

const extraParams: DTExtraParamsProps = {
  extraTools: [<CreateProbeButtonWithModal />],
  actionMenus: actionMenus,
};

export default function ProbeDataTable({
  probeDataTableData,
}: {
  probeDataTableData: ProbeData[];
}) {
  return (
    <>
      <DataTable
        columns={columns}
        data={probeDataTableData}
        extraParams={extraParams}
      />
    </>
  );
}
