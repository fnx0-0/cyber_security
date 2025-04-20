import { singleFileUpload } from "@/ikon/utils/api/file-upload";
import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";

export const startRfpDraft = async (newDraft: Record<string, any>) => {
  const biddingDocs = await singleFileUpload(newDraft.biddingDocs[0]);
  newDraft.biddingDocs = biddingDocs;
  const techSpecsDocs = await singleFileUpload(newDraft.techSpecsDocs[0]);
  newDraft.techSpecsDocs = techSpecsDocs;
   const draftContract = await singleFileUpload(newDraft.draftContract[0]);
  newDraft.draftContract = draftContract;
   const billQuantities = await singleFileUpload(newDraft.billQuantities[0]);
  newDraft.billQuantities = billQuantities;
   const specialInstructions = await singleFileUpload(newDraft.specialInstructions[0]);
  newDraft.specialInstructions = specialInstructions;
  newDraft = {...newDraft,
    "stepTracker" : {
      "Draft Creation" : "COMPLETED",
      "Template Selection" : "IN PROGRESS",
      "Draft" : "PENDING",
      "Approval" : "PENDING",
      "Publish" : "PENDING"
    }
  }
  try {
    const processId = await mapProcessName({ processName: "RFP Draft" });
    await startProcessV2({
      processId,
      data: newDraft,
      processIdentifierFields: "id",
    });
  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};

export const editRfpData = async (draftId : string, editedDraft: Record<string, any>) => {
  try {
    const response = await getMyInstancesV2({
        processName: "RFP Draft",
        predefinedFilters: { taskName: "Draft" },
        processVariableFilters: { id: draftId },
      });

      if(response.length > 0){
        const taskId = response[0].taskId;
        const biddingDocs = await singleFileUpload(editedDraft.biddingDocs[0]);
        editedDraft.biddingDocs = biddingDocs;
        const techSpecsDocs = await singleFileUpload(editedDraft.techSpecsDocs[0]);
        editedDraft.techSpecsDocs = techSpecsDocs;
        const draftContract = await singleFileUpload(editedDraft.draftContract[0]);
        editedDraft.draftContract = draftContract;
        const billQuantities = await singleFileUpload(editedDraft.billQuantities[0]);
        editedDraft.billQuantities = billQuantities;
        const specialInstructions = await singleFileUpload(editedDraft.specialInstructions[0]);
        editedDraft.specialInstructions = specialInstructions;
        await invokeAction({
          taskId: taskId,
          transitionName: "draft edit",
          data: editedDraft,
          processInstanceIdentifierField: "id",
        });
      }

  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
}
