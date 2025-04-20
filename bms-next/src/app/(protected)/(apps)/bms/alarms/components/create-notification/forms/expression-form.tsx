"use client"

import { Form, UseFormReturn } from "react-hook-form"
import InputFormField from '../../../../components/form-components/InputFormField'
import TextareaFormField from '../../../../components/form-components/TextareaFormField'
import SelectFormField from '../../../../components/form-components/SelectFormField'

export function ExpressionForm({ form, onClose }: { form: UseFormReturn<any>; onClose: () => void }) {
    return (
            <form className="space-y-2">
                <InputFormField form={form} name="expressionName" label="Expression Name" iconName="shield-alert" required={false} />
                <SelectFormField form={form} name="thresholdBreachCount" label="Threshold Breach Count" iconName="shield-alert" required={true} />
                <SelectFormField form={form} name="frequencyOfOccurrence" label="Frequency of Occurence" iconName="list" required={true} />
                <SelectFormField form={form} name="evaluationInterval" label="Evaluation Interval" iconName="hourglass" required={true} />
                <SelectFormField form={form} name="description" label="Description" iconName="file-text" required={true} />
            </form>
        // <h1 className="text-lg font-semibold ml-3">Expression Name</h1>
    )
}
