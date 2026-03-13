#!/usr/bin/env node

import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const tsxCli = require.resolve("tsx/cli");
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const entrypoint = path.resolve(currentDir, "../src/index.ts");

const child = spawn(process.execPath, [tsxCli, entrypoint, ...process.argv.slice(2)], {
  env: process.env,
  stdio: "inherit"
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
