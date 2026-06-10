# Deploying the UrbanLift web app

The app is an Expo (React Native Web) SPA. `npm run build:web` produces a static
`dist/` folder you can host anywhere. Configs for **Vercel** and **Netlify** are
included; pick one.

---

## ⚠️ Step 0 — Allow your web origin on the API (REQUIRED)

The browser blocks cross-origin API calls unless the API explicitly allows your
site's origin. Right now the backend (`app/main.py`) only allows localhost:

```python
origins = [
    "http://localhost:8081",
    "http://localhost:8000",
    "https://urban-lift-api.onrender.com/",
]
```

**After you get your deploy URL, add it here and redeploy the API on Render:**

```python
origins = [
    "http://localhost:8081",
    "http://localhost:8000",
    "https://urban-lift-api.onrender.com/",
    "https://YOUR-APP.vercel.app",     # ← your deployed web origin (no trailing slash)
]
```

Until this is done, the deployed site loads but **every login/data request fails
with a CORS error**. (Note: the API uses `allow_credentials=True`, so a wildcard
`"*"` is not allowed — it must be the exact origin.)

---

## Option A — Vercel (recommended, easiest)

`vercel.json` is already set up (build command, `dist` output, SPA rewrites).

```bash
npm i -g vercel        # once
vercel login           # your account
vercel                 # preview deploy → gives a URL
vercel --prod          # production deploy
```

Or via the dashboard: **Import Git Repo → Framework: Other →** it reads
`vercel.json` automatically. No env vars are required (the API URL is baked in).

## Option B — Netlify

`netlify.toml` is already set up (build command, `publish = dist`, SPA redirect).

```bash
npm i -g netlify-cli   # once
netlify login
netlify deploy         # preview → URL
netlify deploy --prod  # production
```

Or dashboard: **Add new site → Import from Git** → it reads `netlify.toml`.

## Option C — Any static host (Cloudflare Pages, GitHub Pages, S3…)

```bash
npm run build:web      # outputs ./dist
```

Upload `dist/`. **Important:** configure an SPA fallback so unknown paths serve
`index.html` (expo-router routes on the client). Each host does this differently
(Cloudflare Pages: add `dist/_redirects` with `/* /index.html 200`).

---

## Optional — point at a different API

The API base URL defaults to `https://urban-lift-api.onrender.com` (see
`src/config.ts`). To override at build time, set an env var before building:

```bash
EXPO_PUBLIC_API_URL=https://my-api.example npm run build:web
```

On Vercel/Netlify, add `EXPO_PUBLIC_API_URL` in the project's environment
variables and redeploy.

---

## Notes
- The **map** uses OpenStreetMap tiles via Leaflet — no API key needed.
- **Auth needs real SMS OTP** (Supabase). On a public URL, sign-in still depends
  on the Supabase phone provider / test numbers (see chat history).
- First request after idle is slow — the API runs on Render's free tier and
  cold-starts (~30–60s).
