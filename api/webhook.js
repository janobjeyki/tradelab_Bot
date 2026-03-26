import { getBot, requiredEnv } from "../src/bot.js";

export async function POST(request) {
  const secret = requiredEnv("WEBHOOK_SECRET");
  const providedSecret = request.headers.get("x-telegram-bot-api-secret-token");

  if (providedSecret !== secret) {
    return Response.json({ ok: false, error: "Invalid webhook secret" }, { status: 401 });
  }

  const body = await request.json();
  const bot = getBot();

  await bot.handleUpdate(body);
  return Response.json({ ok: true });
}

export function GET() {
  return Response.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}
