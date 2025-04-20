"use client";
import { DealData } from "@/app/(protected)/(apps)/sales-crm/components/type";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { Input } from "@/shadcn/ui/input";
import React, { useEffect, useState } from "react";

export interface ProductDetail {
  productIdentifier: string;
  productType: string;
  projectManager: string;
  productDescription: string;
}

const columns: DTColumnsProps<ProductDetail>[] = [
  {
    accessorKey: "productType",
    header: () => <div style={{ textAlign: "center" }}>Product Type</div>,
    cell: ({ row }) => <span>{row.original.productType || "n/a"}</span>,
  },
  {
    accessorKey: "projectManager",
    header: () => <div style={{ textAlign: "center" }}>Project Manager</div>,
    cell: ({ row }) => <span>{row.original.projectManager || "n/a"}</span>,
  },
  {
    accessorKey: "productDescription",
    header: () => (
      <div style={{ textAlign: "center" }}>Product Description</div>
    ),
    cell: ({ row, column }) => {
      const [value, setValue] = useState(
        row.original.productDescription || "n/a"
      );

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        row.original.productDescription = event.target.value;
      };

      return (
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          style={{
            textAlign: "center",
            width: "100%",
            padding: "5px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      );
    },
  },
];

function CreateDealDataTable({ selectedDeal }: { selectedDeal: DealData[] }) {
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);

  useEffect(() => {
    if (selectedDeal && selectedDeal[0]?.productDetails) {
      const productDetailsObject = selectedDeal[0].productDetails;

      const array: ProductDetail[] = Object.entries(productDetailsObject).map(
        ([productIdentifier, details]) => ({
          productIdentifier,
          productType: details.productType || "Unknown",
          projectManager: details.projectManager || "Unknown",
          productDescription: details.productDescription || "No description",
        })
      );

      setProductDetails(array);
    }
  }, [selectedDeal]);

  return <DataTable columns={columns} data={productDetails} />;
}

export default CreateDealDataTable;
