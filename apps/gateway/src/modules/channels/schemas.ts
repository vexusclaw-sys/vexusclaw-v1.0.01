import { z } from "zod";

export const createWhatsAppConnectionSchema = z.object({
  name: z.string().min(2).max(80).optional()
});
