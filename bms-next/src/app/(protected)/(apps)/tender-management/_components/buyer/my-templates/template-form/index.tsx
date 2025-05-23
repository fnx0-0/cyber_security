import { Button } from "@/shadcn/ui/button";
import { Plus, PlusCircle } from "lucide-react";
import { useState } from "react";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import OpenTemplateModal from "./open-template-modal";
import { useRouter } from "next/navigation";

export default function TemplateModal (){

    const [isModalOpen, setModalOpen] = useState(false);
    const router = useRouter();

    const handleCreate = () => {
      router.push("/tender-management/buyer/my-templates/template-editor/new"); // Navigate to create new record
    };


    const toggleModal = () => {
        //setModalOpen((prev) => !prev);

    };
    return (
      <>
        <IconButtonWithTooltip
          tooltipContent="Create Template"
          onClick={handleCreate}
        >
          <Plus />
        </IconButtonWithTooltip>
        <OpenTemplateModal isOpen={isModalOpen} onClose={toggleModal} />
      </>
    );
}