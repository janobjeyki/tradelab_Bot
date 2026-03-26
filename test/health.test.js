import test from "node:test";
import assert from "node:assert/strict";

import { GET } from "../api/health.js";

test("health handler responds with ok", async () => {
  const response = GET();
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(payload, {
    ok: true,
    service: "tradelab-support-bot",
  });
});
