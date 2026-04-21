# Build Spec: Magic Circle v0

*This document is for executing the build. It assumes PRD.md (what and why) and design-decisions.md (resolved visual choices) have been read. It does not restate rationale — when a decision feels arbitrary, look it up in the PRD. This spec is tuned for Claude Code as the coding agent and Daniel as the non-engineer supervising.*

*Scope: v0 only. Post-launch changes go through a different process.*

---

## How to Use This With Claude Code

### The first prompt

When starting a fresh Claude Code session in the project repo, open with something close to this:

> I'm building a forum called **Magic Circle**. The core reference docs are in this repo:
> - `PRD.md` — what v0 is and why
> - `build-spec.md` — how to build it (this document)
> - `design-decisions.md` — resolved visual and typographic decisions
> - `reference/magic-circle-mobile-test.html` — working prototype. Canonical source for the visual system and the empty-state animation.
>
> Read all four files. Then:
> 1. Give me a 2–3 sentence summary of what v0 is.
> 2. Tell me which milestone you're about to start with, and what the acceptance criteria for that milestone are.
> 3. List any ambiguities or clarifications you need from me before writing code.
>
> Do not write any code yet.

This is a deliberate slow start. It forces the agent to build a mental model before touching files. If the summary is wrong, catch it here before the wrongness gets coded into the project.

### The milestone pattern

After that first exchange:

> Execute Milestone 1 only. When you're done, stop and tell me what you built. Do not start Milestone 2 until I confirm.

Repeat for each milestone. Five milestones total. You should expect to verify each one — at minimum running the app locally and clicking through it, and eyeballing the code briefly — before moving on.

### When things go sideways

Patterns that tend to work:

- **Agent is doing the wrong thing:** interrupt, say "stop, reset. Re-read [specific section]. Tell me what the correct behavior is before writing more code."
- **Error message you can't parse:** paste the full error into the chat. Ask the agent to explain what it means in plain language before suggesting a fix.
- **Agent is going in circles on a bug:** ask it to write the simplest possible test that reproduces the problem, then work from there.
- **Railway or GitHub issue:** these usually need manual intervention. Tell the agent "this is a platform issue, not a code issue. I'll handle it — tell me exactly what to do in the dashboard."
- **You've lost the thread across sessions:** start a new session, point the agent at the spec, and ask it to tell you the current state of the build based on the repo contents. Let it reorient.

Do not be afraid to restart sessions. Short, focused sessions beat long drifting ones.

---

## Preflight (Daniel tasks, before any code is written)

These are the tasks that require your login, your email, your OAuth approval. The agent cannot do them. Do them once, in order, before the first coding session.

### 1. GitHub

- Sign in to GitHub.
- Create a new **private** repository named `magic-circle` (or whatever you prefer). Do not initialize it with a README — the agent will set up files.
- Clone it locally: `git clone git@github.com:YOUR-USERNAME/magic-circle.git`
- Put the reference documents (`PRD.md`, `build-spec.md`, `design-decisions.md`) in the root of the repo.
- Create a `reference/` subfolder and put `magic-circle-mobile-test.html` inside it.
- Commit and push.

### 2. Railway

