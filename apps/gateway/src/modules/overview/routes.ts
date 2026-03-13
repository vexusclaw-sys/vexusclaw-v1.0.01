import type { FastifyInstance } from "fastify";

import { HttpError } from "../../app/errors";
import { apiOk } from "../../app/http";

export async function registerOverviewRoutes(app: FastifyInstance) {
  app.get("/overview", { preHandler: app.authenticate }, async (request) => {
    const workspaceId = request.authContext?.workspaceId;

    if (!workspaceId) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    return apiOk(
      await app.services.overview.getOverview(workspaceId, {
        matchedBySubdomain: request.hostWorkspace?.access.matchedBySubdomain,
        resolvedHost: request.hostWorkspace?.access.resolvedHost
      })
    );
  });
}
