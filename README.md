# TradeLab Support Bot

Telegram support bot built for Vercel serverless deployment.

## What it does

- Accepts support requests from Telegram users
- Forwards each text message to your support/admin chat
- Includes sender profile details in every forwarded request
- Runs as a Telegram webhook on Vercel

## Environment variables

Copy `.env.example` to `.env` and fill in:

- `BOT_TOKEN`: Telegram bot token from BotFather
- `SUPPORT_CHAT_ID`: Telegram chat ID where support requests should be sent
- `WEBHOOK_SECRET`: A long random string used to verify Telegram webhook calls
- `WEBHOOK_BASE_URL`: Your Vercel deployment URL, for example `https://tradelab-bot.vercel.app`

## Local setup

```bash
npm install
npm run check
npm run dev
```

## Deploy to Vercel

```bash
npx vercel
```

Then add the same environment variables in Vercel:

```bash
npx vercel env add BOT_TOKEN
npx vercel env add SUPPORT_CHAT_ID
npx vercel env add WEBHOOK_SECRET
npx vercel env add WEBHOOK_BASE_URL
```

After deployment, set the Telegram webhook:

```bash
npm run set:webhook
```

## Telegram setup notes

1. Create a bot with BotFather and copy the token.
2. Add your bot to the admin/support chat if you want messages delivered to a group.
3. To find the support chat ID, send a message in that chat and inspect updates with the Telegram Bot API, or use a helper bot that reveals chat IDs.
4. If the support destination is a group, the bot must be allowed to post there.
