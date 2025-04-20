import Icon from '../icon'
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/shadcn/ui/form"
import { Input } from "@/shadcn/ui/input"
import { Card, CardContent } from "@/shadcn/ui/card"

interface InputFormFieldProps {
    form: any; // Replace `any` with the appropriate type for your form object
    name: string;
    label: string;
    placeholder?: string;
    iconName?: string;
    required?: boolean;
}
export default function InputFormField(InputFormFieldProps: InputFormFieldProps) {
    const { form, name, label, placeholder, iconName, required } = InputFormFieldProps;
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Card className="w-full">
                            <CardContent className="p-2 flex items-center gap-2 border rounded-md">
                                <div className="p-2 border-r flex items-center">
                                    {/* <FileText className="w-5 h-5 text-gray-500" /> */}
                                    <Icon name={iconName} className="w-5 h-5 text-gray-500" />
                                </div>
                                {/* Floating label wrapper */}
                                <div className="flex-1 relative">
                                    <Input
                                        id={name}
                                        placeholder=" "
                                        className="peer h-12 w-full px-2 pt-2 text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                        {...field}
                                    />
                                    {/* <label
                                        htmlFor={name}
                                        // className="absolute px-2 top-2 text-gray-500 text-sm transition-all 
                                        //                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                                        //                peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-500 
                                        //                peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs"
                                        className="absolute px-2 top-0 text-gray-500 text-sm transition-all 
                                                       peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                                                       peer-focus:text-xs peer-focus:text-gray-500 
                                                       peer-[&:not(:placeholder-shown)]:text-xs"

                                    >
                                        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
                                    </label> */}
                                    <label
                                        htmlFor={name}
                                        className="absolute px-2 top-0 text-gray-400 text-base transition-all
                                                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
                                                    peer-focus:top-0 peer-focus:text-xs peer-focus:text-gray-500
                                                    peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-xs"
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