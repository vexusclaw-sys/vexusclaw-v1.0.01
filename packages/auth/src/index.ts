import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";

import bcrypt from "bcryptjs";

import { readEnv } from "@vexus/config";
import type { WorkspaceRole } from "@vexus/shared";

const rolePriority: Record<WorkspaceRole, number> = {
  owner: 30,
  admin: 20,
  operator: 10
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function hasRole(role: WorkspaceRole, requiredRole: WorkspaceRole): boolean {
  return rolePriority[role] >= rolePriority[requiredRole];
}

export function canManageWorkspace(role: WorkspaceRole): boolean {
  return hasRole(role, "admin");
}

export function generateOpaqueToken(size = 48): string {
  return randomBytes(size).toString("base64url");
}

export function hashOpaqueToken(token: string): string {
  const env = readEnv();
  return createHmac("sha256", env.JWT_REFRESH_SECRET).update(token).digest("hex");
}

function getEncryptionKey(): Buffer {
  const env = readEnv();
  return Buffer.from(env.VEXUS_ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32), "utf8");
}

export function encryptSecret(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv.toString("base64url"), tag.toString("base64url"), encrypted.toString("base64url")].join(".");
}

export function decryptSecret(value: string): string {
  const [ivPart, tagPart, payloadPart] = value.split(".");

  if (!ivPart || !tagPart || !payloadPart) {
    throw new Error("Invalid encrypted secret payload.");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(ivPart, "base64url")
  );
  decipher.setAuthTag(Buffer.from(tagPart, "base64url"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payloadPart, "base64url")),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
}

export function createSecretHint(secret: string): string {
  const suffix = secret.slice(-4);
  return suffix ? `••••${suffix}` : "configured";
}
