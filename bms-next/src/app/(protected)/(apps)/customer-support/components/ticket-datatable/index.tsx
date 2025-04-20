"use client";

import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { format } from "date-fns";
import { TicketData } from "../type";
import CreateTicketButtonWithModal from "../create-ticket";
import { useEffect, useState } from "react";
import { getProfileData } from "@/ikon/utils/actions/auth";

const columns: DTColumnsProps<TicketData>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => <span>{row.original.subject}</span>,
  },
  {
    accessorKey: "ticketNo",
    header: "Ticket No.",
    cell: ({ row }) => <span>{row.original.ticketNo}</span>,
  },
  {
    accessorKey: "priority",
    header: "Severity",
    cell: ({ row }) => <span>{row.original.priority}</span>,
  },
  {
    accessorKey: "dateCreated",
    header: "Created On",
    cell: ({ row }) => (
      <span>{format(row.original.dateCreated, "yyyy-MM-dd HH:mm")}</span>
    ),
  },
  {
    accessorKey: "issueDate",
    header: "Issue Date & Time",
    cell: ({ row }) => (
      <span>{format(row.original.issueDate, "yyyy-MM-dd HH:mm")}</span>
    ),
  },
  {
    accessorKey: "accountName",
    header: "Account Name",
    cell: ({ row }) => <span>{row.original.accountName}</span>,
  },
  {
    accessorKey: "assigneeName",
    header: "Assignee Name",
    cell: ({ row }) => <span>{row.original.assigneeName || "..."}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span>{row.original.status}</span>,
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => <span>{"..."}</span>,
  },
];

export default function OpenTicketsDatatable({
  ticketData,
}: {
  ticketData: TicketData[];
}) {
  const [showMyTickets, setShowMyTickets] = useState(false);
  const [showUnassignedTickets, setShowUnassignedTickets] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<TicketData[]>(ticketData);

  useEffect(() => {
    async function fetchProfileData() {
      const profileData = await getProfileData();
      setUserId(profileData.USER_ID);
    }
    fetchProfileData();
  }, []);

  useEffect(() => {
    let newFilteredData = ticketData;

    if (showMyTickets && userId) {
      newFilteredData = newFilteredData.filter(
        (ticket) => ticket.assigneeId === userId
      );
    }

    if (showUnassignedTickets) {
      newFilteredData = newFilteredData.filter((ticket) => !ticket.assigneeId);
    }

    setFilteredData(newFilteredData);
  }, [showMyTickets, showUnassignedTickets, userId, ticketData]);

  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    extraTools: [
      <label key="my-tickets" className="ml-4 mt-1.5">
        <input
          type="checkbox"
          checked={showMyTickets}
          onChange={() => setShowMyTickets(!showMyTickets)}
        />{" "}
        My Tickets
      </label>,
      <label key="unassigned-tickets" className="ml-4 mt-1.5">
        <input
          type="checkbox"
          checked={showUnassignedTickets}
          onChange={() => setShowUnassignedTickets(!showUnassignedTickets)}
        />{" "}
        Unassigned Tickets
      </label>,
      <CreateTicketButtonWithModal key="create-ticket" />,
    ],
  };

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      extraParams={extraParams}
    />
  );
}
