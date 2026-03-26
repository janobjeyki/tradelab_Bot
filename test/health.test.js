import test from "node:test";
import assert from "node:assert/strict";

import healthHandler from "../api/health.js";

test("health handler responds with ok", async () => {
  const response = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
  };

  await healthHandler({}, response);

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.payload, {
    ok: true,
    service: "tradelab-support-bot",
  });
});
