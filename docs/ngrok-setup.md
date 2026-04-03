# Ngrok Setup for Local Webhook Testing

## Prerequisites

1. Install ngrok: https://ngrok.com/download
2. Sign up for a free ngrok account and get your auth token
3. Authenticate: `ngrok config add-authtoken YOUR_TOKEN`

## Setup Steps

### 1. Start the Next.js dev server

```bash
cd c:\BobaMatcha
npm run dev
```

This starts the server on `http://localhost:3000`.

### 2. Start ngrok tunnel

In a new terminal:

```bash
ngrok http 3000
```

You'll see output like:

```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
```

Copy the `https://` forwarding URL.

### 3. Configure Meta WhatsApp Webhook

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Navigate to your WhatsApp app → **Configuration** → **Webhook**
3. Set the **Callback URL** to:
   ```
   https://abc123.ngrok-free.app/api/webhook
   ```
4. Set the **Verify Token** to the same value as `WHATSAPP_VERIFY_TOKEN` in your `.env.local`
5. Click **Verify and Save**
6. Under **Webhook Fields**, subscribe to `messages`

### 4. Test the webhook

Send a WhatsApp message to your test phone number. You should see the onboarding flow start in the terminal logs.

## Important Notes

- The ngrok URL changes every time you restart ngrok (unless on a paid plan)
- Update the Meta webhook URL each time the ngrok URL changes
- Keep both the Next.js server and ngrok running during testing
- Check the ngrok web interface at `http://localhost:4040` for request inspection

## Terminal Commands Summary

```powershell
# Terminal 1 — Next.js
cd c:\BobaMatcha
npm run dev

# Terminal 2 — Ngrok
ngrok http 3000

# Terminal 3 — Seed the database
cd c:\BobaMatcha
npx tsx scripts/seed.ts
```
