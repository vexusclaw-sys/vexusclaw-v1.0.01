import type { FastifyInstance } from "fastify";

export async function registerRootRoutes(app: FastifyInstance<any, any, any, any>) {
  app.get("/", async () => ({
    name: "VEXUSCLAW Gateway",
    status: "online",
    docs: "/api/v1/setup/status"
  }));
}
