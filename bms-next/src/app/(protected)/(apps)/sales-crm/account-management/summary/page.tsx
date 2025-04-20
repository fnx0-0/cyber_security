import { WidgetProps } from "@/ikon/components/widgets/type";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { Card } from "../../../ai-workforce/components/ui/Card";
import { CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";


export default async function AccountSummary() {
  const activeDealsInstanceData = await getMyInstancesV2({
    processName: "Deal",
    predefinedFilters: { taskName: "View State" },
    mongoWhereClause: 'this.Data.dealStatus != "Won" && this.Data.dealStatus != "Lost" && this.Data.dealStatus != "Suspended" && this.Data.activeStatus != "Wom" && this.Data.activeStatus != "Deal Lost" && this.Data.activeStatus != "Suspended"',
    projections: ["Data.dealIdentifier", "Data.dealName", "Data.dealStatus", "Data.activeStaus"],
  });
  const activeDealsData = activeDealsInstanceData.map((e: any) => e.data);
  console.log('activeDealsData', activeDealsData)
  const wonDealsInstanceData = await getMyInstancesV2({
    processName: "Deal",
    predefinedFilters: { taskName: "View State" },
    mongoWhereClause: 'this.Data.dealStatus == "Won"',
    projections: ["Data.dealIdentifier", "Data.dealName", "Data.dealStatus", "Data.activeStaus", "Data.formattedActualRevenueIncludingVAT_contracted", "Data.isDebtRevenue"],
  });
  const wonDealsData = wonDealsInstanceData.map((e: any) => e.data);
  console.log('wonDealsData', wonDealsData)
  var totalRevemue = 0;
  for (var i = 0; i < wonDealsData.length; i++) {
    if (wonDealsData[i].isDebtRevenue == false) {
      totalRevemue += parseFloat(wonDealsData[i].formattedActualRevenueIncludingVAT_contracted);
    }
  }
  console.log('totalRevemue', totalRevemue)
  const lostDealsInstanceData = await getMyInstancesV2({
    processName: "Deal",
    predefinedFilters: { taskName: "View State" },
    mongoWhereClause: 'this.Data.dealStatus == "Lost"',
    projections: ["Data.dealIdentifier", "Data.dealName", "Data.dealStatus", "Data.activeStaus"],
  });
  const lostDealsData = lostDealsInstanceData.map((e: any) => e.data);
  console.log('lostDealsData', lostDealsData)

  const accountInsData = await getMyInstancesV2({
    processName: "Account",
    predefinedFilters: { taskName: "View State" },
    projections: ["Data"],
  });

  const accountData = accountInsData.map((e: any) => e.data);
  console.log('accountData', accountData)
  var accountIdWiseAccountNameMap: { [key: string]: string } = {};
  for (var i = 0; i < accountData.length; i++) {
    accountIdWiseAccountNameMap[accountData[i].accountIdentifier] = accountData[i].accountName;
  }
  const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();



  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="flex-grow overflow-y-auto pr-2">
        <div className="grid grid-cols-12">
          <div className="col-span-12 m-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Account Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                details
              </CardContent>
            </Card>
          </div>
          <div className="col-span-6 m-2">
          <Card className="h-full">
              <CardHeader>
                <CardTitle>Top 5 Deals By Expected Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                details
              </CardContent>
            </Card>
            </div>
            <div className="col-span-6 m-2">
          <Card className="h-full">
              <CardHeader>
                <CardTitle>Top 5 Accounts By Expected Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                details
              </CardContent>
            </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
