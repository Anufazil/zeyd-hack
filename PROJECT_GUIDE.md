# ZEYD-HACK // ZERO TRACE: Project Guide

A plain-language guide to what this project is, how it is built, and where everything lives.
Naming: the website/project is **ZEYD-HACK** (`SITE.name`); the hacker alias, hidden words and flags stay **ZEYDAC**.
Companion files: `README.md` (quick start), `DEPLOY.md` (deployment steps).

---

## 1. What this project is

**ZEYD-HACK // ZERO TRACE** is an interactive cybersecurity portfolio for **Anufazil** (hacker alias *ZEYDAC*).
It is deliberately not a normal portfolio. Visitors land in a simulated, classified "secure archive" and must
**investigate** to discover who is behind the alias: exploring directories in a working terminal, reading evidence,
decoding messages and solving seven capture-the-flag (CTF) challenges.

> Tagline: *"Every system leaves a trace. Find mine."*

It serves two audiences:

| Audience | Experience |
|---|---|
| Curious visitors | **Investigator Mode**: boot sequence, console, terminal, CTF, final identity reveal |
| Recruiters / professionals | **Direct Access**: a clean, fast page with About, Skills, Projects, Education and Contact. It is earned by finding 10 hidden ZEYDAC words in the start-screen data wall |

Both modes share the same visual identity (dark terminal look, green-on-black, monospace type).

The site is a **simulation**. Nothing attacks or scans real systems. All logs, network data and addresses are fictional
(they use documentation-reserved IP ranges).

---

## 2. User journey

```
 Page load
    |
    +-- first visit ---> BOOT SEQUENCE (skippable; skipped automatically on later visits)
    |
    v
 ACCESS SCREEN  (classified card floating over a dense wall of hacker data; new wall every refresh)
    |
    +-- [ INITIATE INVESTIGATION ] ---> CONSOLE (Investigator Mode)
    |        explorer + workspace + terminal + progress bar
    |        solve CTF 1..7 --> FINAL REVEAL --> full dossier unlocked
    |
    +-- find the 10 hidden ZEYDAC words in the data wall (click each)
             |
             v
        DIRECT ACCESS  (/#direct)  --> About / Skills / Projects / Education / Contact
```

**Direct Access gate.** The start screen background is a dense, typographic "wall" of hacker-flavoured data in the green theme:
security terms, shell commands, log lines, hashes, hex dumps, binary, documentation-range IP addresses, CVE names, quotes, status
codes, big outlined and inverted headline words. Ten of the fragments are the word **ZEYDAC**, styled exactly like their neighbours.
The visitor clicks each one they find. After the first find a counter shows `TRACES FOUND n/10`; found words light up as green
blocks. When all ten are found the screen shows ACCESS GRANTED and opens Direct Access. A new random wall is generated on every
page refresh (different text, sizes, layout and hidden positions). Success is remembered in `localStorage`, so returning visitors
go straight in. Loading `/#direct` while locked sends you back to the start screen.

---

## 3. Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, JavaScript, Tailwind CSS 3, Framer Motion, Lucide React |
| Backend | Node.js, Express, Mongoose (MongoDB Atlas), helmet, cors, express-rate-limit |
| Hosting plan | Frontend on Vercel, backend on Render, database on MongoDB Atlas |
| Persistence (MVP) | Browser `localStorage` for progress; backend only needed for server-side flag checks and contact messages |
| Windows note | `package.json` overrides Rollup and esbuild with WebAssembly builds so Windows Application Control cannot block native binaries |

Design tokens (in `tailwind.config.js`): background `#050807`, panel `#0A100D`, terminal green `#00FF88`, muted green
`#497D62`, readable sage text `#6FA98A`, primary text `#DCE5DF`, secondary text `#82948A`, warning `#FFB000`, danger
`#FF4444`, borders `#193126`. Fonts: JetBrains Mono (technical text) and Inter (readable text).

---

