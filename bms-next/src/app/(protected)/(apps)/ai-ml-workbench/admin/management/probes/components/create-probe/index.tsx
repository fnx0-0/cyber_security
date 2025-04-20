"use client";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus } from "lucide-react";
//import CreateLeadModalForm from "../../../../deal/details/component/create-deal/CreateLeadModalForm";

function CreateProbeButtonWithModal() {
  // const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility

  // // Toggle modal function
  // const toggleModal = () => {
  //   setModalOpen((prevModalState) => !prevModalState); // Toggle modal visibility
  // };
  return (
    <>
      <IconButtonWithTooltip
        tooltipContent="Create New Probe"
        // onClick={toggleModal}
      >
        <Plus />
      </IconButtonWithTooltip>
      {/* <CreateLeadModalForm isOpen={isModalOpen} onClose={toggleModal} /> */}
    </>
  );
}

export default CreateProbeButtonWithModal;
