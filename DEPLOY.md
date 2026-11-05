# Deploying ZEYD-HACK // ZERO TRACE

## 1. Backend (Render)
1. Generate verification hashes locally: `PEPPER=<long-random-secret> node scripts/make-hashes.mjs`
   This writes `backend/hashes.json` from `private/flags.json`.
2. `hashes.json` is gitignored. Either commit it deliberately (it only holds peppered hashes) or add it as a
   Render Secret File at `backend/hashes.json`.
3. Create a Render Web Service from `render.yaml`. Set `CLIENT_ORIGIN` (your Vercel URL), `PEPPER` (same secret), `MONGODB_URI` (Atlas).
4. Atlas: allow Render's outbound IPs (or 0.0.0.0/0 with a strong user password) and create a limited DB user.

## 2. Frontend (Vercel)
1. Import the repo, framework preset Vite. Set `VITE_API_URL=https://<your-service>.onrender.com`.
2. `vercel.json` sets security headers and a CSP. If your API is not on `*.onrender.com`, edit `connect-src`.
3. Do NOT upload the `private/` folder. It is gitignored.

## 3. Before launch
- Fill real contact links in `src/config/site.js`; project links/screenshots in `src/data/operations.js`.
- Add real internships/certifications/experience to `src/data/intelligence.js` only if true.
- Test: solve all 7 challenges against the deployed API, send a contact message, load `/#direct`.
