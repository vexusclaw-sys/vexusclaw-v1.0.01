import type { FastifyInstance } from "fastify";

export async function registerHealthRoutes(app: FastifyInstance<any, any, any, any>) {
  app.get("/health", async () => app.services.health.getReport());

  app.get("/health/live", async () => ({
    status: "ok",
    timestamp: new Date().toISOString()
  }));

  app.get("/health/ready", async (_request, reply) => {
    const readiness = await app.services.health.getReadiness();

    if (!readiness.ready) {
      reply.code(503);
    }

    return readiness.report;
  });
}
