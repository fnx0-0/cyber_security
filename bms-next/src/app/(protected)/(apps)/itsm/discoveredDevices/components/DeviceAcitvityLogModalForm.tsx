import { TextButtonWithTooltip } from "@/ikon/components/buttons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Save } from "lucide-react";
import { FC } from "react";

const DeviceActivityLog : FC<> = () => {
    return (
        <>
            <Dialog open={} onOpenChange={}>
                <DialogContent className="sm:max-w-[425px]">

                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
            
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
            
                    <div>
                    
                    </div>
                
                    <DialogFooter>
                        <TextButtonWithTooltip type="submit" tooltipContent="save"> <Save/> Save</TextButtonWithTooltip>
                    </DialogFooter>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default DeviceActivityLog