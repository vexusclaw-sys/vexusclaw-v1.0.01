import { z } from "zod";

export const selfHostClaimSchema = z.object({
  ipAddress: z.string().min(7).max(64).optional()
});

export const selfHostClaimParamsSchema = z.object({
  slug: z.string().min(6).max(32)
});