## 4. Folder structure

```
zeyd-hack/
├── index.html                  App shell: meta tags, favicon, <noscript> fallback, font links
├── package.json                Scripts, dependencies, WASM overrides for rollup/esbuild
├── vite.config.js              React plugin + manual chunks (react / motion / icons)
├── tailwind.config.js          Colors and fonts
├── postcss.config.js
├── vercel.json                 SPA rewrites + security headers + CSP
├── render.yaml                 Render service definition for the backend
├── .env.example                VITE_API_URL
├── .gitignore                  Ignores node_modules, dist, private/, backend/hashes.json, .env
├── README.md / DEPLOY.md / PROJECT_GUIDE.md
│
├── public/                     favicon.svg, robots.txt
│
├── scripts/
│   └── make-hashes.mjs         Builds backend/hashes.json (peppered SHA-256) from private/flags.json
│
├── private/                    YOUR secrets: challenge solutions. Gitignored. Never deploy.
│
├── backend/
│   ├── server.js               Express API (verify flag, contact, health)
│   ├── package.json
│   └── .env.example            PORT, CLIENT_ORIGIN, PEPPER, MONGODB_URI
│
└── src/
    ├── main.jsx                React entry
    ├── App.jsx                 Screen router (boot / access / console / direct) + global state
    ├── index.css               Tailwind layers, scanlines, cursor blink, glitch, data-wall styles
    │
    ├── config/
    │   └── site.js             Website name (`ZEYD-HACK`), alias (`ZEYDAC`), tagline, boot lines, contact links, storage key
    │
    ├── data/                   All content is data-driven: edit here, not in components
    │   ├── filesystem.js       Virtual file system the terminal and explorer share
    │   ├── identity.js         Dossier fields + the progress thresholds that unlock them
    │   ├── arsenal.js          Skills grouped by category (no invented proficiency)
    │   ├── operations.js       The six project case files
    │   ├── intelligence.js     Education / training / achievements reports
    │   ├── challenges.js       The seven CTF challenges (titles, text, hints, unlock chain)
    │   ├── challengeData.js    Deterministic simulated datasets: SSH logs, packets, file metadata, passwords
    │   └── generated.js        Salted flag hashes + encoded puzzle material (no plaintext flags)
    │
    ├── lib/
    │   ├── collage.js          Data-wall layout engine (pure functions): content pools, row packing, hidden-word placement
    │   ├── terminal.js         Command engine: execute(), complete(), resolveDir(), listNames()
    │   ├── storage.js          DEFAULT_STATE, load/save to localStorage, progressOf()
    │   ├── flags.js            verifyFlag(): local hash check or server check
    │   ├── api.js              validateContact(), submitContact()
    │   └── useFocusTrap.js     Focus trap + Escape handling for the drawer and reveal overlay
    │
    └── components/
        ├── BootSequence.jsx        Typed boot lines with skip button
        ├── AccessScreen.jsx        Start screen: the card, the hint/counter slot, the unlock
        ├── DataWall.jsx            Renders the data wall + the 10 hidden ZEYDAC buttons
        ├── Console.jsx             Main investigator layout; owns cwd, view, terminal lines
        ├── StatusBar.jsx           Top bar: title, progress bar, current path, direct access button
        ├── Explorer.jsx            Left directory tree (a drawer on mobile)
        ├── Workspace.jsx           Main pane; renders whichever "view" is active (lazy-loaded panels)
        ├── Terminal.jsx            Terminal UI: log, input, history, tab completion, mobile quick chips
        ├── RevealOverlay.jsx       Cinematic final reveal
        ├── Decrypt.jsx             Scramble-to-reveal text effect
        ├── DirectAccess.jsx        Recruiter page: About, Skills, Projects, Education, Contact
        ├── panels/
        │   ├── IdentityPanel.jsx       Progressive dossier
        │   ├── ArsenalPanel.jsx        Skill modules
        │   ├── OperationsPanel.jsx     Project list + detail ("case file")
        │   ├── IntelligencePanel.jsx   Report list + animated document viewer
        │   └── ContactPanel.jsx        Validated contact form + links
        └── challenges/
            ├── ChallengesPanel.jsx     Challenge list + detail (flag input, hints, feedback)
            └── widgets.jsx             The interactive tool for each challenge (C1..C7)
```

