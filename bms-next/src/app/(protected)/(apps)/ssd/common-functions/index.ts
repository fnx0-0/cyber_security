import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { clearWs, subscribeToProcessEvents } from "@/ikon/utils/api/sockets";
import { getParameterizedDataForTaskId } from "@/ikon/utils/api/processRuntimeService";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getCurrentSoftwareId } from "@/ikon/utils/actions/software";

// instances of SSD Chart Configuration Storage
export async function getAllInstancesForDatasetConfigurationStorage() {
  const DatasetConfugurationStorageInstances = await getMyInstancesV2({
    processName: "SSD Dataset Configuration Storage",
    predefinedFilters: {
      taskNames: ["Dataset View Activity", "Dataset Update Activity"],
    },
    mongoWhereClause: `"this.Data != null"`,
  });
  return DatasetConfugurationStorageInstances;
}

//  instances of SSD User Data Summary Process

export async function getcurrentUserDataFromSSDUserDataSummaryProcess(
  userId: string
) {
  const SSDUserDataSummaryProcessInstances = await getMyInstancesV2({
    processName: "SSD User Data Summary Process",
    predefinedFilters: { taskName: "viewSummary" },
    mongoWhereClause: `this.Data != null && this.Data.userId=='${userId}'`,
  });
  return SSDUserDataSummaryProcessInstances;
}

//  instances of SSD Account Data Usage Summary Process

export async function getAccountDataUsage() {
  const SSDAccountDataUsage = await getMyInstancesV2({
    processName: "SSD Account Data Usage Summary Process",
    predefinedFilters: { taskName: "AccountDataUsage" },
    mongoWhereClause: `this.Data`,
  });
  return SSDAccountDataUsage;
}

//  instances of Script Executor for Dataset Uploaders

export async function scriptExecutorforDatasetUploaders(taskName: string) {
  const scriptExecutorforDatasetUploadersInstance = await getMyInstancesV2({
    processName: "Script Executor for Dataset Uploaders",
    predefinedFilters: { taskName: taskName },
    mongoWhereClause: null,
    projections: [],
  });
  return scriptExecutorforDatasetUploadersInstance;

  //subscribe to process events karha h
}

// export async function getPreviewDataFromScriptExecuter(
//   currentProcessInstanceId: string,
//   parameters: {},
//   uniqueness: string,
//   taskId: string,
//   processId: string
// ) {
//   const currentSoftwareId = await getCurrentSoftwareId();
//   const activeAccountId = await getActiveAccountId();
//   clearWs("divProductivityPage");
//   subscribeToProcessEvents({
//     viewComponentId: "divProductivityPage",
//     accountId: activeAccountId,
//     softwareId: currentSoftwareId,
//     processId: processId,
//     processInstanceId: currentProcessInstanceId,
//     eventCallbackFunction: function (event) {
//       console.log(arguments);
//       const resource = event.data;
//       if (
//         resource.userId === parameters.userId &&
//         resource.uniqueness === uniqueness
//       ) {
//         console.log(resource);
//         return resource;
//       }
//     },
//     connectionOpenFunction: async function () {
//       try {
//         const returnData = await getParameterizedDataForTaskId({
//           taskId,
//           parameters,
//         });
//         console.log("Received data:", returnData);
//       } catch (error) {
//         console.error("Error fetching data for task:", error);
//       }
//     },
//     connectionClosedFunction: function () {
//       clearWs("divProductivityPage");
//     },
//   });
// }

export async function getPreviewDataFromScriptExecuter(
  currentProcessInstanceId: string,
  parameters: {},
  uniqueness: string,
  taskId: string,
  processId: string
) {
  const currentSoftwareId = await getCurrentSoftwareId();
  const activeAccountId = await getActiveAccountId();
  clearWs("divProductivityPage");

  return new Promise((resolve, reject) => {
    subscribeToProcessEvents({
      viewComponentId: "divProductivityPage",
      accountId: activeAccountId,
      softwareId: currentSoftwareId,
      processId: processId,
      processInstanceId: currentProcessInstanceId,
      eventCallbackFunction: function (event) {
        console.log(arguments);
        const resource = event.data;
        if (
          resource.userId === parameters.userId &&
          resource.uniqueness === uniqueness
        ) {
          console.log(resource);
          resolve(resource); // Resolve the Promise with the resource
        }
      },
      connectionOpenFunction: async function () {
        try {
          const returnData = await getParameterizedDataForTaskId({
            taskId,
            parameters,
          });
          console.log("Received data:", returnData);
        } catch (error) {
          console.error("Error fetching data for task:", error);
        }
      },
      connectionClosedFunction: function () {
        clearWs("divProductivityPage");
      },
    });
  });
}
