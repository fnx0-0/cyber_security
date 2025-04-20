import {
  mapProcessName,
  startProcessV2,
} from "@/lib/api/processRuntimeService";

export const startProjectData = async (newProject: Record<string, any>) => {
  try {
    const processId = await mapProcessName({ processName: "Alert Rule" });
    await startProcessV2({
      processId,
      data: newProject,
      processIdentifierFields: "newLead.projectId",
    });
  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};


