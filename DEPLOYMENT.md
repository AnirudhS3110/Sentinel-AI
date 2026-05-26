# Deploying SentinelAI (Vercel + Railway)

## Problem: "Failed to fetch" on production

The Vercel app calls the Railway API directly. If Railway returns **"Application failed to respond"**, the UI shows "Could not load data" — fix the API service first, then env vars.

## Railway (API)

1. **Service root**: repository root (monorepo), not `apps/api` alone.
2. **Build** (or use root `railway.toml`):
   ```bash
   npm ci && npm run build --workspace=@sentinel/shared && npm run build --workspace=api
   ```
3. **Start**:
   ```bash
   npm run start:prod --workspace=api
   ```
4. **Required env vars** (Railway → Variables):
   - `DATABASE_URL` — PostgreSQL connection string
   - `REDIS_URL` — Redis connection string
   - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
   - `CORS_ORIGIN` — `https://sentinel-ai-v1.vercel.app`
   - Do **not** set `PORT` manually; Railway injects it.
5. **Health check**: path `/health` (returns `{ "ok": true }`).
6. **Public URL**: use `https://sentinalai-apiservice.up.railway.app` — **no `:3001`** in browser URLs.

Check deploy logs if the service crashes (missing `DATABASE_URL` / `REDIS_URL` is the usual cause).

## Vercel (Web)

Project settings → Environment Variables (Production):

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_WEB_URL` | `https://sentinel-ai-v1.vercel.app` |
| `NEXT_PUBLIC_API_URL` | `https://sentinalai-apiservice.up.railway.app` |
| `NEXT_PUBLIC_WS_URL` | `https://sentinalai-apiservice.up.railway.app` |
| `NEXT_PUBLIC_FIREBASE_*` | Same Firebase web app as local |

Redeploy after changing env vars.

## Verify

```bash
curl https://sentinalai-apiservice.up.railway.app/health
# → {"ok":true}
```

Then open [Command Center](https://sentinel-ai-v1.vercel.app/dashboard).
