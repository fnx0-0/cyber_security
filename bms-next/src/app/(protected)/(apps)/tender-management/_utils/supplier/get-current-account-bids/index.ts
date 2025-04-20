import { getAccount } from "@/ikon/utils/actions/account";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export const getCurrentAccountBids = async () => {
  const account = await getAccount();
  const accountId = account.ACCOUNT_ID;

  try {
    const response = await getMyInstancesV2({
      processName: "Tender Management",
      predefinedFilters: { taskName: "View Tender" },
      processVariableFilters: { accountId: accountId },
      projections : ['Data.tenderId']
    });

    console.log('tender management response', response)

    if(response.length > 0){
        const tenderIdArr = response.map( (res : any) => res.data.tenderId);
        let mongo = '';
        tenderIdArr.forEach((tenderId : any) => {
          mongo += `this.Data.id=='${tenderId}' ||`
        })
        mongo = mongo.slice(0, -2);

        const published: any[] = await getMyInstancesV2({
          processName: "Published Tenders",
          predefinedFilters: { taskName: "View" },
          mongoWhereClause : mongo,
          //* processVariableFilters : { id: idd }
        });


        return published.map((res) => res.data);
    }
  } catch (error) {
    console.error("Failed to get data:", error);
  }
};
