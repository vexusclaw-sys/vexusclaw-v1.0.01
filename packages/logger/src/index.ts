import pino, { type Logger, type LoggerOptions } from "pino";

import { readEnv } from "@vexus/config";

export function createLogger(bindings: Record<string, unknown> = {}, options: LoggerOptions = {}): Logger {
  const env = readEnv();

  return pino({
    level: env.LOG_LEVEL,
    base: {
      app: env.VEXUS_APP_NAME,
      ...bindings
    },
    transport:
      env.NODE_ENV === "development"
        ? {
            target: "pino-pretty",
            options: {
              colorize: true
            }
          }
        : undefined,
    ...options
  });
}
