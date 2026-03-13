import type { FastifyInstance } from "fastify";

import { readEnv } from "@vexus/config";

import { buildApp } from "./build-app";
import { startChatGptOAuthLoopbackListener } from "./chatgpt-oauth-loopback";

export async function startServer(): Promise<FastifyInstance> {
  const env = readEnv();
  const app = await buildApp();
  const loopbackServer = await startChatGptOAuthLoopbackListener(app);

  if (loopbackServer) {
    app.addHook("onClose", async () => {
      await new Promise<void>((resolve, reject) => {
        loopbackServer.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    });
  }

  await app.listen({
    host: "0.0.0.0",
    port: env.VEXUS_GATEWAY_PORT
  });

  return app;
}
