import "dotenv/config";

import { requiredEnv } from "../src/bot.js";

async function main() {
  const token = requiredEnv("BOT_TOKEN");
  const secret = requiredEnv("WEBHOOK_SECRET");
  const baseUrl = requiredEnv("WEBHOOK_BASE_URL").replace(/\/$/, "");
  const webhookUrl = `${baseUrl}/api/webhook`;

  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secret,
      allowed_updates: ["message"],
      drop_pending_updates: false,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(`Failed to set webhook: ${JSON.stringify(data)}`);
  }

  console.log(`Webhook configured for ${webhookUrl}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
