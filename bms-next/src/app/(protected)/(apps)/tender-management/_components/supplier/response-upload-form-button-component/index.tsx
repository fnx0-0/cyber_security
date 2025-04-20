"use client";
import { useState } from "react";
import { Plus, PlusCircle } from "lucide-react";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import OpenModal from "../response-upload-form";

export default function CreateResponseUploadButtonWithModal() {
  const [isModalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  return (
    <>
      <IconButtonWithTooltip tooltipContent="Upload Response" onClick={toggleModal}>
        <Plus />
      </IconButtonWithTooltip>
      <OpenModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
}
