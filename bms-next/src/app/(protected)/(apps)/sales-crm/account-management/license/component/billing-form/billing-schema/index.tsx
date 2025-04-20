import { z } from "zod";

export const BillingSchema = z.object({
  name: z.string().optional(),
});
