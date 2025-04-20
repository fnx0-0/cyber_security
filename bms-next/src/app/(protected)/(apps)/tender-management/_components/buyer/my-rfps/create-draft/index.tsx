"use client";
import { useState } from "react";
import { Circle, Plus, PlusCircle } from "lucide-react";
import CreateDraftModalForm from "./CreateDraftModalForm";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import Link from "next/link";


//import CreateLeadModalForm from "../../../../deal/details/component/create-deal/CreateLeadModalForm";

function CreateDraftButtonWithModal() {
  const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility
 

  // Toggle modal function
  const toggleModal = () => {
    setModalOpen((prev) => !prev); // Toggle modal visibility
  };
  return (
    <>
      <Link href="./Tender" passHref>
        <IconButtonWithTooltip tooltipContent="Create Draft">
          <Plus />
        </IconButtonWithTooltip>
      </Link>
      {/* <CreateDraftModalForm isOpen={isModalOpen} onClose={toggleModal} /> */}
    </>
  );
}

export default CreateDraftButtonWithModal;
