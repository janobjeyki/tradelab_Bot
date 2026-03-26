import { Bot, GrammyError, HttpError, Keyboard } from "grammy";

let botInstance;
let botInitPromise;

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatUser(user) {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
  const username = user.username ? `@${user.username}` : "not set";

  return [
    `<b>Name:</b> ${escapeHtml(fullName || "Unknown")}`,
    `<b>Username:</b> ${escapeHtml(username)}`,
    `<b>User ID:</b> <code>${user.id}</code>`,
    `<b>Language:</b> ${escapeHtml(user.language_code || "unknown")}`,
  ].join("\n");
}

function formatSupportMessage(ctx) {
  const text = ctx.message?.text || describeNonTextMessage(ctx.message);
  return [
    "<b>New support request</b>",
    "",
    formatUser(ctx.from),
    "",
    "<b>Message:</b>",
    escapeHtml(text),
  ].join("\n");
}

function describeNonTextMessage(message) {
  if (message?.photo) {
    return `Photo${message.caption ? `: ${message.caption}` : ""}`;
  }

  if (message?.document) {
    return `Document: ${message.document.file_name || "file"}`;
  }

  if (message?.video) {
    return `Video${message.caption ? `: ${message.caption}` : ""}`;
  }

  if (message?.voice) {
    return "Voice message";
  }

  return "Unsupported message type";
}

function mainKeyboard() {
  return new Keyboard()
    .text("Contact support")
    .text("How it works")
    .resized();
}

function registerHandlers(bot) {
  bot.command("start", async (ctx) => {
    await ctx.reply(
      "Hi, I am TradeLab bot, created by Janob Jeyki. You can send me a bug report or impovement",
      { reply_markup: mainKeyboard() },
    );
  });

  bot.command("help", async (ctx) => {
    await ctx.reply(
      "Send your question, issue, or feedback in a single message. The support team will receive it together with your Telegram profile details.",
      { reply_markup: mainKeyboard() },
    );
  });

  bot.hears("How it works", async (ctx) => {
    await ctx.reply(
      "Write your issue in one message. Include screenshots, order details, or steps to reproduce if needed.",
    );
  });

  bot.hears("Contact support", async (ctx) => {
    await ctx.reply("Please send your support message and I will forward it to the team.");
  });

  bot.on("message", async (ctx) => {
    const text = ctx.message?.text?.trim();
    if (text && (text.startsWith("/") || text === "Contact support" || text === "How it works")) {
      return;
    }

    const supportChatId = requiredEnv("SUPPORT_CHAT_ID");

    await ctx.api.sendMessage(supportChatId, formatSupportMessage(ctx), {
      parse_mode: "HTML",
    });
    await ctx.api.forwardMessage(supportChatId, ctx.chat.id, ctx.msg.message_id);

    await ctx.reply(
      "Your message has been received. Thank you !",
      { reply_markup: mainKeyboard() },
    );
  });

  bot.catch((error) => {
    const { ctx } = error;
    console.error("Bot error while handling update", {
      updateId: ctx?.update?.update_id,
      error,
    });

    if (error.error instanceof GrammyError) {
      console.error("Telegram API error", error.error.description);
      return;
    }

    if (error.error instanceof HttpError) {
      console.error("Network error", error.error);
      return;
    }

    console.error("Unknown error", error.error);
  });
}

function getBot() {
  if (botInstance) {
    return botInstance;
  }

  const token = requiredEnv("BOT_TOKEN");
  const bot = new Bot(token);
  registerHandlers(bot);
  botInstance = bot;
  return bot;
}

async function getInitializedBot() {
  const bot = getBot();

  if (!botInitPromise) {
    botInitPromise = bot.init();
  }

  await botInitPromise;
  return bot;
}

export {
  getBot,
  getInitializedBot,
  requiredEnv,
};
