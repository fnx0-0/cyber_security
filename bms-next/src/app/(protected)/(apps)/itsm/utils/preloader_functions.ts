import { getBaseSoftwareId } from "@/ikon/utils/actions/software";
import { getDataForTaskId, getMyInstancesV2, getParameterizedDataForTaskId } from "@/ikon/utils/api/processRuntimeService";
import { memoryCacheReturn, param, probleIdMapType } from "../discoveredDevices/types";
import { getUserMapForCurrentAccount } from "../../document-management/actions";



const ref_2006 = {
    allProbeDetailsMap : <probleIdMapType>{},
    activeProbeDetailsMap : <probleIdMapType>{},
};

export async function getAllProbesDetails() {
    const processName = 'Get All Probe Details for Current Account';
    const predefinedFilters = { "taskName": 'Dashboard Query Activity' };
    const projections = ['Data.PROBE_ID', 'Data.PROBE_NAME'];

    // @ts-expect-error: ignore this line
    const onSuccess = async function(data){
        console.log("Inside getMyInstances Success Function.");
        //console.log('data : ', data);

        const taskId= data[0].taskId;

        // @ts-expect-error: ignore this line
        const onSuccess = function(data){
            console.log('Inside getDataForTaskId Success Function.')
            //console.log('data : ', data);

            const allProbeDetails = data.probeDetails;

            for (let i = 0, probeCount = allProbeDetails.length; i < probeCount; i++) {
                if(allProbeDetails[i].ACTIVE){
                    ref_2006.activeProbeDetailsMap[allProbeDetails[i].PROBE_ID] = allProbeDetails[i].PROBE_NAME;
                }
                //else{
                    ref_2006.allProbeDetailsMap[allProbeDetails[i].PROBE_ID] = allProbeDetails[i].PROBE_NAME;
                //}
                
            }

            return ref_2006;
        }

        const onFailure = function(){
            console.log(processName + ' data could not be loaded.');
        }

        try{
            //run post processing script for the mentioned task
            const resultingData = await getDataForTaskId({taskId});

            return onSuccess(resultingData);
        }
        catch(err){
            onFailure();
            console.error(err);
        }
        
    }

    const onFailure = function(){
        console.log(processName + ' could not be fetched.')
    }

    try{
        const baseSoftareId =  await getBaseSoftwareId()
        const resultingData = await getMyInstancesV2({processName, predefinedFilters, projections, softwareId:baseSoftareId});

        return onSuccess(resultingData);
    }
    catch(err){
        onFailure();
        console.error(err);
    }

}

type callback = (() => void) | undefined;

export async function getMemoryCache(param: param, callback: callback) : Promise<memoryCacheReturn[] | unknown>{
    try{
        const instanceData = await getMyInstancesV2({
            processName: "Dynamic Monitoring Status Dashboard",
            predefinedFilters: { taskName: "Fetch Memory Cache" }
        });

        console.log('Dynamic Monitoring Status Dashboard data: ', instanceData);

        try{
            const parameters: param = {
                deviceIdList: []
            };

            if(param['clientId']){
                parameters['clientId'] = param['clientId'];
            }

            if(param['deviceId']){
                parameters['deviceId'] = param['deviceId'];
            }

            if(param['deviceIdList']){
                parameters['deviceIdList'] = param['deviceIdList'];
            }

            const data = await getParameterizedDataForTaskId({
                taskId: instanceData[0].taskId,
                parameters: parameters
            });

            console.log("getParameterizedDataForTaskId data: ", data);

            // @ts-expect-error : ignore
            const data1 = data.daashboardData; 

            if(callback){
                // @ts-expect-error : ignore
                callback(data1);
            }
            else{
                return data1;
            }
        }
        catch(error){
            console.log("Error fetching getParameterizedDataForTaskId data:", error);
            return (error);
        }
    }
    catch(err){
        console.log("Error getting getMyInstancesV2 data:", err);
        return err;
    }
}



export async function getRoleMap(currentSoftwareId: string){
    type currentAccountRoleDataType = {
        userId : string
    }[]

    const ignoreList = ['System Admin', 'System Viewer', 'Asset Administrator'];
    const roleIdWiseMap : { [key: string] : string } = {};
    const customRoleArray : {
        label: string,
        value: string
    }[] = []; 

    //const currentSoftwareId = await getCurrentSoftwareId();

    const currentAccountRoleData = await getUserMapForCurrentAccount(
        {
            isRoleNameWiseUserDetailsMap:true,
            softwareId : currentSoftwareId
        }
    ) as currentAccountRoleDataType

    //console.log('currentAccountRoleData: ', currentAccountRoleData);

    currentAccountRoleData.forEach((obj, index)=>{
        if((ignoreList.includes(obj.userId) == false)){
            roleIdWiseMap[currentAccountRoleData[index].userId] = obj.userId;
            customRoleArray.push({
                label: obj.userId,
                value: obj.userId
            });	
        }
    })

    //console.log('currentAccountRoleData: ', customRoleArray);

    // for(const role_name in currentAccountRoleData){
    //     if((ignoreList.includes(role_name) == false)){
    //         roleIdWiseMap[currentAccountRoleData[role_name].roleId] = role_name;	
    //     }
    // }

    //console.log('roleIdWiseMap: ', roleIdWiseMap);

    return customRoleArray;
}