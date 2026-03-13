import { z } from "zod";

import { providerTypes } from "@vexus/shared";

export const providerConnectionSchema = z.object({
  provider: z.enum(providerTypes),
  label: z.string().min(2),
  apiKey: z.string().min(10).optional(),
  mode: z.enum(["api_key", "oauth_imported", "oauth_pkce", "oauth_stub"]).optional(),
  isPrimary: z.boolean().optional()
});

export const providerUpdateSchema = providerConnectionSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: "At least one provider field must be updated."
  }
);

export const openAITestSchema = z.object({
  apiKey: z.string().min(10)
});

export const chatGptOAuthStartSchema = z.object({
  label: z.string().trim().min(2).max(80).optional(),
  makePrimary: z.boolean().optional(),
  returnToPath: z.string().trim().max(160).optional()
});

export const chatGptOAuthManualCompleteSchema = z
  .object({
    attemptId: z.string().trim().min(1).optional(),
    callbackUrl: z.string().trim().min(1).optional(),
    code: z.string().trim().min(1).optional(),
    state: z.string().trim().min(1).optional()
  })
  .refine(
    (value) =>
      Boolean(value.callbackUrl) ||
      Boolean(value.code) ||
      (Boolean(value.code) && Boolean(value.state)) ||
      (Boolean(value.code) && Boolean(value.attemptId)),
    {
      message: "Provide callbackUrl, code, code+state, or code+attemptId."
    }
  );

export const chatGptSessionImportSchema = z.object({
  authJson: z.string().trim().min(2),
  label: z.string().trim().min(2).max(80).optional(),
  makePrimary: z.boolean().optional()
});

export const chatGptOAuthCallbackQuerySchema = z.object({
  code: z.string().trim().min(1).optional(),
  error: z.string().trim().min(1).optional(),
  error_description: z.string().trim().min(1).optional(),
  state: z.string().trim().min(1).optional()
});
