import React from "react";

import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Checkbox } from "@/shadcn/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/shadcn/ui/select";

export default function DatasetColumnTypeSelection({
  selectedColumnSchema,
  sheetId,
  sheetNameSheetIdMap,
  completeData,
}) {
  let coldata = selectedColumnSchema[sheetNameSheetIdMap[sheetId]];

  const selectDeselectColumns = (id, column, sheetId) => {
    const checkbox = document.getElementById(id);

    const displayColumn = document.getElementById(
      `displayColumn_${column}_${sheetId}`
    );
    const datasetColumn = document.getElementById(
      `datasetColumn_${column}_${sheetId}`
    );

    if (!checkbox || !displayColumn || !datasetColumn) return;

    if (checkbox.getAttribute("data-state") == "unchecked") {
      displayColumn.disabled = false;
      datasetColumn.disabled = false;

      let selectedColumn = null;
      const fieldArr = Object.keys(completeData[sheetId]["fields"]);

      for (let i = 0; i < fieldArr.length; i++) {
        if (completeData[sheetId]["fields"][fieldArr[i]].dbKey === column) {
          selectedColumn = fieldArr[i];
          break;
        }
      }

      if (selectedColumn) {
        selectedColumnSchema[sheetNameSheetIdMap[sheetId]].push({
          originalKey: completeData[sheetId]["fields"][selectedColumn].title,
          modifiedKey: displayColumn.value,
          type: datasetColumn.value,
          dbKey: completeData[sheetId]["fields"][selectedColumn].dbKey,
        });
      }
    } else {
      // When a column is deselected, disable inputs
      displayColumn.disabled = true;
      datasetColumn.disabled = true;

      const tempArr = selectedColumnSchema[sheetNameSheetIdMap[sheetId]];
      for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i].dbKey === column) {
          tempArr.splice(i, 1);
          break;
        }
      }
    }
  };

  const columnDetailsSchema: DTColumnsProps<any>[] = [
    {
      accessorKey: "originalKey",
      header: "Excel Column",
      cell: ({ row }) => (
        <>
          <Checkbox
            id={`checkBox_${row.original.dbKey}_${sheetId}`}
            className="form-check-input"
            name={`checkBox_${row.original.dbKey}_${sheetId}`}
            defaultChecked={true}
            onClick={(e) => {
              console.log("insidew on click for originla key");
              // Replace this with the corresponding JavaScript function call
              selectDeselectColumns(e.target.id, row.original.dbKey, sheetId);
            }}
          />

          <Label
            htmlFor={`checkBox_${row.original.dbKey}_${sheetId}`}
            className="form-check-label"
          >
            {row.original.originalKey}
          </Label>
        </>
      ),
    },
    {
      accessorKey: "modifiedKey",
      header: "Dataset Column",
      cell: ({ row }) => (
        <Input
          id={`displayColumn_${row.original.dbKey}_${sheetId}`}
          className="uniqColumnName"
          type="text"
          value={row.original.modifiedKey || "n/a"}
        />
      ),
    },
    {
      accessorKey: "type",
      header: "Data Type",
      cell: ({ row }) => {
        const typeOptions = ["STRING", "NUMBER", "DATE"];
        const selectedType = row.original.type?.toUpperCase() || "";

        return (
          <Select defaultValue={selectedType}>
            <SelectTrigger
              id={`datasetColumn_${row.original.dbKey}_${sheetId}`}
              className="selectTag typeMatch w-full"
            >
              <SelectValue placeholder="Select Column" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },

    // {
    //   accessorKey: "type",
    //   header: "Data Type",
    //   cell: ({ row }) => {
    //     const baseOptions = `<option value="" selected disabled>Select Column</option>
    //             <option value="STRING">STRING</option>
    //             <option value="NUMBER">NUMBER</option>
    //             <option value="DATE">DATE</option> `;

    //     const type = row.original.type.toLowerCase();
    //     const options = {
    //       string: baseOptions.replace(
    //         'value="STRING"',
    //         'value="STRING" selected'
    //       ),
    //       number: baseOptions.replace(
    //         'value="NUMBER"',
    //         'value="NUMBER" selected'
    //       ),
    //       date: baseOptions.replace('value="DATE"', 'value="DATE" selected'),
    //     };

    //     const optionContent = options[type] || baseOptions;

    //     return (
    //       <Select
    //         id={`datasetColumn_${row.original.dbKey}_${0}`}
    //         className="form-select selectTag typeMatch w-full"
    //         // onChange={(e) => {
    //         //   // Handle the change event here if needed
    //         //   // Example: Form[uid].changeDatsetColumnType(row.original.dbKey, e.target.value, sheetId);
    //         // }}
    //       >
    //         {optionContent}
    //       </Select>
    //     );
    //   },
    // },
  ];

  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
  };
  return (
    <DataTable
      columns={columnDetailsSchema}
      data={coldata}
      extraParams={extraParams}
    />
  );
}
