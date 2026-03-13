import type { FastifyInstance } from "fastify";

import { authCookieNames } from "@vexus/shared";

import { clearAuthCookies, setAuthCookies } from "../../app/cookies";
import { HttpError } from "../../app/errors";
import { apiOk, getRequestIp } from "../../app/http";
import { loginSchema } from "./schemas";

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post("/auth/login", async (request, reply) => {
    const input = loginSchema.parse(request.body);
    const result = await app.services.auth.login(input, {
      ipAddress: getRequestIp(request),
      userAgent: request.headers["user-agent"]
    }, request.hostWorkspace?.workspace.id);

    setAuthCookies(reply, app.services.auth.getEnv(), result);

    return apiOk(result.session);
  });

  app.post("/auth/refresh", async (request, reply) => {
    const refreshToken = request.cookies[authCookieNames.refreshToken];

    if (!refreshToken) {
      throw new HttpError(401, "Refresh token not found.", "AUTH_REFRESH_MISSING");
    }

    const result = await app.services.auth.refresh(refreshToken, {
      ipAddress: getRequestIp(request),
      userAgent: request.headers["user-agent"]
    }, request.hostWorkspace?.workspace.id);

    setAuthCookies(reply, app.services.auth.getEnv(), result);

    return apiOk(result.session);
  });

  app.post("/auth/logout", async (request, reply) => {
    await app.services.auth.logout(request.cookies[authCookieNames.refreshToken]);
    clearAuthCookies(reply, app.services.auth.getEnv());

    return apiOk({
      success: true
    });
  });

  app.get("/auth/me", { preHandler: app.authenticate }, async (request) => {
    if (!request.authContext) {
      throw new HttpError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    return apiOk(await app.services.auth.getSessionFromPayload(request.authContext));
  });
}
