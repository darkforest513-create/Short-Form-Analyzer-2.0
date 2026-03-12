# Whop Next.js App

A beginner-friendly Whop app built with the [official Next.js template](https://github.com/whopio/whop-nextjs-app-template). Authentication is handled by the Whop SDK—when your app runs inside the Whop iframe, the SDK verifies the user token from the `x-whop-user-token` header.

---

## Quick start

### 1. Install dependencies

```bash
pnpm i
```

(If you don’t have pnpm: `npm install` or `corepack enable && pnpm i`.)

### 2. Set up environment variables

- **Copy the example env file:**  
  `cp .env.example .env.local`
- **Paste your Whop credentials** into `.env.local`. Get them from the [Whop Developer Dashboard](https://whop.com/dashboard/developer/):
  - Create or select your app
  - Open **Environment variables** / **API Keys**
  - Fill in `WHOP_API_KEY`, `NEXT_PUBLIC_WHOP_APP_ID`, and (optional) `WHOP_WEBHOOK_SECRET`

See [`.env.example`](.env.example) for a list of variables and where to find each one.

### 3. Configure paths in the Whop dashboard

In your app’s **Hosting** section, set:

- **Base URL** – e.g. `http://localhost:3000` for dev, or your production domain
- **App path** – `/experiences/[experienceId]`
- **Dashboard path** – `/dashboard/[companyId]`
- **Discover path** – `/discover`

### 4. Add your app to a Whop

In a Whop that’s in the same org as your app: **Tools** → add your app.

### 5. Run the dev server

```bash
pnpm dev
```

In the Whop preview, use the settings icon (top right) and select **localhost** (port 3000).

---

## How authentication works

- **Whop SDK** is configured in [`lib/whop-sdk.ts`](lib/whop-sdk.ts) using your env vars.
- **Protected routes** (e.g. [`app/experiences/[experienceId]/page.tsx`](app/experiences/[experienceId]/page.tsx)) call `whopsdk.verifyUserToken(await headers())` to get the current user. The iframe sends the JWT in the `x-whop-user-token` header.
- **Webhooks** (e.g. [`app/api/webhooks/route.ts`](app/api/webhooks/route.ts)) use `WHOP_WEBHOOK_SECRET` to verify requests.

To protect a new page or API route, use the same pattern:

```ts
import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";

export default async function MyPage() {
  const { userId } = await whopsdk.verifyUserToken(await headers());
  // use userId...
}
```

---

## Project structure (easy to expand)

| Path | Purpose |
|------|--------|
| `lib/whop-sdk.ts` | Whop SDK client (auth, API, webhooks). Single place to change API key / app ID. |
| `app/experiences/[experienceId]/` | App experience page (user-facing). |
| `app/dashboard/[companyId]/` | Company dashboard page. |
| `app/discover/` | Discover page. |
| `app/api/webhooks/` | Webhook handler (e.g. payments). Add more routes under `app/api/` as needed. |

Add new pages under `app/`, new API routes under `app/api/`, and keep using `whopsdk` from `@/lib/whop-sdk` for auth and Whop API calls.

---

## Deploying

1. Push your repo to GitHub.
2. In [Vercel](https://vercel.com/new), import the repo and deploy.
3. Add the same env vars as in `.env.local` in the Vercel project settings.
4. In the Whop dashboard, set **Base URL** (and webhook URLs if used) to your Vercel domain.

---

## Troubleshooting

- **App not loading in Whop?** In the dashboard, set **App path** explicitly to `/experiences/[experienceId]`. Placeholder text does not count as “set”.
- **Auth or API errors?** Confirm `.env.local` has real values from the Whop dashboard (not the placeholders from `.env.example`).

More info: [Whop developer docs](https://dev.whop.com/introduction).