---

## 5. How it works

### 5.1 Screen routing and global state (`App.jsx`)

`App` shows exactly one of four screens: `boot`, `access`, `console`, `direct`. It owns the persistent `state` object
(saved to `localStorage` on every change) and passes it down.

The URL hash `#direct` marks the Direct Access route. It is never used for in-page anchors; the Direct Access navbar
scrolls with JavaScript so the hash stays `#direct`. If `#direct` is requested while locked, the hash is cleared and the
visitor stays on the start screen.

**State shape** (key `zeyd-hack.v1`):

| Field | Meaning |
|---|---|
| `bootSeen` | Boot animation already shown (skip next time) |
| `visited[]` | Directories visited |
| `recon`, `scanned`, `traceRead` | Terminal discoveries: ran `recon`, ran `scan`, read the hidden `.trace` file |
| `opened[]` | Ids of opened items: `op:*` operations, `rpt:*` reports, `mod:*` skill categories |
| `solved[]` | Solved challenge ids `c1`..`c7` |
| `hintsUsed{}` | Hints revealed per challenge |
| `revealed` | Final reveal already played |
| `directUnlocked` | Direct Access earned |
| `hintIdx`, `history[]` | Terminal `hint` position; command history (last 100) |

### 5.2 Investigation progress

`progressOf(state)` in `lib/storage.js` returns a 0 to 100 percentage out of **23 steps**:

`7 directories visited + recon + scan + hidden trace + up to 3 operations + up to 2 reports + 1 skill module + up to 7 challenges`

It drives the status-bar progress bar and unlocks dossier fields.

### 5.3 The virtual file system (`data/filesystem.js`)

The top level `/` contains seven directories: `/root`, `/identity`, `/arsenal`, `/operations`, `/intelligence`,
`/challenges`, `/contact`. Each directory has `files` (and `/root` has a `hidden` file revealed by `recon`).

A file value can be:

- a **string** (plain text), or
- a **function** `(state) => string` (dynamic text, e.g. the dossier), or
- an **object** `{ text, view, open, lockedBy }`:
  - `view`: which workspace view to open when the file is read,
  - `open`: an id that counts toward progress,
  - `lockedBy`: challenge ids that must be solved first.

Content files are generated from the `data/` modules, so adding an operation or a report automatically creates its file.
`isPanelDir()` lists directories that open a rich panel (`/identity`, `/arsenal`, `/operations`, `/intelligence`,
`/contact`, `/challenges`); `/root` shows a simple file list.

### 5.4 The terminal engine (`lib/terminal.js`)

The terminal is real: every command changes state or the view. The core is a pure function:

```js
execute(rawInput, { cwd, state }) -> { lines, patch, cwd, view, clear, exit }
```

- `lines`: output lines (`out`, `ok`, `warn`, `err`) to print,
- `patch`: changes to merge into persistent state,
- `cwd` / `view`: new directory and workspace view,
- `clear` / `exit`: clear the screen / return to the start screen.

`Console.jsx` calls it and applies the result. The explorer and workspace buttons call the *same* function (by running
`cd ...` or `cat ...`), so mouse and terminal always agree.

| Command | What it does |
|---|---|
| `help` | List commands |
| `whoami` | Denied until the final investigation is solved, then prints the identity |
| `ls [-a]` | List the directory (hidden files appear after `recon`) |
| `pwd`, `cd <dir>`, `cat <file>` | Navigate and read; locked challenge files are refused |
| `scan` | Simulated port sweep (no real network traffic) |
| `recon` | Reveals the hidden `/root/.trace` file |
| `decode <base64\|hex\|rot13> <text>` | Working decoder, useful in challenges |
| `hint` | Next general hint |
| `status`, `progress`, `history` | System state, investigation progress, command history |
| `matrix` | Falling-glyph animation (visual extra) |
| `clear`, `exit` | Clear terminal; return to the start screen |

