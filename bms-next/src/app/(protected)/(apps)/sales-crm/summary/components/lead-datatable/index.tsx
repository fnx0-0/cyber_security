'use client'
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";

interface LeadDataTableProps {
    leadsData: any;
    columnSchema?: any;
}

export default function LeadDataTable({ leadsData, columnSchema }: LeadDataTableProps) {
    const columns: DTColumnsProps<any>[] = [
        {
            accessorKey: "categoryName",
            header: ({ column }) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Category</span>
                    </div>
                )
            },
            title: "Category",
            accessorFn: (row) => `${row.category}`
        },
        {
            accessorKey: "totalCount",
            header: ({ column }) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-end' }}>
                        <span>Count</span>
                    </div>
                )
            },
            title: "Count",
            accessorFn: (row) => `${row.count} `
        }
    ];

    // let filterData = getFilterData(documentData);
    const extraParams: any = {
        searching: false,
        filtering: false,
        grouping: false,
        pagination: false, // Disable pagination
        extraTools: []
    }
    return (
        <>
            <DataTable columns={columns} data={leadsData} extraParams={extraParams} />
        </>
    );
}

