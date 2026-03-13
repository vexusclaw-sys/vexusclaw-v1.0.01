import type { FastifyInstance, FastifyRequest } from "fastify";

import { HttpError } from "../../app/errors";
import { apiOk, getAuthorizationToken, getRequestIp } from "../../app/http";
import {
  selfHostClaimParamsSchema,
  selfHostClaimSchema
} from "./schemas";

function getInstallTokenFromRequest(request: FastifyRequest) {
  const rawHeader = request.headers["x-vexus-install-token"];
  const installToken = Array.isArray(rawHeader)
    ? rawHeader[0]
    : rawHeader ?? getAuthorizationToken(request);

  if (!installToken || typeof installToken !== "string") {
    throw new HttpError(
      401,
      "A self-host install token is required for provisioning.",
      "SELF_HOST_INSTALL_TOKEN_REQUIRED"
    );
  }

  return installToken.trim();
}

export async function registerProvisioningRoutes(app: FastifyInstance) {
  app.post("/provisioning/self-host/claim", async (request) => {
    const input = selfHostClaimSchema.parse(request.body);

    return apiOk(
      await app.services.provisioning.claim({
        installToken: getInstallTokenFromRequest(request),
        ipAddress: input.ipAddress,
        requestIp: getRequestIp(request)
      })
    );
  });

  app.put("/provisioning/self-host/claim/:slug", async (request) => {
    const input = selfHostClaimSchema.parse(request.body);
    const params = selfHostClaimParamsSchema.parse(request.params);

    return apiOk(
      await app.services.provisioning.updateClaim({
        installToken: getInstallTokenFromRequest(request),
        slug: params.slug,
        ipAddress: input.ipAddress,
        requestIp: getRequestIp(request)
      })
    );
  });

  app.get("/provisioning/self-host/claim/:slug", async (request) => {
    const params = selfHostClaimParamsSchema.parse(request.params);

    return apiOk(
      await app.services.provisioning.getClaimStatus({
        installToken: getInstallTokenFromRequest(request),
        slug: params.slug
      })
    );
  });
}