`complete()` powers **Tab completion** for commands, directories, file names and decode types. `Terminal.jsx` adds
**arrow-key history** and, on small screens, tappable quick-command chips.

### 5.5 Workspace views (`Workspace.jsx`)

The main pane renders whichever `view` the engine returns: `home`, `dir`, `file`, `panel` (by path), `operation`,
`document`, `challenge`, `matrix`. Heavy panels are **lazy-loaded** (code-split) and shown inside `Suspense`.

### 5.6 Content panels

- **Identity**: six dossier fields; each unlocks at a progress threshold (Alias 0%, Location 25%, Education 45%,
  Specialization 65%, Current Mission 85%) with a decrypt animation. The **Name** unlocks only when challenge 7 is solved;
  solving it opens *every* field.
- **Arsenal**: skills in five categories (Programming, Frontend, Backend, Databases, Cybersecurity). Each module shows a
  description, practical application and proficiency. **No proficiency ratings are invented**; the field reads "not yet
  verified" until you supply a real one.
- **Operations**: six case files (Password Security Analyzer, Cybrews, Cardora, BarberQueue, Expenso, TextoQuest), each
  with overview, problem, architecture, technologies, features, challenges, screenshots and links. Anything not yet
  supplied shows an amber placeholder.
- **Intelligence**: education, training and technical achievements are filled in. Internships, certifications and
  experience read "NO RECORD SUPPLIED". Reports open in an animated document viewer.
- **Contact**: validated form (name, email, subject, message) plus email, GitHub and LinkedIn links. Inputs are sanitised.
  If the backend is not connected, the form says so honestly instead of pretending to send.

### 5.7 The CTF engine

Seven challenges, each with a title, description, difficulty, instructions, an interactive tool, three progressive hints,
flag verification, success/failure feedback and progress tracking. Each unlocks after the previous one (challenge 7 needs
1 to 6). Flags use the format `ZEYD{...}`.

| # | Title | Difficulty | Skill practised |
|---|---|---|---|
| 1 | Encoded Identity | Easy | Recognising and decoding Base64 |
| 2 | Source Hunt | Easy | Reading hidden HTML: a comment and a data attribute (in-app source viewer for touch devices) |
| 3 | Digital Footprint | Medium | File metadata analysis and spotting the odd tool |
| 4 | Password Puzzle | Medium | Checking candidates against a password policy |
| 5 | Log Analysis | Medium | Finding brute-force-then-success in simulated SSH logs |
| 6 | Network Investigation | Hard | Spotting beaconing and exfiltration in simulated traffic |
| 7 | Final Investigation | Hard | Combining evidence fragments from challenges 1 to 6 |

**Flag verification** (`lib/flags.js`):

- *Local MVP mode* (no `VITE_API_URL`): the input is hashed in the browser with SHA-256 and compared against a stored hash.
  Plaintext flags are never in the frontend source, only salted hashes in `data/generated.js`.
- *Server mode* (`VITE_API_URL` set): the flag is sent to `POST /api/verify`, which compares a **peppered** hash using a
  constant-time comparison. This is the recommended production setup.

**Evidence fragments.** Each solved challenge 1 to 6 reveals a short fragment with a position number, stored lightly
encoded in `data/generated.js`. Challenge 7's evidence board assembles them.

**Final reveal** (`RevealOverlay.jsx`): after challenge 7, a cinematic sequence prints *INVESTIGATION COMPLETE, ALL EVIDENCE
VERIFIED, SUBJECT IDENTIFIED*, shows the alias, identity and classification, then offers three buttons: view the complete
dossier, explore operations, establish contact. It plays once and can be replayed from the challenge list.

