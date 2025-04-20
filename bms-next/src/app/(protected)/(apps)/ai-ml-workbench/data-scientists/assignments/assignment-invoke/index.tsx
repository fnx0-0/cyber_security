import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

// Server function to fetch assignment details
export const invokeAssignmentProcessAssigneeForm = async (
  assignmentId: string
) => {
  try {
    // Fetch necessary IDs
    const softwareId = "d88395f6-b32a-41ed-ba51-9414a846da54";
    const accountId = await getActiveAccountId();

    // // Fetch assignment data
    // const predefinedFilter = { taskName: "Assignment Update Activity" };
    // const processVariableFilter: any = { assignmentId };
    // const instances = await getMyInstancesV2({
    //   accountId,
    //   softwareId,
    //   processName: "Assignments",
    //   predefinedFilters: predefinedFilter,
    //   processVariableFilters: processVariableFilter,
    // });

    // const softwareId = await getSoftwareIdByNameVersion("AI ML", "1");
    // const accountId = await getActiveAccountId();

    // const instances = await getMyInstancesV2({
    //   softwareId: softwareId,
    //   processName: "Assignments",
    //   accountId: accountId,
    //   predefinedFilters: { taskName: "Assignment Update Activity" },
    //   mongoWhereClause: null,
    //   projections: ["Data"],
    // });
    const instances = await getMyInstancesV2({
      //   softwareId: softwareId,
      processName: "Assignments",
      //   accountId: accountId,
      predefinedFilters: { taskName: "Assignment Update Activity" },
    });

    // const assignmentsDataDynamic = Array.isArray(instances)
    //   ? instances.map((e: any) => e.data)
    //   : [];
    console.log("assignment data from ankit update-----", instances);
    if (!instances || instances.length === 0) {
      throw new Error("No task data found for the given assignment.");
    }

    // Extract assignment details
    const assignmentDetails = instances[0].data;
    //@ts-ignore
    const lockedFlag = Object.values(instances[0].data?.lockStatus).some(
      (status: any) => status.loggedInUserId
    );

    //@ts-ignore
    const lockedBy = lockedFlag
      ? //@ts-ignore
        Object.values(instances[0].data?.lockStatus).find(
          (status: any) => status.loggedInUserId
          //@ts-ignore
        )?.loggedInUserName
      : "";

    // Return the required data
    return {
      assignmentId,
      //@ts-ignore
      assignmentName: assignmentDetails.assignmentName,
      assignmentDetails,
      assignees: [
        { id: "1", name: "John Doe" },
        { id: "2", name: "Jane Smith" },
        { id: "3", name: "Alice Johnson" },
      ],
      lockedBy,
      lockedFlag,
    };
  } catch (error) {
    console.error("Failed to invoke action:", error);
    throw error;
  }
};
