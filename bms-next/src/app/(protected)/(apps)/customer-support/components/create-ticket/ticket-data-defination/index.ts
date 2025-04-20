import { z } from 'zod'

 const AddTicketFormSchema = z.object({
    subject: z.string().nonempty("Please enter Subject"),
    accountId: z.string().optional(),
    applicationId: z.string().optional(),
    issueDate: z.string().nonempty("Please enter issueDate"),
    type: z.string().nonempty("Please enter type"),
    priority: z.string().nonempty("Please enter priority"),
    supportMessage: z.string().nonempty("Please enter supportMessage"),
    mobile: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number").optional(),
})

export { AddTicketFormSchema };