### 5.8 Start screen: the data wall

- `lib/collage.js` is the layout engine (pure functions, no DOM). It builds a wall from a random seed: it plans rows of random
  heights (mostly small data rows, some medium rows, a few large headline rows), then fills each row left to right with
  fragments drawn from content pools (terms, commands, log lines, generated hashes, hex dumps, binary, IPs from documentation
  ranges, CVE names, quotes, status words) and justifies the row. Styles vary: plain, bold, inverted blocks, outlined text,
  amber and red accents, a few flickering fragments.
- The 10 **ZEYDAC** words are placed during layout, spread over the screen, and always **outside the centre card** and inside
  the viewport. On small screens the card leaves little room, so a row may hold two hidden words (spaced apart).
  The decorative text is filtered so it can never contain challenge answers or the word ZEYDAC.
- `DataWall.jsx` measures text with a canvas, asks the engine for a layout around the card's measured rectangle, and renders it.
  The decorative layer is `aria-hidden` and rendered once (finding a trace does not re-render it). The 10 ZEYDAC words are real
  buttons in a separate layer, each with an enlarged invisible hit area, keyboard-focusable (Tab, then Enter). A slow scan-sweep
  runs over the wall; both it and the flicker stop under `prefers-reduced-motion`.
- The wall relays out on real window-size changes (width change, or height change over 100 px) and ignores small mobile
  address-bar jitter, so words do not jump while someone is hunting.
- The card has a fixed-height hint/counter slot so it never changes size (the wall is laid out around it).

### 5.9 Direct Access (`DirectAccess.jsx`)

A single scrolling page with a sticky nav (About, Skills, Projects, Education, Contact), a section highlight that follows
scrolling, a skip link, and a "Investigator mode" button back. Missing links and screenshots are hidden rather than shown as
placeholders. Education and training show real records; internships, certifications and experience are summarised as "not
listed yet".

### 5.10 Backend (`backend/server.js`)

| Endpoint | Purpose | Protection |
|---|---|---|
| `GET /api/health` | Health check for Render | none needed |
| `POST /api/verify` | Check a challenge flag | 20 requests/min per client, constant-time compare, body limit 8 KB |
| `POST /api/contact` | Store a contact message in MongoDB | 5 requests/hour per client, input validation and sanitising, returns 503 if the database is not connected |

Also: `helmet` security headers, CORS restricted to `CLIENT_ORIGIN`, JSON body limit, a generic error handler that never
leaks details. Configuration comes from environment variables (`PORT`, `CLIENT_ORIGIN`, `PEPPER`, `MONGODB_URI`).
`scripts/make-hashes.mjs` turns `private/flags.json` into `backend/hashes.json` using your `PEPPER`.

---

## 6. Security, accessibility and performance

**Security**
- Challenge flags are never stored in plaintext in frontend code; use server verification in production.
- Contact input is trimmed, length-capped, stripped of control characters and angle brackets, and validated on both client
  and server. The form makes no false encryption claims.
- `vercel.json` sets a Content Security Policy, `nosniff`, a referrer policy, a permissions policy and HSTS.
- `private/`, `.env` and `backend/hashes.json` are gitignored.
- No real vulnerabilities are introduced for the theme.

**Accessibility**
- Landmarks (`main`, `nav`, `header`), one `h1` per screen, skip links, visible focus rings.
- Focus is trapped in the mobile drawer and the reveal overlay; Escape closes them and focus returns to the trigger.
- A screen-reader status message announces workspace changes; scrollable regions are keyboard-focusable.
- `prefers-reduced-motion` stops the roaming, twinkling and other animation.
- The hidden ZEYDAC words are real buttons: reachable with Tab and activated with Enter. They are camouflaged on purpose, so they are excluded from contrast checks; the decorative wall is hidden from screen readers.

