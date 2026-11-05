# ZEYD-HACK // ZERO TRACE

    npm install
    npm run dev

Stage 1: boot sequence, access screen, console layout, working terminal.
Config lives in `src/config/site.js`; the virtual file system in `src/data/filesystem.js`;
command logic in `src/lib/terminal.js`. Progress is stored in localStorage.

Stage 2 adds: identity dossier (progress-gated), arsenal, six operation case files,
intelligence archive and contact form. Edit content in `src/data/*.js` and `src/config/site.js`.
Set `VITE_API_URL` once the backend exists; until then the contact form reports the backend as not connected.

Stage 3 adds the CTF engine (7 challenges), hashed flag verification, progression, the final reveal
and `backend/` (Express: /api/verify, /api/contact, rate limited).
- `private/` holds the solutions. It is gitignored: never commit or deploy it.
- Local mode verifies salted hashes in the browser. For production set `VITE_API_URL`, then run
  `PEPPER=<secret> node scripts/make-hashes.mjs` and start the backend (see `backend/.env.example`).

Stage 4 adds Direct Access mode (`/#direct`), mobile quick-command chips and drawer focus handling,
accessibility fixes (landmarks, skip links, focus traps, keyboard-scrollable regions), code-splitting,
and deployment config (`vercel.json`, `render.yaml`, `DEPLOY.md`).

Direct Access is earned on the start screen: the background is a data wall with 10 hidden ZEYDAC words; find and click
them all. A new wall is generated on every refresh. The unlock is remembered in localStorage.

## Windows "Application Control policy has blocked this file"
Smart App Control / AppLocker / WDAC can refuse to load unsigned native binaries (Rollup's `.node`, esbuild's `.exe`).
`package.json` therefore swaps both for their WebAssembly builds via `overrides` (slightly slower, no native code).
After pulling this change: delete `node_modules` and `package-lock.json`, then run `npm install`.
On an unrestricted machine you may delete the `overrides` block to use the faster native builds.
