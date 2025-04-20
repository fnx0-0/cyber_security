"use client";
import { useState } from "react";
// import ButtonWithTooltip from '@/components/ikon-components/buttonWithTooltip';
import { Circle, Plus, PlusCircle } from "lucide-react";
import AssignmentModal from "./createAssignmentModalForm";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
// import CreateLeadModalForm from "./CreateLeadModalForm";
//import CreateLeadModalForm from "../../../../deal/details/component/create-deal/CreateLeadModalForm";

function CreateAssignmentButtonWithModal() {
  const [isModalOpen, setModalOpen] = useState(false); //State to control modal visibility

  // Toggle modal function
  const toggleModal = () => {
    setModalOpen((prev) => !prev); // Toggle modal visibility
  };

  return (
    <>
      <IconButtonWithTooltip
        tooltipContent="Create Assignment"
        onClick={toggleModal}
      >
        <Plus />
      </IconButtonWithTooltip>
      <AssignmentModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
}

export default CreateAssignmentButtonWithModal;