**Performance**
- Console, Direct Access and each panel are lazy-loaded; React, Framer Motion and icons are split into their own chunks.
- Animations pause when the tab is hidden. No heavy dependencies were added.

---

## 7. How to run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build in dist/
```

Backend (optional locally):

```bash
cd backend
cp .env.example .env                      # fill PEPPER, CLIENT_ORIGIN, MONGODB_URI
cd .. && PEPPER=<same secret> node scripts/make-hashes.mjs
cd backend && npm install && npm start
```

Then set `VITE_API_URL=http://localhost:8080` in a root `.env` file and restart the frontend. See `DEPLOY.md` for Vercel and
Render. If Windows blocks a native file during `npm install` or `npm run dev`, see the note in `README.md`.

---

## 8. What you still need to fill in

| Item | Where |
|---|---|
| Check your LinkedIn URL (profile links normally look like `linkedin.com/in/<handle>`) | `src/config/site.js` (`contact`) |
| Project links, screenshots, problem statements, feature lists and development notes for Operations 002 to 006 (and links for 001) | `src/data/operations.js` |
| Any internships, certifications or professional experience that are true | `src/data/intelligence.js` |
| Proficiency statements, only if verifiable | `src/data/arsenal.js` (`level`) |
| Backend secrets and database | Render environment variables; `PEPPER`, `MONGODB_URI`, `CLIENT_ORIGIN` |
| API host in the CSP, if not `*.onrender.com` | `vercel.json` (`connect-src`) |

---

## 9. How to extend it

- **Add a project**: add an object to `src/data/operations.js`. The case file, terminal file and Direct Access card appear
  automatically.
- **Add a skill**: add it to a category in `src/data/arsenal.js`.
- **Add a report**: add to `src/data/intelligence.js`.
- **Add a terminal command**: add the name to `COMMANDS` and a `case` in `execute()` in `src/lib/terminal.js`.
- **Add or change a challenge**: edit `src/data/challenges.js`, add its tool to `widgets.jsx`, update `private/flags.json`,
  regenerate the hashes in `data/generated.js` (local mode) and with `scripts/make-hashes.mjs` (server mode). If you change a
  flag, also change the encoded puzzle material that produces it.
- **Change the wall**: edit the content pools (`TERMS`, `CMDS`, `QUOTES`, ...), colours (`COLORS`) and row sizes (`planRows`) in
  `src/lib/collage.js`; change how many hidden words with `HIDDEN_COUNT` (the text on the card follows it).

---

## 10. Testing status (honest summary)

During development the production build was tested in headless Chromium (served with the real `vercel.json` headers) and an
automated accessibility audit (axe-core, WCAG 2 A/AA). Together those checks covered: boot and access screens; the terminal;
all seven challenges solved through the UI, including wrong and malformed flags and hints; locked challenges; the final
reveal and dossier unlock; state persistence across reload; contact validation; Direct Access and its navigation; the
data wall and its ten hidden words (a new wall on every refresh, none under the card or covered, enough room on seven screen sizes from 360 px phones to 1920 px desktops, tap and keyboard collection, unlock and persistence); reduced motion; the
mobile drawer and quick chips; and horizontal overflow. The backend verify endpoint, input validation and rate limiting
were tested locally with `curl`.

**Not verified:** how hard the hunt feels to real people (the words blend in on purpose; tune the styling if testers struggle); real phones or tablets (only emulated viewports); the deployed Vercel and Render setup; the backend against
a live MongoDB Atlas database; running on Windows; web fonts (the test sandbox could not download them, so fallback fonts
were used). The test scripts were ad hoc and are not included in this project.

**Known limitations by design**
- Direct Access and the dossier lock are experience gates stored in `localStorage`, not security boundaries. Anyone can read
  the public data or edit browser storage.
- In local mode, flag hashes are in the browser and could be brute-forced offline; use server verification for production.
- The contact form cannot send messages until the backend is deployed and `VITE_API_URL` is set.