- Sign up at [railway.app](https://railway.app) using GitHub OAuth.
- Don't create a project yet — we do that in Milestone 1 so the timing lines up with the first deploy.
- You'll pay a small monthly amount (currently $5 minimum) once you have a live project. Acceptable v0 cost.

### 3. Local environment

- Confirm Node is installed: `node --version` (expect v20 or later).
- Confirm npm works: `npm --version`.
- If either of those fails, install Node via [nodejs.org](https://nodejs.org) or your preferred version manager. Stop here and fix before proceeding.
- Install Claude Code if you haven't: follow the current install instructions at Anthropic's docs.

### 4. Open Claude Code in the repo

`cd` into the cloned repo, then start Claude Code. You should be ready to issue the first prompt.

---

## Architecture at a Glance

This section is for quick orientation. The milestones spell out what gets built when.

### Stack (from PRD)

- Node.js, current LTS
- Web framework: **Express** (simpler than Fastify; v0 does not need the performance difference)
- Templates: **EJS** (plainest option; readable at a glance)
- Database: **SQLite** via `better-sqlite3`
- No ORM, no auth library, no frontend framework, no bundler
- Client JS: a single inline `<script>` block in the layout template

### File structure (target)

```
/
├── server.js                 # Express app, routes, db init
├── db.js                     # SQLite connection + prepared statements
├── helpers.js                # literaryTime, sanitize, etc.
├── package.json
├── package-lock.json
├── .env.example              # documents DATABASE_PATH and INSTANCE_NAME
├── .gitignore                # node_modules, .env, *.db
├── schema.sql                # CREATE TABLE statements
├── views/
│   ├── layout.ejs            # <html>, <head>, header, main slot
│   ├── index.ejs             # thread list + empty state
│   ├── thread.ejs            # posts + reply composer
│   └── new-thread.ejs        # thread composer
├── public/
│   └── style.css             # all styles, single file
├── docs/                     # or root — your call
│   ├── PRD.md
│   ├── build-spec.md
│   └── design-decisions.md
└── reference/
    └── magic-circle-mobile-test.html
```

### Database schema (full)

```sql
CREATE TABLE IF NOT EXISTS threads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  thread_id INTEGER NOT NULL REFERENCES threads(id),
  body TEXT NOT NULL,
  handle TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_thread_id ON posts(thread_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
```

### Routes

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | Index — list of threads (or empty state) |
| GET | `/threads/new` | New-thread composer |
| POST | `/threads` | Create thread + first post |
| GET | `/threads/:id` | Thread view with reply composer |
| POST | `/threads/:id/reply` | Create reply |
| GET | `/robots.txt` | Disallow-all |

### Environment variables

- `DATABASE_PATH` — where the SQLite file lives. Default for local dev: `./magic-circle.db`. Production: `/data/magic-circle.db` (on mounted persistent volume).
- `INSTANCE_NAME` — what the wordmark displays. Default: `magic circle`.
- `PORT` — Express listen port. Default: `3000`. Railway sets this automatically in production.

### Input constraints

- Handle: 1–32 characters after trimming. Reject empty.
- Title: 1–200 characters after trimming. Reject empty.
- Body: 1–10,000 characters after trimming. Reject empty.
- All text is stored as plain text. No markdown rendering. Line breaks in the body render as paragraph breaks in the template.

---

## Source of Truth for the Design System

The agent should treat the following as authoritative, in this order:

1. **`reference/magic-circle-mobile-test.html`** — the canonical source for colors, typography, spacing, the empty-state animation, and the symbol-rendering pattern. When in doubt about any visual detail, extract it from this file. Do not re-derive the design system from the written docs.
2. **`design-decisions.md`** — for any decision not expressible in the prototype (e.g. the timestamp schema beyond what the demo shows, the 44px touch target minimum).
3. **`PRD.md`** — for anything the above two don't cover, plus any time rationale would help the implementation.

The agent should not invent visual decisions. If something isn't specified in the above three sources, it asks.

---

## Milestone 1: Hello World Deploy

**Goal:** prove the path from local code to live URL with persistent SQLite storage, before building real features.

### Daniel prerequisites

- Preflight complete.
- Willing to create a Railway project mid-milestone.

### Agent tasks

1. Initialize `package.json`. Install `express`, `ejs`, `better-sqlite3`.
2. Create `server.js` with a single GET `/` route that:
   - Reads `DATABASE_PATH` from env (defaults to `./magic-circle.db`).
   - Opens the SQLite connection; creates a table `smoke_test(id INTEGER PRIMARY KEY, message TEXT)` if not present.
   - Inserts a row `{ message: 'magic circle' }` if the table is empty.
   - Selects the message back out.
   - Returns an HTML page with the message in an `<h1>`.
3. Create `.gitignore` with `node_modules/`, `*.db`, `.env`, `.DS_Store`.
4. Create `.env.example` documenting both env vars.
5. Write a short `README.md` with local-run instructions (`npm install`, `npm start`).
6. Confirm the app runs locally on `http://localhost:3000` and shows "magic circle".

### Daniel tasks (mid-milestone)

Once the local app works, Daniel does the Railway setup. The agent will hand off with instructions; Daniel executes them in the browser:

1. Railway dashboard → New Project → Deploy from GitHub repo → select `magic-circle`.
2. Once deployed, go to the service → Variables → add `INSTANCE_NAME=magic circle` (or whatever).
3. Go to Volumes → New Volume → mount path `/data`.
4. Add env var `DATABASE_PATH=/data/magic-circle.db`.
5. Redeploy (Railway should auto-redeploy after the variable change).
6. Click the generated URL, confirm it shows "magic circle".

### Verification

- Local: `npm start`, visit `http://localhost:3000`, see "magic circle".
- Production: visit the Railway URL, see "magic circle".
- Redeploy test: push a trivial change (e.g. a comment) to GitHub, wait for auto-deploy, reload the URL, confirm the message is still there (this proves the persistent volume is working — if the db got wiped, the app would insert the row again, so to really test you'd need to insert a different row manually and confirm it survives. Agent can write a one-line Railway `railway run` or SSH instruction to do this. Optional for v0.)

### Stop signal

Confirm with Daniel before proceeding to Milestone 2.

---

## Milestone 2: Read-Only Forum

**Goal:** the full index and thread views, rendered with the final design system, from a seeded database. No posting yet.

### Agent tasks

1. Write `schema.sql` with the `threads` and `posts` tables from Architecture.
2. Update `server.js` to run the schema on startup (or via a `db.js` module).
3. Replace the smoke-test data with a seed: a few threads with varied timestamps, 3–4 posts each. Seed content should be substantive enough to test typography — not lorem. Use the content from `reference/magic-circle-mobile-test.html` if useful.
4. Build `views/layout.ejs` with the header (wordmark on left, "new thread" link on right), `<main>` slot, and the single inline `<script>` block. Layout should include all color variables and the `prefers-color-scheme` media query for light mode.
5. Build `views/index.ejs` — thread list, each row with title, author, literary timestamp.
6. Build `views/thread.ejs` — thread title + posts in chronological order, each with body and byline. Back link upper right.
7. Write `public/style.css` — extract everything from `reference/magic-circle-mobile-test.html` and organize. Mobile-first. Include desktop overrides above ~600px.
8. Implement `helpers.literaryTime(unixSeconds)` — see the pattern section below.
9. Add containment basics: page title format `${thread title} • ${INSTANCE_NAME}` or just `${INSTANCE_NAME}` for the index. (Full containment is Milestone 4.)
10. Verify both routes work locally in dark and light mode (toggle OS theme to confirm).

### Verification

- Index renders the seeded threads sorted by latest activity.
- Clicking a title goes to that thread.
- Thread view shows posts in order with bylines below each post.
- Typography matches the prototype — fonts load, sizes correct, meta row tracked uppercase with ◆ separator.
- Literary timestamps render correctly for each seeded timestamp.
- OS theme change flips between dark and light.
- Mobile viewport (use browser dev tools) looks right — 350px column, 11px meta, etc.

### Stop signal

Confirm with Daniel. Daniel should view both locally **and** on a phone (deploy to Railway, open on phone) before approving.

---

## Milestone 3: Posting

**Goal:** the composers work. Real humans can write threads and replies.

### Agent tasks

1. Build `views/new-thread.ejs` — title input, body textarea, handle input, submit button.
2. Add a reply composer to the bottom of `views/thread.ejs` — body textarea, handle input, submit button. Always visible.
3. Add POST route `/threads`:
   - Validate title (1–200 chars, trim), body (1–10,000 chars, trim), handle (1–32 chars, trim).
   - In a single SQLite transaction: insert the thread, then insert the first post with the thread's ID. This guarantees no thread ever exists without a post.
   - Redirect to the new thread's URL on success.
   - On validation error: re-render the composer with the submitted values preserved and an inline error message.
4. Add POST route `/threads/:id/reply`:
   - Validate body and handle (same rules).
   - Insert the post.
   - Redirect back to the thread URL.
   - On validation error: re-render with preserved values and error.
5. Inline JavaScript in `layout.ejs`:
   - On page load, read `localStorage['magic-circle:handle']` and pre-fill any handle input on the page.
   - On form submit, if handle input has a value, write it to localStorage.
6. Keep the same font, size, and line-height as body copy in textareas. Placeholder text per the prototype ("take your time with this", "there's no rush").

### Verification

- Post a new thread from the composer. See it on the index.
- Reply to a thread. See the reply appear in the thread.
- Type a handle, submit, navigate to another composer, confirm handle is pre-filled.
- Change the handle, submit, confirm new handle is persisted.
- Try submitting empty fields — should reject with a visible error, not crash.
- Try submitting a 30,000-character body — should reject cleanly.
- On mobile: tap into the textarea, keyboard appears, type, submit.

### Stop signal

Confirm with Daniel. Posting is the real loop — this is the first milestone where you can feel whether the forum works.

---

## Milestone 4: Containment

**Goal:** the room is closed to outsiders. No search engine indexing, no rich-link previews.

### Agent tasks

1. Add GET `/robots.txt` returning:
   ```
   User-agent: *
   Disallow: /
   ```
2. Add Express middleware that sets `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` on every response.
3. Audit `views/layout.ejs` head for any Open Graph or Twitter card meta tags. Remove them if present. (Express/EJS defaults don't add them, but double-check.)
4. Confirm no `og:*` or `twitter:*` meta tags exist anywhere.
5. Confirm thread URLs are numeric (`/threads/47`) and not slugged.
6. No public RSS or Atom feed routes.

### Verification

- `curl -I https://YOUR-URL/` returns the `X-Robots-Tag` header.
- `curl https://YOUR-URL/robots.txt` returns the disallow-all rules.
- Paste a thread URL into iMessage or Slack — no rich preview card should appear (or if one does, it should show only the title and the wordmark, no description or image).
- Search Google for the instance URL. It should not appear. (Won't be immediate; new sites can take days to be crawled. Do a spot check a week after launch.)

### Stop signal

Confirm with Daniel.

---

## Milestone 5: Polish

**Goal:** the small things that make the room feel considered. After this, v0 is done.

### Agent tasks

1. **Text size toggle (desktop only).**
   - In the header, add an "Aa" button that toggles body size between 19px and 22px.
   - Persist choice in `localStorage['magic-circle:text-size']` (`'default'` or `'large'`).
   - Not rendered on mobile (hide below the breakpoint).
   - Titles scale proportionally. Line height ratio preserved.
2. **Empty-state evocation.**
   - When the thread count is zero, the index renders the drawn-circle animation instead of the thread list.
   - Extract the full SVG + HTML overlay + CSS from `reference/magic-circle-mobile-test.html`. This is the canonical implementation; do not rebuild from prose.
   - **Once-per-session playback:** on first visit to the empty state in a session, animate. On subsequent visits in the same session, render the final state (completed circle with ◆ + "begin", no animation). Use `sessionStorage['magic-circle:empty-animated']` as the flag, set to `'1'` after the animation completes (delay ~5s after page load, or hook it to animationend).
   - The "begin" link routes to `/threads/new`.
3. **Sparse state.**
   - When the thread count is small (say, 1–5), the index already works but spacing should feel intentional. Verify the first-thread-on-the-index case renders with generous vertical rhythm. Adjust if it looks broken.
4. **Final design audit.**
   - Compare index, thread, and composer views against `reference/magic-circle-mobile-test.html` at both mobile and desktop viewports. Fix any drift.
   - Check both dark and light modes.
   - Confirm accessibility basics: keyboard tab order is sensible, form labels are present (hidden if need be), focus states visible.

### Verification

- Text size toggle works on desktop, missing on mobile.
- With an empty database, the index shows the animation on first visit. Refresh — no animation, just the final circle + begin. Close and reopen the tab (new session) — animation plays again.
- "Begin" link leads to the new-thread composer.
- Posting a thread makes the empty state go away (the index shows the thread list). Deleting the thread from SQLite directly (for testing) brings the empty state back.
- Visual audit passes against the prototype.

### Stop signal

v0 is shippable. Daniel decides whether to open the URL to real people.

---

## Key Implementation Patterns

These are the non-obvious bits. The agent should reference this section rather than reinventing.

### Literary timestamp

Deterministic mapping from a Unix timestamp (in seconds) to a lowercase string, using the viewer's current time as the reference point.

```
literaryTime(ts, now = Date.now() / 1000):
  diff = now - ts
  tsDate = new Date(ts * 1000)
  nowDate = new Date(now * 1000)

  if diff < 60: return "just now"
  if diff < 3600:
    minutes = floor(diff / 60)
    return minutes + " minutes ago" (or "a minute ago" for 1)
  if sameCalendarDay(tsDate, nowDate):
    if tsDate.hours < 12: return "this morning"
    if tsDate.hours < 17: return "this afternoon"
    return "this evening"
  if yesterdayOf(tsDate, nowDate): return "yesterday"
  if within7Days(tsDate, nowDate): return dayName(tsDate).toLowerCase()       // "wednesday"
  if within14Days(tsDate, nowDate): return "last " + dayName(tsDate).toLowerCase()  // "last friday"
  if within31Days(tsDate, nowDate): return "a few weeks ago"
  if within62Days(tsDate, nowDate): return "last month"
  if sameYear(tsDate, nowDate): return tsDate.day + " " + monthName(tsDate).toLowerCase()  // "18 april"
  return monthName(tsDate).toLowerCase() + " " + tsDate.year                   // "march 2025"
```

Timezone: use server time for v0 (simplest). If threads start landing in a wrong bucket, revisit.

### Handle persistence

All on the client via a single inline script in `layout.ejs`:

```js
(function() {
  const KEY = 'magic-circle:handle';
  // Pre-fill
  const saved = localStorage.getItem(KEY);
  if (saved) {
    document.querySelectorAll('input[name="handle"]').forEach(i => {
      if (!i.value) i.value = saved;
    });
  }
  // Save on submit
  document.querySelectorAll('form').forEach(f => {
    f.addEventListener('submit', () => {
      const input = f.querySelector('input[name="handle"]');
      if (input && input.value.trim()) {
        localStorage.setItem(KEY, input.value.trim());
      }
    });
  });
})();
```

### Theme: CSS-only

No JavaScript needed. The `prefers-color-scheme` media query in CSS handles everything:

```css
:root {
  /* dark-mode variables */
}
@media (prefers-color-scheme: light) {
  :root {
    /* light-mode overrides */
  }
}
```

No toggle, no localStorage, no JS.

### Containment headers

```js
app.use((req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  next();
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nDisallow: /\n');
});
```

### Empty-state animation

Extract wholesale from `reference/magic-circle-mobile-test.html`. The ring SVG, spark group, symbol-stack HTML overlay, all the keyframes, and the timing values. Do not rebuild from the design-decisions table — the working code is the spec.

For once-per-session playback, conditionally add a CSS class to the wrapper that triggers animations, set by JS based on `sessionStorage`:

```js
const FLAG = 'magic-circle:empty-animated';
const wrap = document.querySelector('.circle-wrap');
if (wrap) {
  if (sessionStorage.getItem(FLAG)) {
    wrap.classList.add('animated-already');  // CSS shows final state, no animation
  } else {
    wrap.classList.add('animate-now');       // CSS triggers the keyframes
    setTimeout(() => sessionStorage.setItem(FLAG, '1'), 5000);
  }
}
```

Adjust the CSS so keyframes only apply when `.animate-now` is present, and the final state is applied directly when `.animated-already` is present.

### Database initialization

On server startup:

```js
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || './magic-circle.db';
const db = new Database(dbPath);
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);  // idempotent because CREATE TABLE IF NOT EXISTS

module.exports = db;
```

### Thread creation transaction

```js
const createThread = db.transaction((title, body, handle) => {
  const now = Math.floor(Date.now() / 1000);
  const threadResult = db.prepare(
    'INSERT INTO threads (title, created_at) VALUES (?, ?)'
  ).run(title, now);
  const threadId = threadResult.lastInsertRowid;
  db.prepare(
    'INSERT INTO posts (thread_id, body, handle, created_at) VALUES (?, ?, ?, ?)'
  ).run(threadId, body, handle, now);
  return threadId;
});
```

This guarantees atomicity: if either insert fails, neither is committed.

---

## Known Gotchas

- **Railway ephemeral filesystem.** Without a persistent volume mounted and `DATABASE_PATH` pointed at it, every redeploy wipes the database. Set this up in Milestone 1 before any real data exists.
- **iOS Safari SVG text clipping.** Large decorative Unicode glyphs (◆, ¶, ※) clip when rendered as `<text>` inside SVG. The empty-state symbols must be HTML spans positioned over the SVG, with `line-height: 1.5` and `padding: 0.25em 0`. Pattern is already in `reference/magic-circle-mobile-test.html`.
- **better-sqlite3 on local machines.** On Mac with Apple Silicon, `npm install` usually works out of the box with Node 20+. If it fails complaining about `node-gyp` or Python, the fix is usually reinstalling with a compatible Node version. Escalate to Daniel if encountered.
- **Git push triggers Railway redeploy.** Every push to `main` (or whichever branch Railway is watching) redeploys all connected instances simultaneously. Avoid pushing broken code. Use a feature branch for experimentation if needed.
- **Environment variables require redeploy.** Changing `INSTANCE_NAME` in Railway requires restarting the service. Railway usually does this automatically, but confirm.
- **Timezones.** v0 uses server time. For a solo or small-friends instance this is fine. If a deployer and readers are in wildly different timezones, "this morning" can be technically wrong. Not a v0 concern.

---

## Acceptance Criteria Summary

v0 is done when:

1. A visitor can land on the URL, read the index, open a thread, read it, and leave — without confusion.
2. A first-time poster can write a thread, sign it with a handle, submit, and see it in the room — no account, no onboarding.
3. A returning visitor's handle is still pre-filled.
4. The empty-state animation plays on the founding moment and on first session visit thereafter, then holds steady.
5. External link previews don't unfurl with rich cards. `robots.txt` disallows indexing. `X-Robots-Tag` is set on every response.
6. The deployer can stand up a second Railway project from the same repo, with a different `INSTANCE_NAME` and its own volume, and the two instances do not know about each other.
7. Both dark and light modes render cleanly and respect system preference.
8. The design matches `reference/magic-circle-mobile-test.html` at both mobile and desktop viewports.

If all of that is true, stop. v0 is shippable.

---

*Written April 2026. This document lives in the repo until v0 is shipped; after that, archive.*
