'use client';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/ui/dialog";
import { CreateNotification } from "../create-notification";


import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

interface LogoutDialogProps {
    open: boolean;
    onClose: () => void;
}

const formSchema = z.object({
    ruleName: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    thresholdBreachCount: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    frequencyOfOccurrence: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    evaluationInterval: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    description: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
});

export const CreateNotificationModal: React.FC<LogoutDialogProps> = ({ open, onClose }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ruleName: "",
            thresholdBreachCount: "",
            frequencyOfOccurrence: "",
            evaluationInterval: "",
            description: "",
        },
    });
    const onSubmit = form.handleSubmit((data: z.infer<typeof formSchema>) => {
        console.log("Form submitted:", data);
        // onClose();
    });
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-4/5 sm:max-w-[425px] md:max-w-[1024px] lg:max-w-[1024px] max-h-[80vh] flex flex-col rounded-lg shadow-lg p-5">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold ml-3">Create Alert</DialogTitle>
                </DialogHeader>

                {/* Separator */}
                <div className="border-t"></div>

                {/* Body Section */}
                <div className="flex-1 overflow-y-auto">
                    <CreateNotification onClose={onClose} form={form} />
                </div>
                {/* Footer Section */}
                <DialogFooter>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow mr-2"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow"
                            // className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow ml-2"
                            onClick={onSubmit}
                        >
                            Create Notification
                        </button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
