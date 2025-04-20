import Icon from '../icon'
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/shadcn/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/ui/select"
import { Card, CardContent } from "@/shadcn/ui/card"

interface InputFormFieldProps {
    form: any; // Replace `any` with the appropriate type for your form object
    name: string;
    label: string;
    placeholder?: string;
    iconName?: string;
    required?: boolean;
}
import { cn } from "@/shadcn/lib/utils";
import { useEffect, useState } from "react";

export default function SelectFormField(InputFormFieldProps: InputFormFieldProps) {
    const { form, name, label, placeholder, iconName, required } = InputFormFieldProps;
    const selectedValue = form.watch(name);
    const [isFocused, setIsFocused] = useState(false);
    return (
        // <FormField
        //     control={form.control}
        //     name={name}
        //     render={({ field }) => (
        //         <FormItem>
        //             <FormControl>
        //                 <Card className="w-full">
        //                     <CardContent className="p-3 flex items-center gap-2 border rounded-md">
        //                         <div className="p-2 border-r flex items-center">
        //                             {/* Replace Icon component if needed */}
        //                             <Icon name={iconName} className="w-5 h-5 text-gray-500" />
        //                         </div>
        //                         <div className="flex-1 relative">
        //                             <Select
        //                                 onValueChange={field.onChange}
        //                                 defaultValue={field.value}
        //                                 onOpenChange={(open) => setIsFocused(open)}
        //                             >
        //                                 <FormControl>
        //                                     <SelectTrigger
        //                                         className="peer border-none shadow-none focus:ring-0 focus:ring-offset-0"
        //                                     >
        //                                         <SelectValue placeholder="This is my placeholder" />
        //                                     </SelectTrigger>
        //                                 </FormControl>
        //                                 <SelectContent>
        //                                     <SelectItem value="m@example.com">m@example.com</SelectItem>
        //                                     <SelectItem value="m@google.com">m@google.com</SelectItem>
        //                                     <SelectItem value="m@support.com">m@support.com</SelectItem>
        //                                 </SelectContent>
        //                             </Select>

        //                             <label
        //                                 htmlFor={name}
        //                                 className={cn(
        //                                     "absolute left-2 transition-all pointer-events-none",
        //                                     (isFocused || selectedValue)
        //                                         ? "text-xs -top-2 text-gray-600"
        //                                         : "text-base top-2.5 text-gray-400"
        //                                 )}
        //                             >
        //                                 {label}
        //                                 {required && <span className="text-red-500 ml-0.5">*</span>}
        //                             </label>
        //                         </div>
        //                     </CardContent>
        //                 </Card>
        //             </FormControl>
        //             <FormMessage />
        //         </FormItem>
        //     )}
        // />
        <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormControl>
                    <Card className="w-full">
                        <CardContent className="p-3 flex items-center gap-2 border rounded-md">
                            <div className="p-2 border-r flex items-center">
                                {/* Replace Icon component if needed */}
                                <Icon name={iconName} className="w-5 h-5 text-gray-500" />
                            </div>
                            <div className="flex-1 relative">
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    onOpenChange={(open) => setIsFocused(open)}
                                >
                                    <FormControl>
                                        <SelectTrigger
                                            className="peer border-none shadow-none focus:ring-0 focus:ring-offset-0"
                                        >
                                            <SelectValue placeholder="Please Select the Value" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="m@example.com">m@example.com</SelectItem>
                                        <SelectItem value="m@google.com">m@google.com</SelectItem>
                                        <SelectItem value="m@support.com">m@support.com</SelectItem>
                                    </SelectContent>
                                </Select>

                                <label
                                    htmlFor={name}
                                    className={cn(
                                        "absolute left-2 transition-all pointer-events-none text-xs -top-2 text-gray-600",
                                        // (isFocused || selectedValue)
                                        //     ? "text-xs -top-2 text-gray-600"
                                        //     : "text-base top-2.5 text-gray-400"
                                    )}
                                >
                                    {label}
                                    {required && <span className="text-red-500 ml-0.5">*</span>}
                                </label>
                            </div>
                        </CardContent>
                    </Card>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />

    )
}