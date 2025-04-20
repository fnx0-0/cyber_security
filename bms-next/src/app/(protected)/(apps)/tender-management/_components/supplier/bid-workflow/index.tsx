"use client";
import { CheckCheck } from "lucide-react";
import WorkflowComponent from "../../buyer/my-rfps/rfp-details-page/draft-workflow/workflow-component-draft";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import startBiding, {
  approveDraft,
  backToDraft,
  backToTemplateSelection,
  completeBid,
  proceedToApproval,
  proceedToDraft,
  rejectBid,
  rejectDraft,
} from "../../../_utils/supplier/bid-workflow-functions";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { startTransition, useEffect, useState } from "react";
import getSupplierId from "../../../_utils/supplier/supplier-id";
import getParticularBidData from "../get-particular-bid-data";
import SelectCardModalResponse from "../response-template-selection";
import { useRouter } from "next/navigation";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import ChatWithTextareaModal from "../finalize-respone-draft-form";
import {
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import OpenProfileReview from "../profile-review/page";
import { getAccount } from "@/ikon/utils/actions/account";
import SupplierRegistrationModal from "../../profile/profile-page/supplier-register-modal";
//import moment from "moment";

export default function BidWorkFlow({
  details,
  currentUserGroupDetails,
}: {
  details: any;
  currentUserGroupDetails: any;
}) {
  //const supplierId = getSupplierId();
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [bidData, setBidData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [isTemplateDialogOpen, setisTemplateDialogOpen] = useState(false);
  const [isProfileDialogOpen, openProfileReviewModal] = useState(false);
  const [isResponseCreator, setResponseCreator] = useState(false);
  const [isResponseReviewer, setResponseViewer] = useState(false);
  const [isFinalizeDraftDialogOpen, setisFinalizeDraftDialogOpen] =
    useState(false);
  const [accountId, setAccountId] = useState("");
  const router = useRouter();
  const { openDialog } = useDialog();
  useEffect(() => {
    if (currentUserGroupDetails) {
      const isResponseCreator = currentUserGroupDetails.some(
        (group: any) => group.groupName === "Response Creator"
      );
      const isResponseReviewer = currentUserGroupDetails.some(
        (group: any) => group.groupName === "Response Reviewer"
      );
      setResponseCreator(isResponseCreator);
      setResponseViewer(isResponseReviewer);
      // setResponseCreator(true);
      // setResponseViewer(true);
    }
  }, [currentUserGroupDetails]);

  useEffect(() => {
    const fetchData = async () => {
      const supplierId: any = await getSupplierId();
      setSupplierId(supplierId);
      setIsLoading(true);

      const account = await getAccount();
      setAccountId(account.ACCOUNT_ID);
      const data = await getParticularBidData(details.id, account.ACCOUNT_ID);
      setBidData(data);
      setIsLoading(false);
    };
    fetchData();
  }, [details.id, supplierId]); // Ensure dependencies are included

  const stepTracker = bidData[0]?.bidSteptracker || {};
  console.log("stepTracker", stepTracker);

  useEffect(() => {
    const findCurrentStep = () => {
      for (let step in stepTracker) {
        if (stepTracker[step] === "IN PROGRESS") {
          setCurrentStep(step);
          return; // Exit early to avoid unnecessary state updates
        }
      }
    };
    findCurrentStep();
  }, [bidData]); // Depend only on bidData to avoid unnecessary re-renders

  const handleCloseDialog = () => {
    setisTemplateDialogOpen(false);
    setisFinalizeDraftDialogOpen(false);
    openProfileReviewModal(false);
  };

  if (isLoading) {
    return <div>Loading bid data...</div>;
  }

  console.log("bidData", bidData);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-500";
      case "IN PROGRESS":
        return "text-yellow-500";
      case "PENDING":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const handleGenerateUUID = () => {
    const newUUID = uuidv4();
    console.log("Generated UUID:", newUUID);
    return newUUID;
  };

  const items = [
    {
      name: "Send for Bidding",
      status: stepTracker["Bid Completion"] || "PENDING",
      color: getStatusColor(stepTracker["Bid Completion"] || "PENDING"),
      dropdown: (stepTracker["Bid Completion"] === "IN PROGRESS" && isResponseReviewer) || false,
    },
    {
      name: "Draft Approval",
      status: stepTracker["Approve"] || "PENDING",
      color: getStatusColor(stepTracker["Approve"] || "PENDING"),
      dropdown: (stepTracker["Approve"] === "IN PROGRESS" && isResponseReviewer) || false,
    },
    {
      name: "Response Draft",
      status: stepTracker["Draft"] || "PENDING",
      color: getStatusColor(stepTracker["Draft"] || "PENDING"),
      dropdown: (stepTracker["Draft"] === "IN PROGRESS" && isResponseCreator) || false,
    },
    {
      name: "Response Template Section",
      status: stepTracker["Template Selection"] || "PENDING",
      color: getStatusColor(stepTracker["Template Selection"] || "PENDING"),
      dropdown: (stepTracker["Template Selection"] === "IN PROGRESS" && isResponseCreator) || false,
    },
    {
      name: "Supplier Profile Review",
      status:
        stepTracker["Bid Initialization"] === "COMPLETED"
          ? "COMPLETED"
          : "IN PROGRESS",
      color: getStatusColor(stepTracker["Bid Initialization"] || "PENDING"),
      dropdown: (stepTracker["Bid Initialization"] !== "COMPLETED"  && isResponseCreator) || false,
    },
  ];

  const getActionMenu = (step: string): any[] => {
    switch (step) {
      case "Bid Initialization":
        return [
          {
            btnText: "Review Profile",
            btnIcon: <CheckCheck />,
            btnFn: async () => {
              // const stepTracker = {
              //   "Bid Initialization": "COMPLETED",
              //   "Template Selection": "IN PROGRESS",
              //   Draft: "PENDING",
              //   Approve: "PENDING",
              //   "Bid Completion": "PENDING",
              // };
              // const uid = handleGenerateUUID();
              // const data = {
              //   ...details,
              //   bidSteptracker: stepTracker,
              //   bidId: uid,
              //   supplierId: supplierId,
              // };

              // console.log(data);

              // await startBiding({ tenderData: data });
              // console.log("Instance started");

              // toast.success("Bid Initiated");

              openProfileReviewModal(true);
            },
          },
        ];
      case "Template Selection":
        return [
          {
            btnText: "Proceed to Draft",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("Proceeded to draft");
              if (bidData[0]?.selectedResponseTemplate) {
                await proceedToDraft(bidData[0].id, accountId);
                toast.success("Proceeded to Draft");
                
                // startTransition(() => {
                //   console.log("refreshing............................................");
                setTimeout(() => {
                  router.refresh();
                }, 100);
                   
                // });
                //window.location.reload();
                

              } else {
                openDialog({
                  title: "Alert",
                  description: "Select a template before proceeding",
                  confirmText: "Okay",
                  //  cancelText: "Cancel",
                  //  thirdOptionText: "Print",
                  onConfirm: () => console.log("Confirmed action executed!"),
                  //  onCancel: () => console.log("Cancel action executed!"),
                  //  onThird: () => console.log("Third action executed!"),
                });
              }
            },
          },
          {
            btnText: "Select Template",
            btnIcon: <CheckCheck />,
            btnID: "templateSelectId",
            btnFn: () => {
              console.log("Template Selected");
              setisTemplateDialogOpen(true);
            },
          },
        ];
      case "Draft":
        return [
          {
            btnText: "Proceed to Approval",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("Proceeded to approval");
              if (bidData[0]?.responseDraftFinalized) {
                await proceedToApproval(bidData[0].id, accountId);
                toast.success("Draft Proceeded to Approval");
              } else {
                openDialog({
                  title: "Alert",
                  description: "Review draft before proceeding",
                  confirmText: "Okay",
                  //  cancelText: "Cancel",
                  //  thirdOptionText: "Print",
                  onConfirm: () => console.log("Confirmed action executed!"),
                  //  onCancel: () => console.log("Cancel action executed!"),
                  //  onThird: () => console.log("Third action executed!"),
                });
              }
              startTransition(() => {
                router.refresh();
              });
            },
          },
          {
            btnText: "Finalize Draft",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: () => {
              console.log("finalize draft");
              //setisFinalizeDraftDialogOpen(true);
              router.push(`./${bidData[0].id}/draft-review/${bidData[0].id}`);
            },
          },
          {
            btnText: "Back to Template Selection",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("back");
              await backToTemplateSelection(bidData[0].id, accountId);
              toast.success("Back to Template Selection");
              startTransition(() => {
                router.refresh();
              });
            },
          },
        ];
      case "Approve":
        return [
          {
            btnText: "Approve",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("approve");
              await approveDraft(bidData[0].id, accountId);
              toast.success("Draft Approved");
              startTransition(() => {
                router.refresh();
              });
            },
          },
          {
            btnText: "Reject",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("reject");
              await rejectDraft(bidData[0].id, accountId);
              toast.success("Draft Rejected");
              startTransition(() => {
                router.refresh();
              });
            },
          },
          {
            btnText: "Back to Draft",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("back");
              await backToDraft(bidData[0].id, accountId);
              toast.success("Back to Draft");
              startTransition(() => {
                router.refresh();
              });
            },
          },
        ];
      case "Bid Completion":
        return [
          {
            btnText: "Complete Bid",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("publish draft");
              await completeBid(bidData[0].id, accountId);
              toast.success("Bid Completed");
              bidData[0]["bidSteptracker"]["Bid Completion"] = "COMPLETED";
              const processId = await mapProcessName({
                processName: "Tender Management",
              });
              await startProcessV2({
                processId,
                data: {
                  ...bidData[0],
                  bidCompletionTime: new Date().toISOString(),
                },
                processIdentifierFields: "tenderId,accountId,bidId",
              });
              startTransition(() => {
                router.refresh();
              });
            },
          },
          {
            btnText: "Reject Bid",
            btnIcon: <CheckCheck />,
            //btnID: "templateSelectId",
            btnFn: async () => {
              console.log("back");
              await rejectBid(bidData[0].id, accountId);
              toast.success("Bid Rejected");
              startTransition(() => {
                router.refresh();
              });
            },
          },
        ];
      default:
        return [];
    }
  };

  const RfpDraftActionBtns = getActionMenu(
    currentStep ? currentStep : "Bid Initialization"
  );

  return (
    <>
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Workflow</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <CardDescription>
            <WorkflowComponent
              items={items}
              RfpDraftActionBtns={RfpDraftActionBtns}
            />
          </CardDescription>
        </CardContent>
      </Card>
      {isTemplateDialogOpen && (
        <SelectCardModalResponse
          isOpen={isTemplateDialogOpen}
          onClose={handleCloseDialog}
          draftId={details.id}
          accountId={accountId}
        />
      )}
      {isFinalizeDraftDialogOpen && (
        <ChatWithTextareaModal
          isOpen={isFinalizeDraftDialogOpen}
          onClose={handleCloseDialog}
          draftId={details.id}
          accountId={accountId}
        />
      )}

      {isProfileDialogOpen && (
        <SupplierRegistrationModal
          isOpen={isProfileDialogOpen}
          onClose={handleCloseDialog}
          accountId={accountId}
          openedFrom={"review"}
          tenderId={details.id}
        />
      )}
    </>
  );
}
