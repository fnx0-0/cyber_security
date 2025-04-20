import { TextButtonWithTooltip } from "@/ikon/components/buttons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Save } from "lucide-react";
import { ProbeListTableType, probleIdMapType } from "../types";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { useState } from "react";

type comboType = {label: string, value: string};

function saveProbeList() {
    //const ref = ModuleLandingPage1679220395135;
    const deviceWiseSelectedProbe = storeDataFromProbeList(deviceIdnotHavingProbeId);
    ref.specificDevicesDiscovery(deviceWiseSelectedProbe);
    $("#specificDiscoverymodalTabForProbe").modal("hide");

    // const hbFragment = Handlebars.compile(ref.handlebarfragmentMap["Specific Discovery Table"])({
    //     deviceData: ref.selectedDeviceIdArray
    // });

    // const hbFragment1 = Handlebars.compile(ref.handlebarfragmentMap["Specific Discovery Table-With Status"])({
    //     deviceData: ref.selectedDeviceIdArray
    // });

    //$("#specificDiscoveryModal").html(hbFragment);
    //$("#specificDiscoverytable").html(hbFragment1);

    //$('#deviceSpecificTable').DataTable();
}

function storeDataFromProbeList(deviceIdnotHavingProbeId: probleIdMapType) {
    //const ref = ModuleLandingPage1679220395135;
    const deviceWiseSelectedProbe = {};
    for (const key in deviceIdnotHavingProbeId) {
        const selectedProbe = $("#probeList_" + key).val();
        deviceWiseSelectedProbe[key] = selectedProbe;
    }
    return deviceWiseSelectedProbe;
}

export default function ProbeListTable({open, close, probleIdWiseDetails}: ProbeListTableType){
    const [probeDataList, setProbeDataList] = useState<comboType[]>();
    
    if(probleIdWiseDetails){
        const probeData: comboType[] = [];

        Object.keys(probleIdWiseDetails).forEach(
            (probeId)=>{
                probeData.push({
                    value: probeId,
                    label: probleIdWiseDetails[probeId]
                })
            }
        )

        setProbeDataList(probeData)
    }
    
    return (
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="overflow-auto min-w-[max-content]">
                    <DialogHeader>
                        <DialogTitle>
                            Probe list
                        </DialogTitle>

                        <DialogDescription>
                            Select probe to run device on
                        </DialogDescription>
                        
                    </DialogHeader>

                    <div>
                        <div>
                            {/* {
                                !deviceServiceAssociationData.length ? (
                                    <div className="min-h-16 mt-16">
                                        <LoadingSpinner size={60} />
                                    </div>
                                ) : (
                                    <DataTable data={deviceServiceAssociationData} columns={columns} extraParams={extraParams} />
                                )
                            } */
                            
                                <FormComboboxInput name="probeIdList" formControl='' items={probeDataList?.length ? probeDataList : []} />
                            
                            }
                            Hello
                        </div>
                    </div>

                    {
                        //deviceServiceAssociationData.length ? (
                            <DialogFooter>
                                <TextButtonWithTooltip tooltipContent='Save'> 
                                    <Save /> Save
                                </TextButtonWithTooltip>
                            </DialogFooter>
                        //) : null
                    }
                </DialogContent>
           </Dialog>
        </>
    )
}