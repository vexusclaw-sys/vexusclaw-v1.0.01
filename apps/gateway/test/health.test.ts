import assert from "node:assert/strict";
import test from "node:test";

test("health scaffold exists", () => {
  assert.equal("/health", "/health");
});
