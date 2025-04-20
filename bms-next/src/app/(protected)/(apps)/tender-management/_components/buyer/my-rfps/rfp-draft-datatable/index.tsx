"use client";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import React, { useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { RowData } from "@tanstack/react-table";
import Link from "next/link";
import { RfpDraft } from "../../../../_utils/common/types";
import DraftTableActionDropdown from "../../../../my-rfpsold/components/draft-table-action-dropdown";
import CreateDraftButtonWithModal from "../create-draft";
import CreateDraftModalForm from "../create-draft/CreateDraftModalForm";
import SelectCardModal from "../rfp-details-page/template-selection-form";
import ChatWithTextareaModal from "../rfp-details-page/draft-editor-with-ai";
import moment from "moment";

export default function RfpDraftDataTable({
  draftData,
}: {
  draftData: any[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<any>("");
  const [isTemplateDialogOpen, setisTemplateDialogOpen] = useState(false);
  const [isFinalizeDraftDialogOpen, setisFinalizeDraftDialogOpen] =
    useState(false);

  const handleEdit = (row: any) => {
    setCurrentDraftId(row.id); // Pass the draftId to the form
   // setIsDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentDraftId(null); // Clear the draftId when the dialog closes
    setisTemplateDialogOpen(false);
    setisFinalizeDraftDialogOpen(false);
  };

  const handleSelectTemplate = (row: any) => {
    setCurrentDraftId(row.id);
    setisTemplateDialogOpen(true);
  };

  const handleFinalizeDraft = (row: any) => {
    setCurrentDraftId(row.id);
    setisFinalizeDraftDialogOpen(true);
  };

  const columns: DTColumnsProps<any>[] = [
    // {
    //   accessorKey: "id",
    //   header: () => <div style={{ textAlign: "center" }}>Id</div>,
    //   cell: ({ row }) => <span>{row.original?.id}</span>,
    // },
    {
      accessorKey: "title",
      header: () => <div style={{ textAlign: "center" }}>Tender Subject</div>,
      cell: ({ row }) => (
        <Link href={"./my-rfps/" + row.original?.id}>
          {row.original?.title}
        </Link>
      ),
    },
    {
      accessorKey: "industry",
      header: () => <div style={{ textAlign: "center" }}>Industry</div>,
      cell: ({ row }) => <span>{row.original?.industry}</span>,
    },
    {
      accessorKey: "submissionDeadline",
      header: () => (
        <div style={{ textAlign: "center" }}>Submission Deadline</div>
      ),
      cell: ({ row }) => (
        <span>
          {moment(row.original?.submissionDeadline).format("DD-MMM-YYYY")}
        </span>
      ),
    },
    {
      accessorKey: "bidCount",
      header: () => <div style={{ textAlign: "center" }}>No Of Bids</div>,
      cell: ({ row }) => <span>{row.original?.bidCount}</span>,
    },
    {
      id: "actions",
      header: () => <div style={{ textAlign: "center" }}>Actions</div>,
      cell: ({ row }) => {
        const rowData = row.original;

        return (
          <DraftTableActionDropdown
            row={rowData}
            draftId={row.original.id}
            onSelectTemplate={handleSelectTemplate}
            onFinalizeDraft={handleFinalizeDraft}
          />
        );
      },
    },
  ];

  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    extraTools: [<CreateDraftButtonWithModal />],
  };

  return (
    <>
      <DataTable columns={columns} data={draftData} extraParams={extraParams} />

      {/* CreateDraftDialog */}
      {isDialogOpen && (
        <CreateDraftModalForm
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          draftId={currentDraftId} // Pass the draftId to the form
        />
      )}

      {isTemplateDialogOpen && (
        <SelectCardModal
          isOpen={isTemplateDialogOpen}
          onClose={handleCloseDialog}
          draftId={currentDraftId}
        />
      )}

      {isFinalizeDraftDialogOpen && (
        <ChatWithTextareaModal
          isOpen={isFinalizeDraftDialogOpen}
          onClose={handleCloseDialog}
          draftId={currentDraftId}
        />
      )}
    </>
  );
}
