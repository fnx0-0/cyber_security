"use client";

import { useState, useEffect } from "react";
import TenderColaborationSection from "@/app/(protected)/(apps)/tender-management/_components/buyer/my-rfps/tender-flow-components/tender-colaboration";
import TenderDetails from "@/app/(protected)/(apps)/tender-management/_components/buyer/my-rfps/tender-flow-components/tender-details";
import TenderWorkflow from "@/app/(protected)/(apps)/tender-management/_components/buyer/my-rfps/tender-flow-components/tender-workflow";
import {
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";

import { Button } from "@/shadcn/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { toast } from "sonner";
import { getMyProfileData } from "@/app/(protected)/(apps)/tender-management/_utils/profile/get-profile-data";
import SupplierProfile from "@/app/(protected)/(apps)/tender-management/_components/profile/profile-page/SupplierProfile";

export default function BidPage({
  params,
}: {
  params: Promise<{ bidId: string }>;
}) {
  const [bidId, setBidId] = useState<string | null>(null);
  const [tenderDetails, setTenderDetails] = useState<any>(null);
  const [bidData, setBidData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);

  // Unwrap the params Promise
  useEffect(() => {
    async function fetchParams() {
      const resolvedParams = await params;
      setBidId(resolvedParams?.bidId || "");
    }
    fetchParams();
  }, [params]);

  useEffect(() => {
    async function fetchData() {
      if (!bidId) return;

      const response = await getMyInstancesV2({
        processName: "Tender Management",
        predefinedFilters: { taskName: "View Tender" },
        processVariableFilters: { bidId },
      });

      if (response.length > 0) {
        const bidInfo = response[0].data;
        setBidData(bidInfo);

        const responseData = await getMyInstancesV2({
          processName: "Tender Management",
          predefinedFilters: { taskName: "View Tender" },
          processVariableFilters: {
            tenderId: (bidInfo as any).tenderID,
            accountId: (bidInfo as any).accountId,
          },
        });

        if (responseData.length > 0) {
          setTenderDetails(responseData[0].data);
        }

        try {
          const data: any = await getMyProfileData((bidInfo as any).accountId);
          setProfileData(data);
        } catch (error) {
          toast.error("Error in fetching data");
        }
      }
    }

    fetchData();
  }, [bidId]);

  console.log("profiledata--------->", profileData);
  async function bidShortList() {
    if (!bidId) return;

    console.log("Shortlist");

    const softwareId = await getSoftwareIdByNameVersion(
      "Tender Management",
      "1"
    );
    const response = await getMyInstancesV2({
      processName: "Tender Management",
      predefinedFilters: { taskName: "Bidding Started" },
      processVariableFilters: { bidId },
    });

    if (response.length > 0) {
      const taskId = response[0].taskId;
      const taskData: any = response[0].data;
      const tenderFlow = {
        "Awarded Tender": "PENDING",
        "Contract Finalisation": "PENDING",
        "Supplier Negotiation": "IN PROGRESS",
        "Supplier Shortlisted": "COMPLETED",
      };

      await invokeAction({
        taskId: taskId,
        transitionName: "Go to Bid Shortlisting & Negotiations",
        data: {
          ...taskData,
          bidStatus: "shortlisted",
          tenderFlow: tenderFlow,
        },
        processInstanceIdentifierField: "bidId,tenderId",
        softwareId: softwareId,
      });
      toast.success("Shortlisted");
    }
  }

  if (!bidData) {
    return <p>Loading...</p>;
  }

  if (bidData.bidStatus == "shortlisted") {
    return (
      <>
        <div className="grid grid-cols-3 gap-4 h-full">
          <div className="col-span-1 h-full">
            <div className="flex justify-between flex-col items-center gap-4 h-full">
              <TenderDetails bidData={bidData} />
              {/* <Workflow
                      draftDetails={
                        draftDetails
                      } 
                    /> */}
              <TenderWorkflow bidData={bidData} />
            </div>
          </div>
          <div className="col-span-2">
            {/* <DraftView draftDetails={draftDetails} /> */}
            <TenderColaborationSection />
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        {/* Button above Tabs */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={bidShortList}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Shortlist Bid
          </Button>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tender">Tender Response</TabsTrigger>
            <TabsTrigger value="supplier">Supplier Details</TabsTrigger>
          </TabsList>

          <TabsContent value="tender">
            {tenderDetails?.responseDraftContent || "No response available"}
          </TabsContent>

          <TabsContent value="supplier">
            <SupplierProfile
              supplierDetails={
                profileData && profileData.supplierDetails
                  ? profileData.supplierDetails
                  : null
              }
            />
          </TabsContent>
        </Tabs>
      </>
    );
  }
}
