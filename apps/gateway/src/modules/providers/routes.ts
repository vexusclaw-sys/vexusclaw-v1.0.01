import type { FastifyInstance } from "fastify";

import { HttpError } from "../../app/errors";
import { apiOk } from "../../app/http";
import { getRequestOrigin } from "../../app/http";
import {
  chatGptOAuthCallbackQuerySchema,
  chatGptSessionImportSchema,
  chatGptOAuthManualCompleteSchema,
  chatGptOAuthStartSchema,
  openAITestSchema,
  providerConnectionSchema,
  providerUpdateSchema
} from "./schemas";

export async function registerProviderRoutes(app: FastifyInstance) {
  app.get("/providers", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    return apiOk(await app.services.providers.list(workspaceId));
  });

  app.post("/providers/openai/test", { preHandler: app.authenticate }, async (request) => {
    const input = openAITestSchema.parse(request.body);
    return apiOk(await app.services.providers.testOpenAI(input.apiKey));
  });

  app.post("/providers/chatgpt/oauth/start", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;
    const actorUserId = request.authContext?.sub;

    if (!workspaceId || !actorUserId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    const input = chatGptOAuthStartSchema.parse(request.body ?? {});

    return apiOk(
      await app.services.chatgptOAuth.createAttempt({
        actorUserId,
        hostWorkspace: request.hostWorkspace,
        requestOrigin: getRequestOrigin(request),
        start: input,
        workspaceId
      })
    );
  });

  app.get("/providers/chatgpt/oauth/callback", async (request, reply) => {
    const query = chatGptOAuthCallbackQuerySchema.parse(request.query);
    const redirectUrl = await app.services.chatgptOAuth.completeFromCallback({
      code: query.code,
      error: query.error,
      errorDescription: query.error_description,
      requestOrigin: getRequestOrigin(request),
      state: query.state
    });

    return reply.redirect(redirectUrl);
  });

  app.post(
    "/providers/chatgpt/import-session",
    { preHandler: app.authenticate },
    async (request) => {
      const workspaceId = request.authContext?.workspaceId;
      const actorUserId = request.authContext?.sub;

      if (!workspaceId || !actorUserId) {
        throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
      }

      const input = chatGptSessionImportSchema.parse(request.body);

      return apiOk(
        await app.services.chatgptOAuth.importSession({
          actorUserId,
          authJson: input.authJson,
          label: input.label,
          makePrimary: input.makePrimary,
          workspaceId
        })
      );
    }
  );

  app.post(
    "/providers/chatgpt/oauth/complete-manual",
    { preHandler: app.authenticate },
    async (request) => {
      const workspaceId = request.authContext?.workspaceId;

      if (!workspaceId) {
        throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
      }

      const input = chatGptOAuthManualCompleteSchema.parse(request.body);

      return apiOk(await app.services.chatgptOAuth.completeManual(workspaceId, input));
    }
  );

  app.get(
    "/providers/chatgpt/oauth/attempts/:id",
    { preHandler: app.authenticate },
    async (request) => {
      const workspaceId = request.authContext?.workspaceId;

      if (!workspaceId) {
        throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
      }

      const params = request.params as { id: string };
      return apiOk(await app.services.chatgptOAuth.getAttemptStatus(workspaceId, params.id));
    }
  );

  app.post("/providers/connections", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;
    const actorUserId = request.authContext?.sub;

    if (!workspaceId || !actorUserId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    const input = providerConnectionSchema.parse(request.body);
    return apiOk(await app.services.providers.createConnection(workspaceId, actorUserId, input));
  });

  app.patch(
    "/providers/connections/:id",
    { preHandler: app.authenticate },
    async (request) => {
      const workspaceId = request.authContext?.workspaceId;
      const actorUserId = request.authContext?.sub;

      if (!workspaceId || !actorUserId) {
        throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
      }

      const input = providerUpdateSchema.parse(request.body);
      const params = request.params as { id: string };

      return apiOk(
        await app.services.providers.updateConnection(workspaceId, params.id, actorUserId, input)
      );
    }
  );

  app.patch(
    "/providers/connections/:id/primary",
    { preHandler: app.authenticate },
    async (request) => {
      const workspaceId = request.authContext?.workspaceId;

      if (!workspaceId) {
        throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
      }

      const params = request.params as { id: string };
      return apiOk(await app.services.providers.setPrimaryConnection(workspaceId, params.id));
    }
  );

  app.delete(
    "/providers/connections/:id",
    { preHandler: app.authenticate },
    async (request) => {
      const workspaceId = request.authContext?.workspaceId;

      if (!workspaceId) {
        throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
      }

      const params = request.params as { id: string };
      await app.services.providers.deleteConnection(workspaceId, params.id);

      return apiOk({
        success: true
      });
    }
  );
}
