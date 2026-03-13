import { createServer, type Server } from "node:http";

import type { FastifyInstance } from "fastify";

import { readEnv } from "@vexus/config";

const successHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ChatGPT OAuth complete</title>
</head>
<body>
  <p>Conexao concluida com sucesso. Voce pode fechar esta janela.</p>
</body>
</html>`;

function errorHtml(message: string): string {
  const escaped = message
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ChatGPT OAuth failed</title>
</head>
<body>
  <p>${escaped}</p>
  <p>Volte para a VEXUSCLAW e use o fallback manual se necessario.</p>
</body>
</html>`;
}

export async function startChatGptOAuthLoopbackListener(
  app: FastifyInstance
): Promise<Server | null> {
  const env = readEnv();

  if (!env.OPENAI_CHATGPT_OAUTH_LOOPBACK_ENABLED) {
    app.log.info("ChatGPT OAuth loopback listener disabled by configuration");
    return null;
  }

  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", "http://localhost");

      if (url.pathname !== "/auth/callback") {
        response.statusCode = 404;
        response.setHeader("Content-Type", "text/plain; charset=utf-8");
        response.end("Not found");
        return;
      }

      const result = await app.services.chatgptOAuth.completeFromLoopbackCallback({
        code: url.searchParams.get("code") ?? undefined,
        error: url.searchParams.get("error") ?? undefined,
        errorDescription: url.searchParams.get("error_description") ?? undefined,
        state: url.searchParams.get("state") ?? undefined
      });

      response.statusCode = result.status === "success" ? 200 : 400;
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(result.status === "success" ? successHtml : errorHtml(result.message));
    } catch (error) {
      app.log.error({ error }, "ChatGPT OAuth loopback callback failed");
      response.statusCode = 500;
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(errorHtml("OAuth loopback listener failed unexpectedly. Use the manual fallback."));
    }
  });

  await new Promise<void>((resolve) => {
    server
      .listen(env.OPENAI_CHATGPT_OAUTH_LOOPBACK_PORT, env.OPENAI_CHATGPT_OAUTH_LOOPBACK_HOST, () => {
        app.log.info(
          {
            host: env.OPENAI_CHATGPT_OAUTH_LOOPBACK_HOST,
            port: env.OPENAI_CHATGPT_OAUTH_LOOPBACK_PORT
          },
          "ChatGPT OAuth loopback listener started"
        );
        resolve();
      })
      .on("error", (error) => {
        app.log.warn(
          {
            error,
            host: env.OPENAI_CHATGPT_OAUTH_LOOPBACK_HOST,
            port: env.OPENAI_CHATGPT_OAUTH_LOOPBACK_PORT
          },
          "ChatGPT OAuth loopback listener failed to bind; manual fallback remains available"
        );
        resolve();
      });
  });

  return server.listening ? server : null;
}
