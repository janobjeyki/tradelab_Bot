import "dotenv/config";

import { requiredEnv } from "../src/bot.js";

const required = ["BOT_TOKEN", "SUPPORT_CHAT_ID", "WEBHOOK_SECRET"];

try {
  for (const name of required) {
    requiredEnv(name);
  }

  console.log("Configuration looks good.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
