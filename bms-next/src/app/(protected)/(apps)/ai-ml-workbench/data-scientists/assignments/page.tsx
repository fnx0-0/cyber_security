// import { getMyInstancesV2 } from "@/lib/api/processRuntimeService";
// import { WidgetProps } from "@/components/ikon-components/widgets/type";
// import LeadWidget, {
//   widgetNumberClickedFunction,
// } from "./components/lead-widget";
// import { LeadData } from "../../components/type";
import AssignmentDataTable from "./assignment-datatable";
import AssignmentWidget from "./assignment-widget";
import { AssignemntData } from "../../components/type";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { WidgetProps } from "@/ikon/components/widgets/type";

export default async function Lead() {
  const assignmentsData = await getMyInstancesV2<AssignemntData>({
    processName: "Assignments",
    predefinedFilters: { taskName: "Assignment Update Activity" },
  });
  console.log("assignmentsData-----", assignmentsData);
  const assignmentsDataDynamic = Array.isArray(assignmentsData)
    ? assignmentsData.map((e: any) => e.data)
    : [];
  console.log("assignmentsDataDynamic-----", assignmentsDataDynamic);
  interface LeadStatus {
    Lead: number;
    totalLeads: number;
    activeLeads: number;
    closedLeads: number;
    wonLeads: number;
  }

  const leadStatus: LeadStatus = {
    Lead: 0,
    totalLeads: 0,
    activeLeads: 0,
    closedLeads: 0,
    wonLeads: 0,
  };

  // for (let i = 0; i < leadsDataDynamic.length; i++) {
  //   if (
  //     leadsDataDynamic[i].leadStatus == "Lead Created" ||
  //     leadsDataDynamic[i].leadStatus == "Rejected From Lead" ||
  //     leadsDataDynamic[i].leadStatus == "Discovery Created" ||
  //     leadsDataDynamic[i].leadStatus == "Opportunity Created From Lead" ||
  //     leadsDataDynamic[i].leadStatus == "Recall Lead From Discovery" ||
  //     leadsDataDynamic[i].leadStatus == "Rejected From Discovery" ||
  //     leadsDataDynamic[i].leadStatus == "Opportunity Created From Discovery" ||
  //     leadsDataDynamic[i].leadStatus == "Recall Discovery From Opportunity" ||
  //     leadsDataDynamic[i].leadStatus == "Rejected From Opportunity" ||
  //     leadsDataDynamic[i].leadStatus == "Proposal Prepared" ||
  //     leadsDataDynamic[i].leadStatus == "Recall Opportunity From Proposal" ||
  //     leadsDataDynamic[i].leadStatus == "Rejected From Proposal" ||
  //     leadsDataDynamic[i].leadStatus == "Proposal Submitted To Client" ||
  //     leadsDataDynamic[i].leadStatus == "Recall Lead From Negotiation" ||
  //     leadsDataDynamic[i].leadStatus == "Recall Discovery From Negotiation" ||
  //     leadsDataDynamic[i].leadStatus == "New Proposal Requested" ||
  //     leadsDataDynamic[i].leadStatus == "Rejected From Negotiation" ||
  //     leadsDataDynamic[i].leadStatus == "Won" ||
  //     leadsDataDynamic[i].leadStatus == "Account Created" ||
  //     leadsDataDynamic[i].leadStatus == "New Proposal Requested" ||
  //     leadsDataDynamic[i].leadStatus == "Deal In Progress" ||
  //     leadsDataDynamic[i].leadStatus == "Deal Lost"
  //   ) {
  //     ++leadStatus.Lead;
  //   }
  //   if (
  //     leadsDataDynamic[i].leadStatus != "Account Created" &&
  //     leadsDataDynamic[i].leadStatus != "Deal Lost"
  //   ) {
  //     ++leadStatus.activeLeads;
  //   }
  //   if (
  //     leadsDataDynamic[i].leadStatus == "Account Created" ||
  //     leadsDataDynamic[i].leadStatus == "Deal Lost"
  //   ) {
  //     ++leadStatus.closedLeads;
  //   }
  //   if (
  //     leadsDataDynamic[i].leadStatus == "Won" ||
  //     leadsDataDynamic[i].leadStatus == "Account Created"
  //   ) {
  //     ++leadStatus.wonLeads;
  //   }
  //   if (
  //     leadsDataDynamic[i].leadStatus == "Won" ||
  //     leadsDataDynamic[i].leadStatus == "Account Created" ||
  //     leadsDataDynamic[i].leadStatus == "Deal Lost"
  //   ) {
  //     ++leadStatus.totalLeads;
  //   }
  // }

  const WidgetData: WidgetProps[] = [
    {
      id: "totalLeadCount",
      widgetText: "Total Assignment(s)",
      widgetNumber: "2",
      iconName: "sticky-note",
    },
    {
      id: "totalWonLeadCount",
      widgetText: "Assignment(s) - Done",
      widgetNumber: "4",
      iconName: "trophy",
      // onButtonClickfunc: widgetNumberClickedFunction,
    },
    {
      id: "totalClosedLeadCount",
      widgetText: "Assignment(s) - Ongoing",
      widgetNumber: "4",
      iconName: "ban",
    },
    {
      id: "totalActiveLeadCount",
      widgetText: "Assignment(s) - To Do",
      widgetNumber: "2",
      iconName: "trophy",
    },
  ];
  // const WidgetData: WidgetProps[] = [
  //   {
  //     id: "totalLeadCount",
  //     widgetText: "Total No. of Lead(s)",
  //     widgetNumber: "" + leadStatus.Lead,
  //     iconName: "sticky-note",
  //   },
  //   {
  //     id: "totalWonLeadCount",
  //     widgetText: "No. of Won Lead(s)",
  //     widgetNumber: "" + leadStatus.wonLeads,
  //     iconName: "trophy",
  //     // onButtonClickfunc: widgetNumberClickedFunction,
  //   },
  //   {
  //     id: "totalClosedLeadCount",
  //     widgetText: "No. of Closed Lead(s)",
  //     widgetNumber: "" + leadStatus.closedLeads,
  //     iconName: "ban",
  //   },
  //   {
  //     id: "totalActiveLeadCount",
  //     widgetText: "No. of Active Lead(s)",
  //     widgetNumber: "" + leadStatus.activeLeads,
  //     iconName: "trophy",
  //   },
  // ];
  const assignmentData = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      status: "Active",
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      status: "Inactive",
    },
    {
      name: "Sam Wilson",
      email: "sam.wilson@example.com",
      status: "Pending",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <AssignmentWidget widgetData={WidgetData} />
      <div className="flex-grow overflow-hidden">
        <AssignmentDataTable assignmentData={assignmentsDataDynamic} />
      </div>
    </div>
  );
}
