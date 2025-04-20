import { Button } from "@/shadcn/ui/button";
import { Plus, PlusCircle } from "lucide-react";
import { useState } from "react";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import OpenResponseTemplateModal from "../response-template-modal";
import { useRouter } from "next/navigation";

export default function ResponseTemplateModal() {
  const [isModalOpen, setModalOpen] = useState(false);
   const router = useRouter();

  const toggleModal = () => {
    //setModalOpen((prev) => !prev);
    router.push("/tender-management/supplier/template/template-editor/new"); // Navigate to create new record
  };
  return (
    <>
      <IconButtonWithTooltip
        tooltipContent="Create Template"
        onClick={toggleModal}
      >
        <Plus />
      </IconButtonWithTooltip>
      <OpenResponseTemplateModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
}
