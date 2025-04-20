import { getAllInstancesForDatasetConfigurationStorage } from "../../common-functions";
import DatasetDatatable from "./components/dataset-datatable";

export default async function Uploads() {
  const datasetConfigurationStorageInstance =
    await getAllInstancesForDatasetConfigurationStorage();
  const datasetMap = new Map<string, any>();
  datasetConfigurationStorageInstance.forEach((item: any) => {
    if (item.taskName === "Dataset Update Activity") {
      datasetMap.set(item.data.datasetId, item);
    }
  });
  datasetConfigurationStorageInstance.forEach((item: any) => {
    if (
      item.taskName === "Dataset View Activity" &&
      !datasetMap.has(item.data.datasetId)
    ) {
      datasetMap.set(item.data.datasetId, item);
    }
  });
  const datasets = Array.from(datasetMap.values());

  return (
    <div className="h-full w-full">
      <DatasetDatatable datasets={datasets} />
    </div>
  );
}
