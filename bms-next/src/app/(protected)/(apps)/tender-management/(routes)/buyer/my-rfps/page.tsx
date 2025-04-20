import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import RfpDraftDataTable from "../../../_components/buyer/my-rfps/rfp-draft-datatable";






export default async function MyRFP(){

    const response = await getMyInstancesV2({
      processName: "RFP Draft",
      predefinedFilters: { taskName: "View" },
    });
    const bidCount = await getMyInstancesV2({
      processName: "Tender Management",
      predefinedFilters: { taskName: "View Tender" },
    });
      const rfpDraftData = Array.isArray(response)
        ? response.map((e: any) => e.data)
        : [];
      const bidData = Array.isArray(bidCount)
        ? bidCount.map((e: any) => e.data)
        : [];
      
      for (let i = 0; i < rfpDraftData.length; i++) {
        const tender = bidData.filter(
          (e: any) => e.tenderId === rfpDraftData[i].id
        )
        if (tender) {
          rfpDraftData[i].bidCount = tender.length;
        }
      }
      console.log("rfpDraftData", rfpDraftData);
      console.log("bidData", bidData);

    return (
      <>
        <div className="w-full h-full flex flex-col gap-3">
          <div className="flex-grow overflow-hidden">
            <RfpDraftDataTable draftData={rfpDraftData} />
          </div>
        </div>
      </>
    );
}