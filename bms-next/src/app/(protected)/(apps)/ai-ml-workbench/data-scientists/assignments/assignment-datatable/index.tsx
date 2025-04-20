"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import CreateAssignmentButtonWithModal from "../create-assignment";
import { DataTable } from "@/ikon/components/data-table";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import { ActionMenuProps } from "@/ikon/components/action-menu/type";
import AssignmentModal from "../create-assignment/createAssignmentModalForm";
import ClientAssigneeModal from "../assignment-invoke/clientComponent";
import { invokeAssignmentProcessAssigneeForm } from "../assignment-invoke";
import { Circle, Edit, Eye, Info, Trash } from "lucide-react";

export const VIEW_DATE_TIME_FORMAT = {
  date: "dd-MM-yyyy",
  time: "HH:mm:ss",
  dateTime: "dd-MM-yyyy HH:mm:ss",
} as const;

type Assignment = {
  assignmentId: string;
  name: string;
  email: string;
  status: string;
  assignmentName: string;
  assignmentDescription: string;
  creationDate: string;
  creationTime: string;
  lastUpdatedOn: string;
  assigneeName: string;
};

const columns: DTColumnsProps<Assignment, unknown>[] = [
  {
    header: "Status",
    accessorKey: "status",
    enableSorting: false,
    cell: (row) => {
      const status = row.getValue<string>();
      let borderClass = "border-success";
      if (status === "New" || status === "Assignment Created")
        borderClass = "border-danger";
      else if (status === "Project Created") borderClass = "border-warning";

      return (
        <span className={`me-2 px-2 border rounded-full ${borderClass}`}>
          {status || "N/A"}
        </span>
      );
    },
  },
  {
    header: "Assignment Name",
    accessorKey: "assignmentName",
    enableSorting: false,
    cell: (row) => <span>{row.getValue<string>() || "N/A"}</span>,
  },
  {
    header: "Description",
    accessorKey: "assignmentDescription",
    enableSorting: false,
    cell: (row) => {
      const description = row.getValue<string>();
      return (
        <div
          className="ellipsis whitespace-normal"
          title={description}
          style={{
            maxWidth: "300px",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description || "N/A"}
        </div>
      );
    },
  },
  {
    id: "creationDate",
    header: "Creation Date",
    accessorKey: "createdOn",
    enableSorting: false,
    cell: (row) => {
      const rawDate = row.getValue<string>();
      try {
        return (
          <span>{format(new Date(rawDate), VIEW_DATE_TIME_FORMAT.date)}</span>
        );
      } catch (e) {
        return <span>N/A</span>;
      }
    },
  },
  {
    id: "creationTime",
    header: "Creation Time",
    accessorKey: "createdOn",
    enableSorting: false,
    cell: (row) => {
      const rawDate = row.getValue<string>();
      try {
        return (
          <span>{format(new Date(rawDate), VIEW_DATE_TIME_FORMAT.time)}</span>
        );
      } catch (e) {
        return <span>N/A</span>;
      }
    },
  },
  {
    header: "Updated On",
    accessorKey: "lastUpdatedOn",
    enableSorting: false,
    cell: (row) => {
      const rawDate = row.getValue<string>();
      try {
        return (
          <span>
            {format(new Date(rawDate), VIEW_DATE_TIME_FORMAT.dateTime)}
          </span>
        );
      } catch (e) {
        return <span>N/A</span>;
      }
    },
  },
  {
    header: "Assignee Name",
    accessorKey: "assigneeName",
    enableSorting: false,
    cell: (row) => <span>{row.getValue<string>() || "N/A"}</span>,
  },
];

function AssignmentDataTable({
  assignmentData,
}: {
  assignmentData: Assignment[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
  };

  const handleCloseAssigneeModal = () => {
    setIsAssigneeModalOpen(false);
    setSelectedAssignment(null);
  };

  const handleView = (assignmentId: string) => {
    const found = assignmentData.find((a) => a.assignmentId === assignmentId);
    if (found) {
      setSelectedAssignment(found);
      setIsModalOpen(true);
    } else {
      console.error("Assignment not found with id:", assignmentId);
    }
  };

  const openAssigneeForm = async (assignmentId: string) => {
    try {
      setSelectedAssignment(null); // Reset first
      setIsAssigneeModalOpen(false); // Ensure modal is closed before updating data

      const assignmentData = await invokeAssignmentProcessAssigneeForm(
        assignmentId
      );
      console.log("assignmentData i am here", assignmentData);

      setTimeout(() => {
        //@ts-ignore
        setSelectedAssignment(assignmentData); // Set fetched assignment details
        setIsAssigneeModalOpen(true);
      }, 0); // Delay ensures re-rendering happens correctly
    } catch (error) {
      console.error("Error fetching assignment details:", error);
    }
  };

  // const actionMenus: ActionMenuProps[] = [
  //   {
  //     label: "View",
  //     icon: Eye,
  //     onClick: (row: any) => handleView(row.original.assignmentId),
  //   },
  //   {
  //     label: "Update Assignee",
  //     icon: Edit,
  //     onClick: (row: any) => openAssigneeForm(row.original.assignmentId),
  //   },
  //   {
  //     label: "View Status",
  //     icon: Info,
  //   },
  //   {
  //     label: "Delete",
  //     icon: Trash,
  //   },
  // ];

  const actionMenu = {
    items: [
      {
        label: "View",
        icon: Eye,
        onClick: (rowData: any) => handleView(rowData.original.assignmentId),
      },
      {
        label: "Update Assignee",
        icon: Edit,
        onClick: (rowData: any) =>
          openAssigneeForm(rowData.original.assignmentId),
      },
      {
        label: "View Status",
        icon: Info,
      },
      {
        label: "Delete",
        icon: Trash,
      },
    ],
  };

  const extraParams: DTExtraParamsProps = {
    grouping: true,
    extraTools: [<CreateAssignmentButtonWithModal key="create-assignment" />],
    actionMenu: actionMenu,
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={assignmentData || []}
        extraParams={extraParams}
      />

      {/* Assignment Details Modal */}
      {selectedAssignment && (
        <AssignmentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          assignment={selectedAssignment}
        />
      )}

      {/* Assignee Update Modal */}
      {isAssigneeModalOpen && (
        <ClientAssigneeModal
          //@ts-ignore
          assignmentId={selectedAssignment?.assignmentId}
          //@ts-ignore
          assignmentName={selectedAssignment?.assigneeName}
          //@ts-ignore
          assignees={selectedAssignment.assignees}
          assignmentData={assignmentData}
          onClose={handleCloseAssigneeModal}
        />
      )}
    </>
  );
}

export default AssignmentDataTable;
