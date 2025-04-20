import React, { useState } from "react";
import DatasetTypeSelectModal from "./DatasetTypeSelectModal";
import CreateNewDatasetModalForm from "./CreateNewDatasetModalForm";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus } from "lucide-react";

export default function CreateUploadedPage() {
  const [isDatasetTypeModalOpen, setIsDatasetTypeModalOpen] = useState(false);
  const [isCreateDatasetModalOpen, setIsCreateDatasetModalOpen] =
    useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleDatasetType = (type: string) => {
    console.log("Selected Dataset Type:", type);
    setSelectedType(type);
    setIsDatasetTypeModalOpen(false);
    setIsCreateDatasetModalOpen(true);
  };

  return (
    <div>
      <IconTextButtonWithTooltip
        tooltipContent="Create new Dataset"
        onClick={() => setIsDatasetTypeModalOpen(true)}
      >
        <Plus />
      </IconTextButtonWithTooltip>

      <DatasetTypeSelectModal
        isOpen={isDatasetTypeModalOpen}
        onClose={() => setIsDatasetTypeModalOpen(false)}
        onDatasetSelect={handleDatasetType}
      />

      {selectedType && (
        <CreateNewDatasetModalForm
          isOpen={isCreateDatasetModalOpen}
          onClose={() => setIsCreateDatasetModalOpen(false)}
          datasetType={selectedType}
        />
      )}
    </div>
  );
}
