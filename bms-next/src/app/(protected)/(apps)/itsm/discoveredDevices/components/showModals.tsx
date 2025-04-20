'use client'

import { Dispatch, FC, SetStateAction } from "react"
import DeviceModalAddForm from "./DeviceModalAddForm";
import { DeviceListDataType, probleIdMapType, ProfileDataType, serviceDetails } from "../types";
import DeviceModalEditForm from "./DeviceModalEditForm";
import DeletedDeviceHistoryForm from "./DeletedDeviceHistoryForm";
import DevicePollingIntervalModal from "./DevicePollingIntervalModalForm";
import StartBasicServiceDiscovery from "./StartBasicServiceDiscovery";

interface CommomModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

interface ShowModalProps extends CommomModalProps{
  profileData: ProfileDataType;
  allActiveProbes: probleIdMapType | undefined;
}

interface ShowModalProps2 extends ShowModalProps {
  taskId: string;
  deviceData: DeviceListDataType | undefined
}

interface ShowModalProps3 extends CommomModalProps{
  profileData: ProfileDataType;
}

interface ShowModalProps4 extends CommomModalProps{
  deviceId: string | undefined;
  serviceIdWiseDetails: {
    [key: string] : serviceDetails
  }
}

interface ShowModalProps5 extends CommomModalProps{
  deviceData: DeviceListDataType[];
}

export const ShowModal: FC<ShowModalProps> = ({profileData, allActiveProbes, isModalOpen, setIsModalOpen}) => {
    return(
        <>
            {
              isModalOpen && <DeviceModalAddForm
                open={!!isModalOpen}
                close={
                  () => (
                    setIsModalOpen(false)
                  )
                }
                refresh={
                  () => {
                    window.location.reload()
                  } 
                }
                profile={
                  profileData
                }
                probleIdWiseDetails={
                  allActiveProbes
                }
             />
            }
        </>
    )
}

export const ShowModal2: FC<ShowModalProps2> = ({deviceData, taskId, profileData, allActiveProbes, isModalOpen, setIsModalOpen}) => {
    return(
        <>
            {
              isModalOpen && deviceData && <DeviceModalEditForm
                open={!!isModalOpen}
                close={
                  () => (
                    setIsModalOpen(false)
                  )
                }
                refresh={
                  () => {
                    window.location.reload()
                  } 
                }
                profile={
                  profileData
                }
                probleIdWiseDetails={
                  allActiveProbes
                }
                deviceData={deviceData}
                taskId={taskId}
             />
            }
        </>
    )
}

export const ShowModal3: FC<ShowModalProps3> = ({profileData, isModalOpen, setIsModalOpen}) => {
  return (
    <>
      {
        isModalOpen && <DeletedDeviceHistoryForm
          open={!!isModalOpen}
          close={
            () => (
              setIsModalOpen(false)
            )
          }
          profile={
            profileData
          }
        />
      }
    </>
  )
}

export const ShowModal4: FC<ShowModalProps4> = ({isModalOpen, setIsModalOpen, deviceId, serviceIdWiseDetails}) => {
  return (
    <>
      {
        isModalOpen && <DevicePollingIntervalModal
          open={!!isModalOpen} 
          close={
            () => {
              setIsModalOpen(false);
            }
          }
          deviceId={deviceId}
          refresh={
            () => {
              window.location.reload()
            } 
          }
          serviceIdWiseDetails={serviceIdWiseDetails}
        />
      }
    </>
  )
}

export const ShowModal5 : FC<ShowModalProps5> = ({isModalOpen, setIsModalOpen, deviceData}) => {
  return(
    <>
      {
        isModalOpen && <StartBasicServiceDiscovery
        open = {!!isModalOpen} 
        close = {
          () => {
            setIsModalOpen(false);
          }
        }
        deviceData = {deviceData}
        refresh={
          () => {
            window.location.reload()
          } 
        }
      />
      }
    </>
  )
}