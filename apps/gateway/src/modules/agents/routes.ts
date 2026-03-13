import type { FastifyInstance } from "fastify";

import { HttpError } from "../../app/errors";
import { apiOk } from "../../app/http";
import { createAgentSchema } from "./schemas";

export async function registerAgentRoutes(app: FastifyInstance<any, any, any, any>) {
  app.get("/agents", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    return apiOk(await app.services.agents.list(workspaceId));
  });

  app.post("/agents", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    const input = createAgentSchema.parse(request.body);
    return apiOk(await app.services.agents.create(workspaceId, input));
  });

  app.patch("/agents/:id", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    const params = request.params as { id: string };
    const input = createAgentSchema.parse(request.body);
    return apiOk(await app.services.agents.update(workspaceId, params.id, input));
  });
}
