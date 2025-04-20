// IKON components
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { DeviceListDataType, memoryCacheReturn, param, ProfileDataType, serviceDetails } from "./types";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import DiscoveredDevicesTable from "./components/DataTable";
import { 
  getAllProbesDetails, 
  getMemoryCache 
} from "../utils/preloader_functions";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import Widgets from "@/ikon/components/widgets";

type deviceServiceAssociationType = {
  clientId: string;
  deviceId: string;
  serviceId: string;
  service_interval_in_sec: number;
}

async function fetchDeviceData() {
    try{
      const deviceData = await getMyInstancesV2<DeviceListDataType>({
        processName: "Configuration Item",
        predefinedFilters: {
          taskName: "Update CI Acivity"
        }
      });
  
      return deviceData;
    }
    catch(err){
      console.error('error in fetchDeviceData: ', err)
      return [];
    }
}

async function getServiceIdWiseData() {
  const serviceIdWiseServiceDetails : {
    [key: string] : serviceDetails
  } = {};
  // getMyInstancesV2("Catalog", globalAccountId, { taskName: "View Catalog" }, null, null, null, ["Data"], false,
  //   function (catalogData) {
  //     ref.cataLogData = catalogData;

  //     for (var i = 0; i < ref.cataLogData.length; i++) {
  //       ref.serviceIdWiseServiceName[ref.cataLogData[i].data.serviceId] = ref.cataLogData[i].data.metricsName;
  //     }
  //   },
  //   function () { }
  // )

  const data = await getMyInstancesV2<serviceDetails>({
    processName: 'Catalog',
    predefinedFilters: {
      taskName: "View Catalog"
    }
  })

  data.forEach((obj)=>{
    serviceIdWiseServiceDetails[obj.data.serviceId] = obj.data;
  });

  return serviceIdWiseServiceDetails;

}

export default async function DiscoveredDevices(){
  const param: param = {
      deviceIdList: [''],
      serviceIdWiseDetails: {}
    }

    // const roleData = await getRoleMap();
    // console.log('custom role data: ', roleData);

    const getCurrentAccountId = await getActiveAccountId();
    param['clientId'] = getCurrentAccountId;

    const profileData = await getProfileData() as ProfileDataType;
    //console.log('Profile data: ', profileData);

    const deviceData = await fetchDeviceData();
    //console.log('Device data: ', deviceData);

    const serviceIDWiseData = await getServiceIdWiseData();
    console.log('Service Id wise data: ', serviceIDWiseData);

    param.serviceIdWiseDetails = serviceIDWiseData;

    const taskId = deviceData[0].taskId;

    const totalDevices = deviceData.length.toString();

    const deviceData1 = deviceData.map((obj)=>{
      param.deviceIdList.push(obj.data.deviceId);

      return obj.data;
    });

    const probeIdNameMap = await getAllProbesDetails();
    //console.log('Probe data: ', probeIdNameMap);

    const allActiveProbes = probeIdNameMap?.activeProbeDetailsMap;

    const cacheData = await getMemoryCache(param, undefined) as memoryCacheReturn;
    //console.log('memory cache data: ', cacheData);

    const deviceServiceAssociationData = await getMyInstancesV2<deviceServiceAssociationType>({
      processName: "Device-Service Association",
      predefinedFilters: {
        taskName: "View association details"
      }
    });

    //console.log('deviceServiceAssociation data: ', deviceServiceAssociationData);
    
    let monitoredDevices = 0;
    let activeDevices = 0;

    deviceData1.forEach((device) => {
      const data = cacheData[device.deviceId];

      const servicesForDevices = deviceServiceAssociationData.filter(obj=>obj.data.deviceId == device.deviceId);

      if(!data || !data['Last Monitoring']){
        device['status'] = 'Stale';
        device['monitoringStatus'] = 'No';
        device['noOfServices'] = servicesForDevices.length;
      }
      else if(data["Poling Interval"] != null && data["Last Monitoring"] != null){
        const lastMonitoringTime = new Date(data["Last Monitoring"].replace(' UTC', 'Z')).getTime();
				const currentTime = new Date().getTime();
				const pollingInterval = data["Poling Interval"] * 1000;

        ++monitoredDevices;

				if (currentTime - lastMonitoringTime > pollingInterval) {
					device.status = "Stale";
					device.monitoringStatus = "Yes";
					device.noOfServices = servicesForDevices.length;
				} 
        else {
          ++activeDevices;
					device.status = "Online";
					device.monitoringStatus = "Yes";
					device.noOfServices = servicesForDevices.length;
				}
      }
      else{
        //console.log('ip: ', device.hostIp);

        device.status = "N/A";
				device.monitoringStatus = "N/A";
				device.noOfServices = 0;
      }

    });

    //console.log('final data: ', deviceData1);

    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={
                    { 
                      level: 2, 
                      title: "Discovered Devices", 
                      href: "/discoveredDevices" 
                    }
                }
            />
            <Widgets widgetData={
              [
                {
                  id: '111',
                  widgetText: 'Devices',
                  widgetNumber: totalDevices,
                  iconName: 'monitor'
                },
                {
                  id: '112',
                  widgetText: 'Active Devices',
                  widgetNumber: activeDevices.toString(),
                  iconName: 'monitor-check'
                },
                {
                  id: '113',
                  widgetText: 'Monitored Devices',
                  widgetNumber: monitoredDevices.toString(),
                  iconName: 'monitor-dot'
                }
              ]
            } />

            <br></br>

            <DiscoveredDevicesTable deviceData={deviceData1} serviceIdWiseDetails={serviceIDWiseData} probeIdNameMap={allActiveProbes} profileData={profileData} taskId={taskId} />
        </>
    );
}
