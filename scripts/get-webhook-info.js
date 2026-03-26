import "dotenv/config";

import { requiredEnv } from "../src/bot.js";

async function main() {
  const token = requiredEnv("BOT_TOKEN");
  const response = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(`Failed to get webhook info: ${JSON.stringify(data)}`);
  }

  console.log(JSON.stringify(data.result, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
