import type { FastifyInstance } from "fastify";

import { HttpError } from "../../app/errors";
import { apiOk } from "../../app/http";
import { updateSettingsSchema } from "./schemas";

export async function registerWorkspaceRoutes(app: FastifyInstance) {
  app.get("/settings", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    return apiOk(await app.services.workspace.getSettings(workspaceId));
  });

  app.patch("/settings", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    const input = updateSettingsSchema.parse(request.body);
    return apiOk(await app.services.workspace.updateSettings(workspaceId, input));
  });

  app.get("/workspace", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    return apiOk(await app.services.workspace.getSettings(workspaceId));
  });
}
