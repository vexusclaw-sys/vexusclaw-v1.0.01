import { z } from "zod";

import { providerTypes } from "@vexus/shared";

export const setupBootstrapSchema = z.object({
  workspaceName: z.string().min(2),
  domain: z.string().min(1),
  workspaceSlug: z.string().min(2).optional()
});

export const setupAdminSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(12)
});

export const setupProviderSchema = z.object({
  providerType: z.enum(providerTypes),
  mode: z.enum(["api_key", "oauth_stub", "skip"]).optional(),
  apiKey: z.string().min(10).optional(),
  label: z.string().min(2).optional()
});

export const setupFinalizeSchema = z.object({
  agentName: z.string().min(2).optional(),
  agentRole: z.string().min(2).optional(),
  instructions: z.string().min(12).optional(),
  tone: z.string().min(2).optional(),
  createDefaultAgent: z.boolean().optional().default(true),
  provisionWhatsApp: z.boolean().optional().default(true)
}).superRefine((input, ctx) => {
  if (input.createDefaultAgent === false) {
    return;
  }

  if (!input.agentName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "agentName is required when createDefaultAgent is true.",
      path: ["agentName"]
    });
  }

  if (!input.agentRole) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "agentRole is required when createDefaultAgent is true.",
      path: ["agentRole"]
    });
  }

  if (!input.instructions) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "instructions are required when createDefaultAgent is true.",
      path: ["instructions"]
    });
  }

  if (!input.tone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "tone is required when createDefaultAgent is true.",
      path: ["tone"]
    });
  }
});
