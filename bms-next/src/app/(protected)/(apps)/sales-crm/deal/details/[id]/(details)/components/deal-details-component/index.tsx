import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
//import DropdownMenuWithEditLead from "../../components_edit_lead/lead_data_definition/DropdownMenuWithEditLead";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { DealData, ProductDetailsData } from "@/app/(protected)/(apps)/sales-crm/components/type";
import DropdownMenuWithEditDeal from "../../component_edit_deal/deal_form_definition/DropdownMenuWithEditDeal";
import QuotationButtonAndModal from "../Quotation/quotationButtonAndModal";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";

//const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();

export default async function DealDetailsComponent({ dealIdentifier }: { dealIdentifier: string }): Promise<ReactNode> {
  //const [isModalOpen, setIsModalOpen] = useState(false);
  

  const dealData = await getMyInstancesV2<DealData>({
    processName: "Deal",
    predefinedFilters: { taskName: "View State" },
    mongoWhereClause: `this.Data.dealIdentifier == "${dealIdentifier}"`,
    projections: [
      "Data.dealName",
      "Data.dealIdentifier",
      "Data.accountManager",
      "Data.dealStatus",
      "Data.dealStartDate",
      "Data.expectedRevenue",
      "Data.formattedActualRevenueIncludingVAT_contracted",
      "Data.currency",
    ],
  });
  console.log("dealIdWiseDealData", dealData);
  const dealIdWiseDealData = dealData[0].data;
  const currency = dealIdWiseDealData.currency || "USD";

  const productData = await getMyInstancesV2<ProductDetailsData>({
    processName: "Product",
    predefinedFilters: { taskName: "View State" },
    processVariableFilters: { "dealIdentifier": dealIdentifier }
  });
  //const productIdentifierWiseDataObj = {};
  // if (productData.length) {
  //   productData.forEach((product) => {
  //     const productDetails = product.data || {};
  //     productIdentifierWiseDataObj[productDetails.productIdentifier] = productDetails;
  //   });
  // } 
  const productIdentifierWiseDataObj = productData.map((product) => product.data);
  console.log("productIdentifierWiseDataObj", productIdentifierWiseDataObj);

  return (
    <Card className="h-1/2 flex flex-col">
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 4,
          title: dealIdWiseDealData.dealName || "Untitled Deal",
          href: `/sales-crm/deal/details/${dealIdentifier}`,
        }}
      />
      <CardHeader className="flex flex-row justify-between items-center border-b">
        <CardTitle>Deal Details</CardTitle>

        <DropdownMenuWithEditDeal dealIdentifier={dealIdentifier} />
      </CardHeader>
      <CardContent className="grid gap-2 p-0 overflow-hidden">
        <div className="flex flex-col flex-grow overflow-auto">
          <span className="flex gap-2 align-middle border-b py-2 px-3">
            Deal Name : {dealIdWiseDealData.dealName}
          </span>
          <span className="flex gap-2 align-middle border-b py-2 px-3">
            Account Manager :{" "}
            {dealIdWiseDealData?.accountDetails?.accountManager || "n/a"}
          </span>
          <span className="flex gap-2 align-middle border-b py-2 px-3">
            Deal Status : {dealIdWiseDealData.dealStatus || "n/a"}
          </span>
          <span className="flex gap-2 align-middle border-b py-2 px-3">
            Expected Deal Closing Date :{" "}
            {dealIdWiseDealData.dealStartDate || "n/a"}
          </span>
          <span className="flex gap-2 align-middle border-b py-2 px-3">
            Expected Revenue : {dealIdWiseDealData.expectedRevenue || "n/a"}
          </span>
          <span className="flex gap-2 align-middle border-b py-2 px-3">
            Actual Revenue :{" "}
            {dealIdWiseDealData.formattedActualRevenueIncludingVAT_contracted ||
              "n/a"}
          </span>
          <span className="flex gap-2 align-middle border-b py-2 px-3">
            Currency : {dealIdWiseDealData.currency || "n/a"}
          </span>
        </div>

        {dealIdWiseDealData.dealStatus === "Product Submitted for Quotation" && (
          <div className="flex justify-center mb-2">
            <QuotationButtonAndModal productIdentifierWiseDataObj={productIdentifierWiseDataObj} currency={currency} dealIdentifier={dealIdentifier}/>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
