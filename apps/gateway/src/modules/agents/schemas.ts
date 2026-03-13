import { z } from "zod";

export const createAgentSchema = z.object({
  description: z.string().trim().max(280).optional(),
  instructions: z.string().trim().min(4),
  name: z.string().trim().min(2).max(80),
  operatorAddressing: z.string().trim().max(80).optional(),
  role: z.string().trim().min(2).max(80),
  tone: z.string().trim().min(2).max(80)
});
