"use client";

import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { approveSupplier, rejectSupplier } from "../../../../_utils/buyer/my-suppliers/approve-reject-supplier";

const columns: DTColumnsProps<any>[] = [
  {
    accessorKey: "companyName",
    header: () => <div style={{ textAlign: "center" }}>Company Name</div>,
    cell: ({ row }) => <span>{row.original?.companyName}</span>,
  },
  {
    accessorKey: "contactName",
    header: () => <div style={{ textAlign: "center" }}>Primary Contact</div>,
    cell: ({ row }) => (
      <span>{row.original.contactName ? row.original.contactName : "N/A"}</span>
    ),
  },
  {
    accessorKey: "email",
    header: () => <div style={{ textAlign: "center" }}>Company Email</div>,
    cell: ({ row }) => <span>{row.original?.email}</span>,
  },
  {
    accessorKey: "phoneNumber",
    header: () => <div style={{ textAlign: "center" }}>Company Phone</div>,
    cell: ({ row }) => (
      <span>{row.original.phoneNumber ? row.original.phoneNumber : "N/A"}</span>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div style={{ textAlign: "center" }}>Status</div>,
    cell: ({ row }) => (
      <span>{row.original.status ? row.original.status : "N/A"}</span>
    ),
  },
];

export default function MySuppliersComponent({
  suppliers,
}: {
  suppliers: any;
}) {
  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    actionMenu: {
      items: [
        {
          label: "Approve",
          onClick: (rowData: any) => {
            console.log("rowdata");
            approveSupplier(rowData.supplierId)
          },
          visibility: (rowData: any) => {
            return rowData.status==='Review';
          },
        },
        {
          label: "Reject",
          onClick: (rowData: any) => {
            console.log("rowdata");
            rejectSupplier(rowData.supplierId);
          },
          visibility: (rowData: any) => {
            return rowData.status === "Review";
          },
        },
      ],
    },
  };

  return (
    <>
      <DataTable columns={columns} data={suppliers} extraParams={extraParams} />
    </>
  );
}
