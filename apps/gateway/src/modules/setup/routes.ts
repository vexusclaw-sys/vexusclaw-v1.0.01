import type { FastifyInstance } from "fastify";

import { setAuthCookies } from "../../app/cookies";
import { apiOk, getRequestIp } from "../../app/http";
import {
  setupAdminSchema,
  setupBootstrapSchema,
  setupFinalizeSchema,
  setupProviderSchema
} from "./schemas";

export async function registerSetupRoutes(app: FastifyInstance) {
  app.get("/setup/status", async (request) =>
    apiOk(await app.services.setup.getStatus(request.hostWorkspace?.workspace.id))
  );

  app.post("/setup/bootstrap", async (request) => {
    const input = setupBootstrapSchema.parse(request.body);
    return apiOk(await app.services.setup.bootstrap(input, request.hostWorkspace?.workspace.id));
  });

  app.post("/setup/admin", async (request, reply) => {
    const input = setupAdminSchema.parse(request.body);
    await app.services.setup.configureAdmin(input, request.hostWorkspace?.workspace.id);

    const result = await app.services.auth.login(
      {
        email: input.email,
        password: input.password
      },
      {
        ipAddress: getRequestIp(request),
        userAgent: request.headers["user-agent"]
      },
      request.hostWorkspace?.workspace.id
    );

    setAuthCookies(reply, app.services.auth.getEnv(), result);

    return apiOk({
      session: result.session,
      setup: await app.services.setup.getStatus(request.hostWorkspace?.workspace.id)
    });
  });

  app.post("/setup/provider", async (request) => {
    const input = setupProviderSchema.parse(request.body);

    return apiOk(
      await app.services.setup.configureProvider({
        ...input,
        actorUserId: request.authContext?.sub
      }, request.authContext?.workspaceId ?? request.hostWorkspace?.workspace.id)
    );
  });

  app.post("/setup/finalize", async (request) => {
    const input = setupFinalizeSchema.parse(request.body);
    return apiOk(
      await app.services.setup.finalize(
        input,
        request.authContext?.sub,
        request.authContext?.workspaceId ?? request.hostWorkspace?.workspace.id
      )
    );
  });
}
