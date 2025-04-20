import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export const getAlertNotificationData = async function () {

    let processName = "Alert Rule";
    let predefinedFilters = {"taskName" : "View Alert"};
    let projections = ["Data.id","Data.clientId","Data.notification_name","Data.finalBreachCount","Data.device_service_association","Data.lastStateChangeTime","Data.state","Data.description","Data.description","Data.createdOn","Data.lastEvaluatedOn","Data.isAcknowledged","Data.isNotificationDisabled","Data.isMute","Data.muteStartDate","Data.muteEndDate","Data.health","Data.associatedCommandId"];
    const alertNotificationData: any = await getMyInstancesV2({
        processName,
        predefinedFilters,
        projections
    });
    return alertNotificationData;
}