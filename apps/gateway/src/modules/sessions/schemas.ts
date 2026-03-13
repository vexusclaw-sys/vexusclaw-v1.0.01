import { z } from "zod";

import { channelTypes, sessionStatuses } from "@vexus/shared";

export const sessionListQuerySchema = z.object({
  agentId: z.string().uuid().optional(),
  channelConnectionId: z.string().uuid().optional(),
  channelType: z.enum(channelTypes).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(20),
  query: z.string().trim().min(1).max(120).optional(),
  status: z.enum(sessionStatuses).optional()
});
