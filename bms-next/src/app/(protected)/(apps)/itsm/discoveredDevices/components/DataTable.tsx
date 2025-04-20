'use client'

import { DataTable } from "@/ikon/components/data-table";
import { DeviceListDataType, DiscoveredDevicesTableProps } from "../types";
import { FC, useRef, useState } from "react";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { getFormattedDate, trimNewline } from "../../utils/generic";
import { TableToolButton_Add, TableToolButton_ConfigureDevice, TableToolButton_Delete, TableToolButton_DeletedDeviceHistory, TableToolButton_DiscoverHistory, TableToolButton_StartDiscovery } from "./DataTableToolsButton";
import { IconTextButton } from "@/ikon/components/buttons";
import { Activity, Clock, Eye, MoreHorizontal, Pencil } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import { ShowModal, ShowModal2, ShowModal3, ShowModal4, ShowModal5 } from "./showModals";
import CustomAlertDialog from "@/ikon/components/alert-dialog";
import ProbeListTable from "./ProbeListTable";
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";

type DeviceIdWiseDetailsType = {
  [key: string] : DeviceListDataType
}

type DeviceIdWiseChkb = {
  [key: string]: boolean
}

const DiscoveredDevicesTable: FC<DiscoveredDevicesTableProps> = ({deviceData, probeIdNameMap, profileData, taskId, serviceIdWiseDetails}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpen2, setIsModalOpen2] = useState<boolean>(false);
  const [isModalOpen3, setIsModalOpen3] = useState<boolean>(false);
  const [isModalOpen4, setIsModalOpen4] = useState<boolean>(false);
  const [isModalOpen5, setIsModalOpen5] = useState<boolean>(false);
  //const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [showStartDiscoveryConfirmation, setShowStartDiscoveryConfirmation] = useState<boolean>(false);
  const [selectedDeviceForStartDiscovery, setSelectedDeviceForStartDiscovery] = useState<DeviceListDataType[]>([]);
  const [customAlertVisible, setCustomAlertVisible] = useState<boolean>(false);
  const [devicesToDelete, setDevicesToDelete] = useState<string[] | null>(null);
  const [selectedDeviceForEdit, setSelectedDeviceForEdit] = useState<DeviceListDataType>()
  const selectedDevices = useRef<DeviceListDataType[]>([]);
  const selectedChkb = useRef<DeviceIdWiseChkb>({})
  

  //const selectedDevices: DeviceListDataType[] = [];

  //let selectedDeviceForEdit: DeviceListDataType;

  const deleteConfirmation = function(ip: string[]){
    //console.log('clicked deleteConfirmation');
    
    setCustomAlertVisible(true);
    setDevicesToDelete(ip);
  }

  const handleDelete = async function(){
      const deviceIP = devicesToDelete;

      if(!deviceIP){
        return
      }

      const deviceIps = deviceIP.join(',');

      console.log('Device ips to delete: ', deviceIps);
      setCustomAlertVisible(false);

      try{
          const data = await getMyInstancesV2<DeviceListDataType>({
                  processName: 'Configuration Item',
                  predefinedFilters: {
                      taskName: 'Delete Activity'
                  },
                  processVariableFilters : {
                      'hostIp' : deviceIps
                  }
              });

          console.log('Fetched data: ', data);

          data.forEach(async (deviceInstanceData)=>{
            // @ts-expect-error : ignore
            deviceInstanceData.softDeletedOn = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

            const data2 = await invokeAction({
              taskId : deviceInstanceData.taskId,
              transitionName: 'Update Delete Activity',
              processInstanceIdentifierField: '',
              data: deviceInstanceData.data
            })

            console.log('Device deleted: ', data2);

            const extractedData = data.map((obj)=>(
                {
                    hostName: obj.data.hostName,
                    hostIp: obj.data.hostIp,
                    description: obj.data.description,
                    os: obj.data.os,
                    type: obj.data.type,
                    status: "Ongoing",
                    deleteDataAndTime: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
                    deviceId: obj.data.deviceId,
                    clientId: obj.data.clientId,
                    accountable: {
                        userId:  profileData ? profileData.USER_ID : 'N/A',
                        userName: profileData ? profileData.USER_NAME : 'N/A',
                    },
                }
            ))

            const deleteData = {
                [extractedData[0].deviceId] : extractedData[0]
            }

            const deleteDeviceHistoryData = {
                "deleteDeviceData": deleteData
            }

            console.log('delete device data: ', deleteDeviceHistoryData);

            const processId = await mapProcessName({
                processName: "Device Delete History Process"
            })

            const data3 = await startProcessV2({
                processId: processId,
                processIdentifierFields: "probeId,clientId,deviceId",
                data: deleteDeviceHistoryData
            });

            console.log('Device Delete History Process started', data3);
          })

          window.location.reload();
      }
      catch(err){
          console.error('Error in handleDelete: ', err);
      }
  }

  const addDevice = function (deviceIdWiseData: DeviceIdWiseDetailsType | undefined, deviceId: string) {
    if (deviceIdWiseData) {
      selectedDevices.current.push(deviceIdWiseData[deviceId]);

      const deviceLen = selectedDevices.current.length;

      console.log('Added device: ', selectedDevices.current);
      console.log('Device count: ', deviceLen);

      //setSelectedChkb({[deviceId] : true});

      // setSelectedChkb((prev)=> { 
      //   if(prev[deviceId]){
      //     prev[deviceId] = true;
      //   }

      //   return prev;
      //  });

      selectedChkb.current[deviceId] = true;

      if(deviceLen == 1){
        const ele = document.getElementsByClassName('showOnDeviceClick');

        for(const item of ele){
          if(item.classList.contains('hidden')){
            item.classList.remove('hidden')
          }
        }
      }

    }
  };
  
  const removeDevice = function(deviceIdWiseData: DeviceIdWiseDetailsType | undefined, deviceId: string){
    if (deviceIdWiseData) {
      let deviceLen = selectedDevices.current.length;
  
      for(let i=0, len = deviceLen; i<len; i++){
        if(selectedDevices.current[i].deviceId === deviceId){
          selectedDevices.current.splice(i, 1)
          --deviceLen;
          break;
        }
      }
  
      console.log('Removed device: ', selectedDevices.current);
      console.log('Device count: ', deviceLen);

      // setSelectedChkb((prev)=> { 
      //   if(prev[deviceId]){
      //     prev[deviceId] = false;
      //   }

      //   return prev;
      //  });

      selectedChkb.current[deviceId] = false;

      if(deviceLen == 0){
        const ele = document.getElementsByClassName('showOnDeviceClick');
  
        for(const item of ele){
          if(!item.classList.contains('hidden')){
            item.classList.add('hidden')
          }
        }
      }
      
    }
  }
  
  const checkAddOrRemove = function(event: React.MouseEvent<HTMLInputElement>, deviceIdWiseData: DeviceIdWiseDetailsType | undefined, deviceId: string){
    console.log("Clicked on checkAddOrRemove");
    if(event.currentTarget.checked){
      addDevice(deviceIdWiseData, deviceId);
    }
    else{
      removeDevice(deviceIdWiseData, deviceId);
    }
  }

  const startDiscoveryInit = function(){
    const deviceIdnotHavingProbeId: {[key: string] : string} = {};

    deviceData.forEach((device)=>{
      if(!device.probeId){
        deviceIdnotHavingProbeId[device.deviceId] = device.deviceId
      }
    });

    if (Object.keys(deviceIdnotHavingProbeId).length != 0) {
      // var hbFragment = Handlebars.compile(ref.handlebarfragmentMap["Probe Table"])({
      //   deviceIdnotHavingProbeId: ref.deviceIdnotHavingProbeId,
      //   probeListForSelectedClient: probeListForSelectedClient
      // });

      //$("#specificDiscoveryModal").html(hbFragment);

      //$("#specificDiscoverymodalTabForProbe").modal("show");

      // for (let key in ref.deviceIdnotHavingProbeId) {
      //   $('#probeList_' + key).select2();
      // }

      <ProbeListTable  open={true} close={()=>{return false}} deviceId="" refresh={()=>{}} probleIdWiseDetails={probeIdNameMap}/>

    } else {
      setShowStartDiscoveryConfirmation(true);
    }
  }

  function getExtraParams(){
      const extraParams: DTExtraParamsProps = {
          grouping: true,
          extraTools: [
            <TableToolButton_Add 
                  key='deviceAddButton'
                  classes="" 
                  //classes={access.canAddDevice ? '' : 'hidden'} 
                  onclick={
                  ()=>{
                        setIsModalOpen(true); 
                    }
                  } 
              />,
              <TableToolButton_Delete 
                  key='deviceDeleteButton'
                  classes="showOnDeviceClick hidden"
                  //classes={access.canAddDevice ? '' : 'hidden'} 
                  onclick={
                  ()=>{
                        const deviceIds = selectedDevices.current.map(device=>device.deviceId);

                        deleteConfirmation(deviceIds)
                    }
                  } 
              />,
              <TableToolButton_StartDiscovery 
                  key='startDiscoveryButton'
                  classes="showOnDeviceClick hidden"
                  //classes={access.canAddDevice ? '' : 'hidden'} 
                  onclick={
                  ()=>{
                        startDiscoveryInit()

                      //setShowStartDiscoveryConfirmation(true);
                    }
                  } 
              />,
              <TableToolButton_ConfigureDevice 
                  key='configureDeviceButton'
                  classes="showOnDeviceClick hidden" 
                  //classes={access.canAddDevice ? '' : 'hidden'} 
                  onclick={
                  ()=>{
                           
                    }
                  } 
              />,
              <TableToolButton_DiscoverHistory 
                  key='discoverHistoryButton'
                  classes="" 
                  //classes={access.canAddDevice ? '' : 'hidden'} 
                  onclick={
                  ()=>{
                        
                    }
                  } 
              />,
              <TableToolButton_DeletedDeviceHistory 
                  key='deletedDeviceHistoryButton'
                  classes="" 
                  //classes={access.canAddDevice ? '' : 'hidden'} 
                  onclick={
                  ()=>{
                        setIsModalOpen3(true); 
                    }
                  } 
              />
          ],
          pageSize: 5,
          pageSizeArray: [5, 10, 15],
      };
  
      return extraParams;
  }
  
  function getColumns(deviceIdWiseData: DeviceIdWiseDetailsType) {
      const columnDetailsSchema: DTColumnsProps<DeviceListDataType>[] = [
        {
          accessorKey: "data.deviceId",
          header: '',
          cell: ({ row }) => (
            <span>
              <input
                id={row.original.deviceId}
                defaultChecked={!!selectedChkb.current[row.original.deviceId]}
                name="selectedDevice"
                onClick={(e) => {
                  checkAddOrRemove(e, deviceIdWiseData, row.original.deviceId);
                }}
                type="checkbox"
              />
            </span>
          ),
          enableGrouping: false,
          enableSorting: false,
        },
        {
            accessorKey: "data.hostName",
            header: 'Device Name',
            cell: ({ row }) => (
              <span>{ row.original.hostName }</span>
            ),
        },
        {
            accessorKey: "data.hostIp",
            header: 'Host IP Address',
            cell: ({ row }) => (
              <span>{ row.original.hostIp }</span>
            ),
        },
        {
            accessorKey: "data.classification",
            header: 'Classification',
            cell: ({ row }) => (
              <span>{ row.original.classification }</span>
            ),
        },
        {
            accessorKey: "data.os",
            header: 'OS',
            cell: ({ row }) => (
              <span>{ trimNewline(row.original.os)}</span>
            ),
        },
        {
            accessorKey: "data.accountable.userName",
            header: 'Discovered By',
            cell: ({ row }) => (
              <span>{ row.original.accountable.userName ? row.original.accountable.userName : 'N/A' }</span>
            ),
        },
        {
            accessorKey: "",
            header: 'Probe',
            cell: ({ row }) => (
              <span>
                  {
                    probeIdNameMap && probeIdNameMap[row.original.probeId] ? probeIdNameMap[row.original.probeId] : "N/A"
                  }
              </span>
            ),
        },
        {
            accessorKey: "data.discoverDateAndTime",
            header: 'Discovered Time',
            cell: ({ row }) => (
              <span>
                  {
                      getFormattedDate(row.original.discoverDateAndTime)
                  }
              </span>
            ),
        },
        {
          accessorKey: "data.monitoringStatus",
          header: 'Monitored',
          cell: ({ row }) => (
            <span>
                { row.original.monitoringStatus }
            </span>
          ),
        },
        {
          accessorKey: "data.noOfServices",
          header: 'Services',
          cell: ({ row }) => (
            <span>
                { row.original.noOfServices }
            </span>
          ),
        },
        {
          accessorKey: "data.status",
          header: 'Device Status',
          cell: ({ row }) => (
            <span>
                { row.original.status }
            </span>
          ),
        },
        {
            accessorKey: "action",
            header: 'Action',
            enableGrouping: false,
            enableSorting: false,
            cell: ({ row }) => (
              <span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <IconTextButton variant="ghost" size="icon">
                          <MoreHorizontal className="w-5 h-5" />
                        </IconTextButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className=""  onClick={() => { }}>
                          <div>
                            <Eye />
                          </div>
                          <div>
                            View
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem 
                            className=""  
                            onClick={
                              () => { 
                                //console.log(deviceIdWiseData[row.original.deviceId])
                          
                                setSelectedDeviceForEdit(deviceIdWiseData[row.original.deviceId])
                                setIsModalOpen2(true);
                              }
                            }
                          >
                            <div>
                              <Pencil />
                            </div>
                            <div>
                              Edit
                            </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem className=""  onClick={() => {  }}>
                          <div>
                            <Activity />
                          </div>
                          <div>
                            Activity Log
                          </div>  
                        </DropdownMenuItem>

                        <DropdownMenuItem 
                            className=""  
                            onClick={
                              () => { 
                                setSelectedDeviceForEdit(deviceIdWiseData[row.original.deviceId])
                                setIsModalOpen4(true);
                              }
                            }
                          >
                          <div>
                            <Clock />
                          </div>
                          <div>
                            Polling Interval
                          </div>
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
              </span>
            ),
        }
        
      ];
  
      return columnDetailsSchema;
  }

  const deviceIdWiseData : DeviceIdWiseDetailsType = {};

  deviceData.forEach((device) => {
    deviceIdWiseData[device.deviceId] = device
  });

  const extraParams = getExtraParams();
  const columns = getColumns(deviceIdWiseData);

  return (
    <div>
      <DataTable data={deviceData} columns={columns} extraParams={extraParams}/>

      <ShowModal profileData={profileData} allActiveProbes={probeIdNameMap} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <ShowModal2 deviceData={selectedDeviceForEdit} taskId={taskId} profileData={profileData} allActiveProbes={probeIdNameMap} isModalOpen={isModalOpen2} setIsModalOpen={setIsModalOpen2} />
      <ShowModal3 profileData={profileData} isModalOpen={isModalOpen3} setIsModalOpen={setIsModalOpen3} />
      <ShowModal4 deviceId={selectedDeviceForEdit?.deviceId} serviceIdWiseDetails={serviceIdWiseDetails} isModalOpen={isModalOpen4} setIsModalOpen={setIsModalOpen4} />
      <ShowModal5 deviceData={selectedDeviceForStartDiscovery} isModalOpen={isModalOpen5} setIsModalOpen={setIsModalOpen5} />
      {
        customAlertVisible && <CustomAlertDialog title="Are you absolutely sure?" description="This action cannot be undone. This will permanently delete selected device" cancelText="Cancel" confirmText='Confirm' onConfirm={()=>{setCustomAlertVisible(true); handleDelete() }} onCancel={()=>{setCustomAlertVisible(false)}} />
      }

      {
            showStartDiscoveryConfirmation && 
              <CustomAlertDialog 
                title="Basic Service Discovery" 
                description="Start basic services discovery for the selected device" 
                cancelText="Cancel" 
                confirmText='Confirm' 
                onConfirm={
                  ()=>{
                    console.log('selected devices before render: ', selectedDevices);

                    setSelectedDeviceForStartDiscovery(selectedDevices.current)

                    setShowStartDiscoveryConfirmation(false);
                    
                    setIsModalOpen5(true);
                  }
                } 
                onCancel={
                  ()=>{
                    setShowStartDiscoveryConfirmation(false)
                  }
                } 
              />
      }
    </div>
  )
}

export default DiscoveredDevicesTable;