import { PrismaClient } from "@prisma/client";

declare global {
  var __vexusPrisma__: PrismaClient | undefined;
}

export const prisma =
  globalThis.__vexusPrisma__ ??
  new PrismaClient({
    log: ["warn", "error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__vexusPrisma__ = prisma;
}
