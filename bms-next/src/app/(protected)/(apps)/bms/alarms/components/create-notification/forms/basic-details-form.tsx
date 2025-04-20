"use client"

import { UseFormReturn } from "react-hook-form"
import InputFormField from '../../../../components/form-components/InputFormField'
import TextareaFormField from '../../../../components/form-components/TextareaFormField'

export function BasicDettailsForm({ form }: { form: UseFormReturn<any> }) {
    return (
        <form className="space-y-2">
            <InputFormField form={form} name="ruleName" label="Rule Name" iconName="sticky-note" required={true} />
            <InputFormField form={form} name="thresholdBreachCount" label="Threshold Breach Count" iconName="shield-alert" required={true} />
            <InputFormField form={form} name="frequencyOfOccurrence" label="Frequency of Occurence" iconName="list" required={true} />
            <InputFormField form={form} name="evaluationInterval" label="Evaluation Interval" iconName="hourglass" required={true} />
            <TextareaFormField form={form} name="description" label="Description" iconName="file-text" required={true} />
        </form >
    )
}
