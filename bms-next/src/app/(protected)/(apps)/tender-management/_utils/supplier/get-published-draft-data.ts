import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export default async function getPublishedDraft() {
  const response: any[] = await getMyInstancesV2({
    processName: "Published Tenders",
    predefinedFilters: { taskName: "View" },
    //* processVariableFilters : { id: idd }
  });
  const rfpDraftData = response.map((item) => item.data);

  return rfpDraftData;
}

export async function getPublishedDraftById(draftId: any) {
  const response: any[] = await getMyInstancesV2({
    processName: "Published Tenders",
    predefinedFilters: { taskName: "View" },
    processVariableFilters: { id: draftId },
  });
  const rfpDraftData = response.map((item) => item.data);

  return rfpDraftData[0];
}
