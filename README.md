# Hariharan Selvam: portfolio

React + Vite + Three.js website with a small Node contact API.

- **Website** (`src/`): hero with scroll-scrubbed photo, a shared 3D keyboard for the tech stack, a pinned project reel, services, FAQ and a contact form.
- **Contact API** (`server/`): one endpoint, `POST /api/contact`. It saves the message in MongoDB Atlas and emails it to the owner.

## Run locally

```bash
npm install
cp server/.env.example server/.env   # fill in Atlas + email settings
npm run dev:all                      # website on :5173, API on :8787
```

Details for Atlas and email: [`server/README.md`](server/README.md).
Content (name, projects, services, FAQ) lives in `src/data/content.ts`; keyboard keys in `src/data/techKeys.ts`.

## Deploy

The website goes on **Vercel**, the API on **Render**. Both build from the repository root.

### 1. API on Render

Render can read [`render.yaml`](render.yaml) (New + > Blueprint), or create a Web Service by hand:

| Setting | Value |
|---|---|
| Root Directory | blank |
| Build Command | `npm ci --omit=dev` |
| Start Command | `node server/index.mjs` |
| Health Check Path | `/api/health` |

Environment variables: `NODE_ENV=production`, `TRUST_PROXY=1`, `MONGODB_URI`, `MONGODB_DB=portfolio`,
`RESEND_API_KEY`, `MAIL_TO`, and `ALLOWED_ORIGIN` (your Vercel URL, no trailing slash).

Render's free plan blocks SMTP ports, so email goes through the Resend HTTPS API.
Free services also sleep when idle: the site pings `/api/health` on load to wake the API early.

Check it: `https://<your-api>.onrender.com/api/health` should show `"db":"connected"` and `"mail":"resend"`.

### 2. Website on Vercel

| Setting | Value |
|---|---|
| Root Directory | blank |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Environment variable: `VITE_API_URL=https://<your-api>.onrender.com` (no trailing slash).
It is read at build time, so redeploy after changing it.

Finally set `ALLOWED_ORIGIN` on Render to the Vercel URL.
Never commit `server/.env`; it is git-ignored.
