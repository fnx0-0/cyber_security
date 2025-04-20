"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shadcn/ui/dialog";
import { TextButton } from "@/ikon/components/buttons";
import { CreateNewDatasetModalFormProps } from "../../../../components/type";
import Tabs from "@/ikon/components/tabs";
import { TabArray } from "@/ikon/components/tabs/type";
import { v4 } from "uuid";
import {
  FileDetails,
  UserData,
  AccountData,
} from "../../../../components/type";
import DatasetUploadInfo from "./DatasetUploadInfo";
import DatasetDetails from "./DatasetDetails";
import { getProfileData } from "@/ikon/utils/actions/auth";
import {
  getcurrentUserDataFromSSDUserDataSummaryProcess,
  getAccountDataUsage,
  scriptExecutorforDatasetUploaders,
  getPreviewDataFromScriptExecuter,
} from "../../../../common-functions";
import {
  getParameterizedDataForTaskId,
  mapProcessName,
} from "@/ikon/utils/api/processRuntimeService";

import Loading from "./loading";
import PreviewDatasetTable from "./PreviewDatasetTable";
import DatasetColumnTypeSelection from "./DatasetColumnTypeSelection";

export default function CreateNewDatasetModalForm({
  isOpen,
  onClose,
  datasetType,
}: CreateNewDatasetModalFormProps) {
  const [datasetDetails, setDatasetDetails] = useState({
    name: "",
    description: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<FileDetails[]>([]);
  const [availableSpaceForAccount, setAvailableSpaceForAccount] = useState(0);
  const [availableSpaceForUser, setAvailableSpaceForUser] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upload-tab");
  const [selectedSheet, setSelectedSheet] = useState(0);

  const [completeData, setCompleteData] = useState([]);

  const allWorksheets = useMemo(
    () => completeData.map((sheet) => sheet.sheetName),
    [completeData]
  );

  const sheetNameSheetIdMap = useMemo(() => {
    let map = {};
    allWorksheets.forEach((name, index) => {
      map[index] = name;
    });
    return map;
  }, [allWorksheets]);

  const selectedSheetValueArray = useMemo(
    () => allWorksheets.map((_, index) => `${index}`),
    [allWorksheets]
  );

  const selectedColumnObject = useMemo(() => {
    let columns = {};
    completeData.forEach((sheet) => {
      columns[sheet.sheetName] = Object.keys(sheet.fields).map((key) => ({
        originalKey: sheet.fields[key].title,
        modifiedKey: key,
        type: sheet.fields[key].type,
        dbKey: sheet.fields[key].dbKey,
      }));
    });
    return columns;
  }, [completeData]);

  const previewTabData = useMemo(() => {
    if (completeData.length === 0)
      return { previewData: [], previewDataKeys: [] };

    const firstSheet = completeData[0]; // Assume preview is for the first sheet
    return {
      previewData: firstSheet.data.slice(0, 5), // First 5 rows
      previewDataKeys: Object.keys(firstSheet.fields),
    };
  }, [completeData]);

  async function fetchCurrentUserProfileData() {
    try {
      const profileData = await getProfileData();
      if (profileData) {
        const instanceOfSSDUserDataSummaryProcess =
          await getcurrentUserDataFromSSDUserDataSummaryProcess(
            profileData.USER_ID
          );
        if (instanceOfSSDUserDataSummaryProcess) {
          let taskId = instanceOfSSDUserDataSummaryProcess[0].taskId;
          let parameters = {
            userId: profileData.USER_ID,
          };

          const parameterizedUserData: UserData =
            await getParameterizedDataForTaskId({ taskId, parameters });
          if (parameterizedUserData) {
            let total = parameterizedUserData.allotedSpace;
            let usedSpace = 0;

            [
              ...parameterizedUserData.excelFileListOwnedByUser,
              ...parameterizedUserData.csvFileListOwnedByUser,
              ...parameterizedUserData.jsonFileListOwnedByUser,
            ].forEach((file) => (usedSpace += file.resourceSize));

            usedSpace = parseFloat(
              (usedSpace / (1024 * 1024 * 1024)).toFixed(3)
            );
            setAvailableSpaceForUser(total - usedSpace);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchAccountDataUsage() {
    try {
      const instances = await getAccountDataUsage();
      if (instances.length) {
        console.log("Inside getAccountDataUsage");
        // console.log(instances);
        let taskId = instances[0].taskId;
        let parameters = {};
        const data: AccountData = await getParameterizedDataForTaskId({
          taskId,
          parameters,
        });
        if (data) {
          console.log("Inside parameterized data fetch");

          let total = data.allotedSpace;
          let usedSpace = 0;
          [
            ...data.allExcelFileList,
            ...data.allcsvFileList,
            ...data.alljsonFileList,
          ].forEach((file) => {
            usedSpace += file.resourceSize;
          });
          usedSpace = parseFloat((usedSpace / (1024 * 1024 * 1024)).toFixed(3));
          setAvailableSpaceForAccount(total - usedSpace);
        }
      }
    } catch (error) {
      console.error("Error fetching account data usage:", error);
    }
  }

  useEffect(() => {
    if (isOpen) {
      setActiveTab("upload-tab");
      const fetchData = async () => {
        setIsLoading(true);
        await Promise.all([
          fetchCurrentUserProfileData(),
          fetchAccountDataUsage(),
        ]);
        setIsLoading(false);
      };

      fetchData();

      setUploadedFiles([]);
      setDatasetDetails({ name: "", description: "" });
    }
  }, [isOpen]);

  useEffect(() => {
    console.log("Active tab changed:", activeTab);
  }, [activeTab]);

  const handleUploadedFiles = (files: FileDetails[]) => {
    setUploadedFiles(files);
  };

  const updateDatasetName = (name: string) => {
    setDatasetDetails((prev) => ({ ...prev, name }));
  };

  const updateDatasetDescription = (description: string) => {
    setDatasetDetails((prev) => ({ ...prev, description }));
  };

  const parseFileToGetPreviewData = async (
    sheetId: number,
    rowColDetails: {},
    file: FileDetails[],
    resource: {}
  ) => {
    handleUploadedFiles(file);
    console.log(rowColDetails);
    console.log(resource + "resource----------");
    setSelectedSheet(sheetId);
    const fileReaderInstance = await scriptExecutorforDatasetUploaders(
      "fileReader"
    );
    const scriptExecutorforDatasetUploadersProcess = await mapProcessName({
      processName: "Script Executor for Dataset Uploaders",
    });

    const profileData = await getProfileData();
    let taskId = fileReaderInstance[0].taskId;
    let currentProcessInstanceId = fileReaderInstance[0].processInstanceId;
    let processId = scriptExecutorforDatasetUploadersProcess;
    let userId = profileData.USER_ID;
    let uniqueness = v4();
    let parameters = {
      resource: resource,
      sheetToBeImported: selectedSheet,
      rowColDetails: rowColDetails,
      userId: userId,
      uniqueness: uniqueness,
    };
    try {
      const res = await getPreviewDataFromScriptExecuter(
        currentProcessInstanceId,
        parameters,
        uniqueness,
        taskId,
        processId
      );

      prepareDataRecievedFromFileReader(res, sheetId);
    } catch (error) {
      console.error("Error getting preview data:", error);
    }
  };
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const guessDate = (key) => {
    const dateRegex =
      /\b(?:date|timestamp|birthday|dob|doj|anniversary|on|from|to|day|start|end|check|deadline|till)\b/i;
    return dateRegex.test(key);
  };

  const prepareDataRecievedFromFileReader = (data, sheetId: number) => {
    setCompleteData((prevCompleteData) => {
      let newCompleteData = data.excelFile.sheets.map((sheet, index) => {
        let existingSheet = prevCompleteData?.[index] || {};

        return index === sheetId
          ? {
              sheetName: sheet.sheetName,
              tableName: existingSheet.tableName || "datasetTable_" + v4(),
              data: sheet.data.map((row) => {
                let rowData = {};
                for (const key in row) {
                  try {
                    if (guessDate(key) && sheet.fields[key].type === "DATE") {
                      sheet.fields[key].type = "DATE";
                    } else if (sheet.fields[key].type === "DATE") {
                      sheet.fields[key].type = "NUMBER";
                    }

                    rowData[key] =
                      sheet.fields[key].type === "NUMBER"
                        ? row[key].valueAsNumber
                        : sheet.fields[key].type === "DATE"
                        ? row[key].valueAsDate
                        : row[key].valueAsString;
                  } catch (e) {
                    console.log("error" + " -- " + e);
                  }
                }
                return rowData;
              }),
              fields: sheet.fields,
              datasetId: existingSheet.datasetId || v4(),
            }
          : existingSheet; // Keep old sheet data if not updating
      });

      return newCompleteData;
    });

    setActiveTab("preview-tab");
  };

  // const prepareDataRecievedFromFileReader = (data, sheetId: number) => {
  //   let newCompleteData = data.excelFile.sheets.map((sheet, index) => ({
  //     sheetName: sheet.sheetName,
  //     tableName: "datasetTable_" + v4(),
  //     data: sheet.data.map((row) => {
  //       let rowData = {};
  //       for (const key in row) {
  //         try {
  //           if (guessDate(key) && sheet.fields[key].type === "DATE") {
  //             sheet.fields[key].type = "DATE";
  //           } else if (sheet.fields[key].type === "DATE") {
  //             sheet.fields[key].type = "NUMBER";
  //           }

  //           rowData[key] =
  //             sheet.fields[key].type === "NUMBER"
  //               ? row[key].valueAsNumber
  //               : sheet.fields[key].type === "DATE"
  //               ? row[key].valueAsDate
  //               : row[key].valueAsString;
  //         } catch (e) {
  //           console.log("error" + " -- " + e);
  //         }
  //       }
  //       return rowData;
  //     }),
  //     fields: sheet.fields,
  //     datasetId: v4(),
  //   }));

  //   setCompleteData(newCompleteData);
  //   setActiveTab("preview-tab");
  // };
  const tabArray: TabArray[] = [
    {
      tabName: "Upload File",
      tabId: "upload-tab",
      default: activeTab === "upload-tab",
      tabContent: isLoading ? (
        <div className="max-h-[70vh] h-[85vh]">
          <Loading />
        </div>
      ) : (
        <DatasetUploadInfo
          selectedFileType={datasetType}
          uploadedFiles={uploadedFiles}
          availableSpaceForUser={availableSpaceForUser}
          availableSpaceForAccount={availableSpaceForAccount}
          parseFileToGetPreviewData={parseFileToGetPreviewData}
        />
      ),
    },
    {
      tabName: "Preview Details",
      tabId: "preview-tab",
      default: activeTab === "preview-tab",
      tabContent: (
        <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto h-[85vh]">
          <div className="grid col-span-2 items-center gap-1.5">
            {" "}
            <PreviewDatasetTable
              previewData={previewTabData.previewData}
              previewDataKeys={previewTabData.previewDataKeys}
            />
          </div>
        </div>
      ),
    },
    {
      tabName: "Dataset Details",
      tabId: "dataset-details-tab",
      default: activeTab === "dataset-details-tab",
      tabContent: (
        <DatasetDetails
          sheetId="0"
          name={datasetDetails.name}
          description={datasetDetails.description}
          updateName={updateDatasetName}
          updateDescription={updateDatasetDescription}
        />
      ),
    },
    {
      tabName: "Field Configuration",
      tabId: "configuration-tab",
      default: activeTab === "configuration-tab",
      tabContent: (
        <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto h-[85vh]">
          <div className="grid col-span-2 items-center gap-1.5">
            {/* <DatasetColumnTypeSelection
              selectedColumnSchema={selectedColumnObject}
              sheetId={selectedSheet}
              sheetNameSheetIdMap={sheetNameSheetIdMap}
              completeData={completeData}
            /> */}
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Create New Dataset</DialogTitle>
          </DialogHeader>
          <form>
            <Tabs
              key={activeTab}
              tabArray={tabArray}
              onTabChange={handleTabChange}
              tabListClass="py-6 px-3"
              tabListButtonClass="text-md"
              tabListInnerClass="justify-between items-center"
            />
          </form>
          <DialogFooter>
            <TextButton variant="default" type="submit">
              Save
            </TextButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div id="divProductivityPage"></div>
    </>
  );
}

//--------------------- backup ----------------- ///////////////

// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/shadcn/ui/dialog";
// import { TextButton } from "@/ikon/components/buttons";
// import { CreateNewDatasetModalFormProps } from "../../../../components/type";
// import Tabs from "@/ikon/components/tabs";
// import { TabArray } from "@/ikon/components/tabs/type";
// import { v4 } from "uuid";
// import {
//   FileDetails,
//   UserData,
//   AccountData,
// } from "../../../../components/type";
// import DatasetUploadInfo from "./DatasetUploadInfo";
// import DatasetDetails from "./DatasetDetails";
// import { getProfileData } from "@/ikon/utils/actions/auth";
// import {
//   getcurrentUserDataFromSSDUserDataSummaryProcess,
//   getAccountDataUsage,
//   scriptExecutorforDatasetUploaders,
//   getPreviewDataFromScriptExecuter,
// } from "../../../../common-functions";
// import {
//   getParameterizedDataForTaskId,
//   mapProcessName,
// } from "@/ikon/utils/api/processRuntimeService";

// import Loading from "./loading";
// import PreviewDatasetTable from "./PreviewDatasetTable";
// import DatasetColumnTypeSelection from "./DatasetColumnTypeSelection";

// export default function CreateNewDatasetModalForm({
//   isOpen,
//   onClose,
//   datasetType,
// }: CreateNewDatasetModalFormProps) {
//   const [datasetDetails, setDatasetDetails] = useState({
//     name: "",
//     description: "",
//   });

//   const [uploadedFiles, setUploadedFiles] = useState<FileDetails[]>([]);
//   const [availableSpaceForAccount, setAvailableSpaceForAccount] = useState(0);
//   const [availableSpaceForUser, setAvailableSpaceForUser] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("upload-tab");
//   const [selectedColumnObject, setSelectedColumnObject] = useState({});
//   const [selectedSheet, setSelectedSheet] = useState(0);

//   const [previewTabData, setPreviewTabData] = useState({
//     previewData: [],
//     previewDataKeys: [],
//   });

//   let completeData = [];
//   let allWorksheets = [];
//   let sheetNameSheetIdMap = [];
//   let selectedSheetValueArray = [];

//   async function fetchCurrentUserProfileData() {
//     try {
//       const profileData = await getProfileData();
//       if (profileData) {
//         const instanceOfSSDUserDataSummaryProcess =
//           await getcurrentUserDataFromSSDUserDataSummaryProcess(
//             profileData.USER_ID
//           );
//         if (instanceOfSSDUserDataSummaryProcess) {
//           let taskId = instanceOfSSDUserDataSummaryProcess[0].taskId;
//           let parameters = {
//             userId: profileData.USER_ID,
//           };

//           const parameterizedUserData: UserData =
//             await getParameterizedDataForTaskId({ taskId, parameters });
//           if (parameterizedUserData) {
//             let total = parameterizedUserData.allotedSpace;
//             let usedSpace = 0;

//             [
//               ...parameterizedUserData.excelFileListOwnedByUser,
//               ...parameterizedUserData.csvFileListOwnedByUser,
//               ...parameterizedUserData.jsonFileListOwnedByUser,
//             ].forEach((file) => (usedSpace += file.resourceSize));

//             usedSpace = parseFloat(
//               (usedSpace / (1024 * 1024 * 1024)).toFixed(3)
//             );
//             setAvailableSpaceForUser(total - usedSpace);
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   }

//   async function fetchAccountDataUsage() {
//     try {
//       const instances = await getAccountDataUsage();
//       if (instances.length) {
//         console.log("Inside getAccountDataUsage");
//         // console.log(instances);
//         let taskId = instances[0].taskId;
//         let parameters = {};
//         const data: AccountData = await getParameterizedDataForTaskId({
//           taskId,
//           parameters,
//         });
//         if (data) {
//           console.log("Inside parameterized data fetch");

//           let total = data.allotedSpace;
//           let usedSpace = 0;
//           [
//             ...data.allExcelFileList,
//             ...data.allcsvFileList,
//             ...data.alljsonFileList,
//           ].forEach((file) => {
//             usedSpace += file.resourceSize;
//           });
//           usedSpace = parseFloat((usedSpace / (1024 * 1024 * 1024)).toFixed(3));
//           setAvailableSpaceForAccount(total - usedSpace);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching account data usage:", error);
//     }
//   }

//   useEffect(() => {
//     if (isOpen) {
//       setActiveTab("upload-tab");
//       const fetchData = async () => {
//         setIsLoading(true);
//         await Promise.all([
//           fetchCurrentUserProfileData(),
//           fetchAccountDataUsage(),
//         ]);
//         setIsLoading(false);
//       };

//       fetchData();

//       setUploadedFiles([]);
//       setDatasetDetails({ name: "", description: "" });
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     console.log("Active tab changed:", activeTab);
//   }, [activeTab]);

//   const handleUploadedFiles = (files: FileDetails[]) => {
//     setUploadedFiles(files);
//   };

//   const updateDatasetName = (name: string) => {
//     setDatasetDetails((prev) => ({ ...prev, name }));
//   };

//   const updateDatasetDescription = (description: string) => {
//     setDatasetDetails((prev) => ({ ...prev, description }));
//   };

//   const parseFileToGetPreviewData = async (
//     sheetId: number,
//     rowColDetails: {},
//     file: FileDetails[],
//     resource: {}
//   ) => {
//     handleUploadedFiles(file);
//     console.log(rowColDetails);
//     console.log(resource + "resource----------");
//     setSelectedSheet(sheetId);
//     const fileReaderInstance = await scriptExecutorforDatasetUploaders(
//       "fileReader"
//     );
//     const scriptExecutorforDatasetUploadersProcess = await mapProcessName({
//       processName: "Script Executor for Dataset Uploaders",
//     });

//     const profileData = await getProfileData();
//     let taskId = fileReaderInstance[0].taskId;
//     let currentProcessInstanceId = fileReaderInstance[0].processInstanceId;
//     let processId = scriptExecutorforDatasetUploadersProcess;
//     let userId = profileData.USER_ID;
//     let uniqueness = v4();
//  let parameters = {
//       resource: resource,
//       sheetToBeImported: sheetId,
//       rowColDetails: rowColDetails,
//       userId: userId,
//       uniqueness: uniqueness,
//     };
//     try {
//       const res = await getPreviewDataFromScriptExecuter(
//         currentProcessInstanceId,
//         parameters,
//         uniqueness,
//         taskId,
//         processId
//       );

//       prepareDataRecievedFromFileReader(res, sheetId);
//     } catch (error) {
//       console.error("Error getting preview data:", error);
//     }

//   };
//   const handleTabChange = (tabId: string) => {
//     setActiveTab(tabId);
//   };

//   const guessDate = (key) => {
//     const dateRegex =
//       /\b(?:date|timestamp|birthday|dob|doj|anniversary|on|from|to|day|start|end|check|deadline|till)\b/i;
//     return dateRegex.test(key);
//   };

// const prepareDataRecievedFromFileReader = (data, sheetId: number) => {

//   for (var i = 0; i < data.excelFile.sheets.length; i++) {
//     var tempData = [];
//     for (var j = 0; j < data.excelFile.sheets[i].data.length; j++) {
//       var tempRowData = {};
//       for (const key in data.excelFile.sheets[i].data[j]) {
//         try {
//           if (
//             guessDate(key) &&
//             data.excelFile.sheets[i].fields[key].type == "DATE"
//           ) {
//             data.excelFile.sheets[i].fields[key].type = "DATE";
//           } else if (data.excelFile.sheets[i].fields[key].type == "DATE") {
//             data.excelFile.sheets[i].fields[key].type = "NUMBER";
//           }
//           // Now store the value according to suggested datatype
//           if (data.excelFile.sheets[i].fields[key].type == "NUMBER") {
//             tempRowData[key] =
//               data.excelFile.sheets[i].data[j][key].valueAsNumber;
//           } else if (data.excelFile.sheets[i].fields[key].type == "DATE") {
//             /* 											else if(data.excelFile.sheets[i].fields[key].type=="INTEGER"){
//                                             tempRowData[key]=data.excelFile.sheets[i].data[j][key].valueAsInteger

//                   } */
//             tempRowData[key] =
//               data.excelFile.sheets[i].data[j][key].valueAsDate;
//           } else {
//             tempRowData[key] =
//               data.excelFile.sheets[i].data[j][key].valueAsString;
//           }
//         } catch (e) {
//           console.log("error" + " -- " + e);
//           // 							sweetalertMessage(`Some formatted cells have been found, it might not process all such cells correctly.`);
//         }
//       }
//       tempData.push(tempRowData);
//     }

//     // In case data of another sheet is already imported then append data without replacing
//     if (completeData.length == data.excelFile.sheets.length) {
//       if (sheetId == i) {
//         completeData[sheetId] = {
//           sheetName: data.excelFile.sheets[i].sheetName,
//           tableName: "datasetTable_" + v4(),
//           data: tempData,
//           fields: data.excelFile.sheets[i].fields,
//           datasetId: v4(),
//         };
//       }
//     }
//     // In case data is brought for the first time for first sheet then just put it in data
//     else {
//       completeData.push({
//         sheetName: data.excelFile.sheets[i].sheetName,
//         tableName: "datasetTable_" + v4(),
//         data: tempData,
//         fields: data.excelFile.sheets[i].fields,
//         datasetId: v4(),
//       });
//     }
//   }

//   for (var i = 0; i < completeData.length; i++) {
//     allWorksheets.push(completeData[i].sheetName);
//   }
//   loadSelect(); // after completing data show in select option
//   createTabForAllSheets();

//   console.log("Completed Parsing and rendering preview of file");
// };

//   const loadSelect = () => {
//     for (var i = 0; i < allWorksheets.length; i++) {
//       selectedSheetValueArray.push(`${i}`);
//       sheetNameSheetIdMap[i] = allWorksheets[i];
//     }
//   };

//   const createTabForAllSheets = () => {
//     for (var i = 0; i < selectedSheetValueArray.length; i++) {

//       var sheetName = allWorksheets[parseInt(selectedSheetValueArray[i])];
//       var sheetId = selectedSheetValueArray[i];

//       if (i == selectedSheetValueArray.length - 1) {
//         populateTabContainer(sheetId);
//       }
//     }
//     setTimeout(function () {
//       if (selectedSheetValueArray.length > 0) {
//         // only if at least one sheet is selected
//       }
//     }, 0);
//   };

//   const populateTabContainer = (sheetId: number) => {
//     loadExcelTable(sheetId);
//     populateColumnsField(sheetId);
//   };

//   const populateColumnsField = (sheetId: number) => {

//     var originalKeys = [];
//     let tempSelectedColumnObject = {};
//     for (var i = 0; i < completeData.length; i++) {
//       if (completeData[i].sheetName == sheetNameSheetIdMap[sheetId]) {
//         var sheetName = completeData[i].sheetName;
//         tempSelectedColumnObject[sheetName] = [];
//         var fields = completeData[i].fields;
//         for (const key in fields) {
//           if (fields.hasOwnProperty(key)) {
//             originalKeys.push(fields[key].title);
//             tempSelectedColumnObject[sheetName].push({
//               originalKey: fields[key].title,
//               modifiedKey: key,
//               type: fields[key].type,
//               dbKey: fields[key].dbKey,
//             });
//           }
//         }
//       }
//     }
//     setSelectedColumnObject((prevState) => ({
//       ...prevState,
//       ...tempSelectedColumnObject,
//     }));
//     console.log("selectedColumnObject");

//   };

//   const loadExcelTable = (sheetId: number) => {
//     var tempkeys = [];
//     var tempdata = [];
//     let currentSheet = parseInt(sheetId);
//     let currentSheetName = allWorksheets[currentSheet];

//     for (var i = 0; i < completeData.length; i++) {
//       if (currentSheetName == completeData[i].sheetName) {
//         tempkeys = Object.keys(completeData[i].fields);
//         if (tempkeys.length == 0) {
//           //give error message
//         }
//         for (var j = 0; j < completeData[i].data.length; j++) {
//           tempdata.push(completeData[i].data[j]);
//           if (j > 4) {
//             break;
//           }
//         }
//       }
//     }
//     console.log("tempkeys");
//     console.log(tempkeys);
//     console.log("tempdata");
//     console.log(tempdata);

//     setPreviewTabData({ previewData: tempdata, previewDataKeys: tempkeys });
//     setActiveTab("preview-tab");
//   };
//   const tabArray: TabArray[] = [
//     {
//       tabName: "Upload File",
//       tabId: "upload-tab",
//       default: activeTab === "upload-tab",
//       tabContent: isLoading ? (
//         <div className="max-h-[70vh] h-[85vh]">
//           <Loading />
//         </div>
//       ) : (
//         <DatasetUploadInfo
//           selectedFileType={datasetType}
//           uploadedFiles={uploadedFiles}
//           availableSpaceForUser={availableSpaceForUser}
//           availableSpaceForAccount={availableSpaceForAccount}
//           parseFileToGetPreviewData={parseFileToGetPreviewData}
//         />
//       ),
//     },
//     {
//       tabName: "Preview Details",
//       tabId: "preview-tab",
//       default: activeTab === "preview-tab",
//       tabContent: (
//         <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto h-[85vh]">
//           <div className="grid col-span-2 items-center gap-1.5">
//             {" "}
//             <PreviewDatasetTable
//               previewData={previewTabData.previewData}
//               previewDataKeys={previewTabData.previewDataKeys}
//             />
//           </div>
//         </div>
//       ),
//     },
//     {
//       tabName: "Dataset Details",
//       tabId: "dataset-details-tab",
//       default: activeTab === "dataset-details-tab",
//       tabContent: (
//         <DatasetDetails
//           sheetId="0"
//           name={datasetDetails.name}
//           description={datasetDetails.description}
//           updateName={updateDatasetName}
//           updateDescription={updateDatasetDescription}
//         />
//       ),
//     },
//     {
//       tabName: "Field Configuration",
//       tabId: "configuration-tab",
//       default: activeTab === "configuration-tab",
//       tabContent: (
//         <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto h-[85vh]">
//           <div className="grid col-span-2 items-center gap-1.5">
//             <DatasetColumnTypeSelection
//               selectedColumnSchema={selectedColumnObject}
//               // sheetId={selectedSheet}
//             />
//           </div>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       <Dialog open={isOpen} onOpenChange={onClose}>
//         <DialogContent className="max-w-5xl">
//           <DialogHeader>
//             <DialogTitle>Create New Dataset</DialogTitle>
//           </DialogHeader>
//           <form>
//             <Tabs
//               key={activeTab}
//               tabArray={tabArray}
//               onTabChange={handleTabChange}
//               tabListClass="py-6 px-3"
//               tabListButtonClass="text-md"
//               tabListInnerClass="justify-between items-center"
//             />
//           </form>
//           <DialogFooter>
//             <TextButton variant="default" type="submit">
//               Save
//             </TextButton>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//       <div id="divProductivityPage"></div>
//     </>
//   );
// }
