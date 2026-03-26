import { getBot, requiredEnv } from "../src/bot.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const secret = requiredEnv("WEBHOOK_SECRET");
  const providedSecret = req.headers["x-telegram-bot-api-secret-token"];

  if (providedSecret !== secret) {
    res.status(401).json({ ok: false, error: "Invalid webhook secret" });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const bot = getBot();

  await bot.handleUpdate(body);
  res.status(200).json({ ok: true });
}
