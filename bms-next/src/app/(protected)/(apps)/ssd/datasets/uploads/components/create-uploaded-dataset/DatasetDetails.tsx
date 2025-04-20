import React, { useState } from "react";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";

import { TextButton } from "@/ikon/components/buttons";
import { Textarea } from "@/shadcn/ui/textarea";
import { Select } from "@/shadcn/ui/select";

interface ConfigurationProps {
  sheetId: string;
  name: string;
  description: string;
  updateName: (newName: string) => void;
  updateDescription: (newDescription: string) => void;
}
export default function DatasetDetails({
  sheetId,
  name,
  description,
  updateName,
  updateDescription,
}: ConfigurationProps) {
  const [selectedValue, setSelectedValue] = useState<string>("NEW");

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };
  return (
    <div className="max-h-[70vh] overflow-y-auto h-[85vh]">
      {/* <div className="d-flex" id={`configurationDiv_${sheetId}`}>
        <div className="form-check me-3">
          <Input
            className="form-check-input"
            type="radio"
            id={`newDatasetSelect_${sheetId}`}
            name={`actionOnDataset_${sheetId}`}
            value="NEW"
          />
          <Label
            className="form-check-label"
            htmlFor={`newDatasetSelect_${sheetId}`}
          >
            NEW
          </Label>
        </div>
        <div className="form-check me-3">
          <Input
            className="form-check-input"
            type="radio"
            id={`appendDatasetSelect_${sheetId}`}
            name={`actionOnDataset_${sheetId}`}
            value="APPEND"
          />
          <Label
            className="form-check-label"
            htmlFor={`appendDatasetSelect_${sheetId}`}
          >
            APPEND
          </Label>
        </div>
        <div className="form-check me-3">
          <Input
            className="form-check-input"
            type="radio"
            id={`replaceDatasetSelect_${sheetId}`}
            name={`actionOnDataset_${sheetId}`}
            value="REPLACE"
          />
          <Label
            className="form-check-label"
            htmlFor={`replaceDatasetSelect_${sheetId}`}
          >
            REPLACE
          </Label>
        </div>
      </div> */}
      <div id={`configurationDiv_${sheetId}`}>
        <RadioGroup
          value={selectedValue}
          onValueChange={handleChange}
          className="flex mt-3"
        >
          <RadioGroupItem
            value="NEW"
            id={`newDatasetSelect_${sheetId}`}
            name={`actionOnDataset_${sheetId}`}
          />
          <Label htmlFor={`newDatasetSelect_${sheetId}`}>NEW</Label>

          <RadioGroupItem
            value="APPEND"
            id={`appendDatasetSelect_${sheetId}`}
            name={`actionOnDataset_${sheetId}`}
          />
          <Label htmlFor={`appendDatasetSelect_${sheetId}`}>APPEND</Label>

          <RadioGroupItem
            value="REPLACE"
            id={`replaceDatasetSelect_${sheetId}`}
            name={`actionOnDataset_${sheetId}`}
          />
          <Label
            className="form-check-label"
            htmlFor={`replaceDatasetSelect_${sheetId}`}
          >
            REPLACE
          </Label>
        </RadioGroup>
      </div>
      <div
        className="get-dataset-name-modal-form-container "
        id="getDatasetNameModalFormContainer"
      >
        <div
          id="newDatasetNameDiv"
          className="dataset-name-input-group-wrapper mt-3 gap-2 grid"
        >
          <Label htmlFor={`datasetNameField_${sheetId}`} className="form-label">
            Dataset Name &nbsp;*
          </Label>
          <Input
            id={`datasetNameField_${sheetId}`}
            type="text"
            className="datasetNameField"
            placeholder="Enter Dataset Name"
            value={name}
            // onChange={(e) => setDatasetName(e.target.value)}
            onChange={(e) => updateName(e.target.value)}
            required
          />
        </div>

        <div id="editExsistingDataset" className="mt-3 hidden">
          {/* <Select
            label="Select Dataset"
            options={[
              { value: "", label: "Select Dataset" }, // Default placeholder option
              // Dynamically add dataset options here
            ]}
            isMulti={false}
            placeholder="Choose dataset"
            allowCreate={false}
            menuPlacement="bottom"
            //   onChange={(selected) => setSelectedDataset((selected as OptionType).value)}
          /> */}
        </div>

        <div className="dataset-name-input-group-wrapper">
          <div className="dataset-name-input-group-container gap-2 grid mt-3">
            <Label htmlFor={`datasetDescription_${sheetId}`}>
              Dataset Description
            </Label>
            <Textarea
              placeholder="Enter Dataset Description"
              rows={5}
              id={`datasetDescription_${sheetId}`}
              value={description}
              onChange={(e) => updateDescription(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
