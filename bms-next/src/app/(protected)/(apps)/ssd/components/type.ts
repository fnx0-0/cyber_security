export interface Dataset {
  processInstanceId: string;
  data: {
    source: string;
    userId: string;
    createdBy: string;
    createdOn: string;
    datasetId: string;
    access: {
      read: {
        users: string[];
        groups: string[];
      };
      write: {
        users: string[];
        groups: string[];
      };
    };
    metadata: {
      datasetName: string;
      datasetDescription: string;
    };
    tableConfiguration: {
      sheetName: string;
      tableName: string;
      data: any[];
      fields: {
        [key: string]: {
          title: string;
          type: string;
          field: string;
        };
      };
    }[];
  };
  sender: string;
  processInstanceAccountId: string;
  lockedByMe: boolean;
  action: string;
  taskName: string;
  message: string;
  taskId: string;
  suspended: boolean;
  timestamp: string;
}

export interface DatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CreateNewDatasetModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  datasetType: string;
}
export interface FileDetails {
  name: string;
  url: string;
  progress: number;
  file: File;
}


export interface FileResource {
  resourceId: string;
  inputControl: string;
  resourceName: string;
  resourceSize: number;
  resourceType: string;
  datasetId: string;
}

export interface DatasetTable {
  datasetName: string;
  tableName: string;
}

export interface UserData {
  [x: string]: any;
  date: any;
  userId: string;
  allotedRows: number;
  allotedSpace: number;
  excelFileListOwnedByUser: FileResource[];
  csvFileListOwnedByUser: FileResource[];
  jsonFileListOwnedByUser: FileResource[];
  allDatasetTablesListOwnedByUser: DatasetTable[];
}

export interface AccountData {
  userId: string;
  allotedRows: number;
  allotedSpace: number;
  allExcelFileList: FileResource[];
  allcsvFileList: FileResource[];
  alljsonFileList: FileResource[];
  allDatasetTablesListOwnedByUser: DatasetTable[];
}

