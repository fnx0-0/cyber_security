import {
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";

export const startNewServer = async (newServer: Record<string, any>) => {
  const processId = await mapProcessName({ processName: "ML Workspace" });
  await startProcessV2({
    processId,
    data: newServer,
    processIdentifierFields: "probeId,workspaceId",
  });
};
