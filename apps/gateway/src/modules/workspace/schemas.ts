import { z } from "zod";

export const updateSettingsSchema = z.object({
  workspaceName: z.string().min(2).optional(),
  domain: z.string().min(1).optional()
});
