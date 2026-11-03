import test from "node:test";
import assert from "node:assert/strict";
import { Utils } from "./utils";

test("generateToken returns a valid JWT and verifies payload", () => {
  const token = Utils.generateToken({ id: "123", email: "test@example.com" });

  assert.ok(token, "token should be created");
  assert.match(token, /^eyJ/);

  const payload = Utils.verifyToken(token);
  assert.equal(payload.id, "123");
  assert.equal(payload.email, "test@example.com");
});
