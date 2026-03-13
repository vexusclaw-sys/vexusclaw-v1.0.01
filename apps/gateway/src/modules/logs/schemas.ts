import { z } from "zod";

import { channelEventTypes } from "@vexus/shared";

export const channelLogQuerySchema = z.object({
  channelConnectionId: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(20),
  query: z.string().trim().min(1).max(120).optional(),
  type: z.enum(channelEventTypes).optional()
});
