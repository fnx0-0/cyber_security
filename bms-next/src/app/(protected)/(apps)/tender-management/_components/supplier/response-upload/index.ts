"use server"
import { singleFileUpload } from "@/ikon/utils/api/file-upload";
import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";

export const responseUpload = async (rfpData: Record<string, any>) => {
  try {
    const resourceData = await singleFileUpload(rfpData.file);
    console.log("File upload result:", resourceData);
    delete rfpData.file;
    rfpData.resourceData = resourceData;
    const processId = await mapProcessName({processName: "Response Upload",});
   await startProcessV2({processId, data: rfpData, processIdentifierFields: "responseData.id",});

  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};