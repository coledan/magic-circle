# Product Requirements Document
## Magic Circle — v0

*This document sits below Foundations and Design Brief, and above the actual code. It translates the founding principles and design decisions into build requirements for a first deployable version. When a requirement here conflicts with Foundations, Foundations wins. When it conflicts with Design Brief, Design Brief wins. The PRD's job is to be specific enough that someone — including Claude Code or Cowork — can build from it without re-deciding what's already been decided.*

*Status: first draft. To be revised by contact with the build, then by contact with real use.*

---

## What v0 Is

Magic Circle v0 is a single-room forum delivered as a self-contained, deployable web application. One instance is one room. The instance is hosted at a URL, and access to that URL is the entire entry mechanic — whoever has the URL can read and post. Posts are signed with a handle the participant chooses; the browser remembers the handle so it persists across sessions on that device. There are no accounts, no passwords, no email addresses, no profiles. There is no algorithmic ordering, no notification system, no edit or delete capability. Posts are not indexable by search engines. The thread is the unit of content; the index of threads is the home page.

The point of v0 is to put the founding principles in front of real readers in a real room. It is the smallest version of the forum that can host a genuine conversation and be honest about what it is.

---

## What This Document Inherits

The following are decided and not reopened here. The PRD references them; it does not re-litigate them.

- **Foundations** — the principles the forum is trying to make possible and the anti-goals it refuses. Every requirement below is downstream of these.
- **Design Brief** — the experience standard. Reading is the primary activity; the typography and layout serve it; playfulness lives quietly in the margins.
- **Design Decisions log** — Newsreader Text at 19px on a 580px measure, the ◆ separator, the literary timestamp schema, dark and light as equal citizens, the AAA contrast standard. Treat these as build requirements, not proposals.
- **Jobs To Be Done** — the seventeen peer main jobs. The PRD scopes which are served in v0 and which are deferred.
- **Conditions** — the discipline of shipping over deepening. The PRD is sized for the smallest honest v0, not for the perfectly theorized one.

If something below seems to drift from any of these, the PRD is wrong. Fix the PRD.

---

## The Core Decisions That Shape Everything Below

These are the structural commitments that propagate through every other requirement. They are stated once here so that downstream requirements can be brief.

**An instance is a room.** Magic Circle is software you can deploy more than once. Each deployment is one forum, one room, one set of threads. There is no multi-room model, no sub-forums, no cross-instance federation in v0. Right-sizing is achieved by the act of standing up a new instance, not by partitioning a single instance. Management of instances lives with the deployment platform, not inside Magic Circle itself — there is no admin panel, no instance registry, no in-app switcher. Spinning up a new instance means creating a new deployment on Railway (or equivalent), pointing it at the same repository, and giving it its own persistent volume. Operationally, no instance knows about any other instance.

**No accounts.** No registration, no login, no password, no email collection, no session tokens tied to identity. The cost of an account system — both technical and philosophical — is too high for v0 and would force premature commitments on identity questions Foundations is still holding open.

**Identity is a handle, remembered locally.** A participant types a handle on the post form. The browser saves it in `localStorage` so they don't retype on the next post. There is no server-side enforcement that the handle is unique, owned, or persistent. Anyone can claim any handle. This is a deliberate test of the principle that *standing is earned in the thread, not enforced by the system.* If the room cannot tell two voices apart, the voices were not as distinct as they seemed. That is useful information.

**No edits, no deletes.** The thread holds. Once posted, a post stays as written. This is also a forced consequence of having no accounts — without identity enforcement, there is no honest way to authorize an edit. But it is being kept in v0 not as a workaround but as a position to test: that the magic circle is partly constituted by the durability of what is said inside it. JTBD #13 (amend) and #14 (withdraw) are deferred.

**The URL is the entry mechanic.** Whoever has the URL can read and post. There is no invitation flow, no fee, no lurking period, no captcha, no rate limit beyond what is necessary to keep the server alive. The deployer chooses who to share the URL with, and that is the gate. Any future entry mechanic is a layer that sits on top of v0, not a thing v0 must pre-build for.

**Containment is technical, not aspirational.** The forum is closed to outsiders by design. Search engine indexing is suppressed at the protocol level. Thread URLs are not SEO-optimized. There is no public RSS feed, no Open Graph metadata, no archive interface. A non-member who guesses or stumbles onto the URL can read — but they cannot easily find it via Google, and the design does not invite them in.

**No notifications, no engagement loops.** No email alerts. No push. No unread counts. No streaks. No new-reply badges. No "you have replies" banner. You arrive when you arrive; you leave when you are done. The index is sorted by latest activity, and that ordering is the only signal of where the room is currently warm.

**Theme follows the operating system.** The forum respects `prefers-color-scheme` on first load and does not offer a user-level theme toggle in v0. The tradeoff: a reader in dark system mode who prefers light for this specific app has no override. The tradeoff is worth it — one less control, one less decision, one less persisted preference. If real use surfaces the need, a toggle is additive.

**Server-rendered HTML, minimal JavaScript.** No React, no Vue, no SPA. Pages are HTML rendered by the server on each request. JavaScript is used for a small set of documented behaviors only: persisting the handle in `localStorage`, the text size toggle on desktop, and triggering the empty-state animation once per session via `sessionStorage`. Everything else is forms posting and pages reloading. This keeps the dependency surface small enough that the whole codebase is legible at a glance.

---

## Scope, Mapped to Jobs To Be Done

The seventeen peer main jobs from the JTBD document are scoped here. "In v0" means the job has dedicated mechanics. "Implicit in v0" means the job is served by the existing core mechanics without a separate feature. "Deferred" means we are not building for it now and the absence is intentional.

**In v0** — the core loop:

- **#1 Share my thoughts with a group** — covered by the post composer (new thread or reply). Sub-jobs 1.1 (share now), 1.2 (prepare a thought), 1.3 (ready myself), 1.4 (direct to a person), 1.5 (prompt others) are all served by a single rich-enough text surface; no special UI for any individual sub-job.
- **#2 Observe the thoughts of others** — covered by the index view (2.1, 2.2) and the thread view (2.3).
- **#3 Respond to the thoughts of others** — covered by the reply composer at the bottom of the thread view. 3.2 (respond to the conversation as a whole) is the default behavior. 3.1 (respond to a specific thought) is served informally by quoting, not by a structured reply mechanism in v0.

**Implicit in v0** — present without a feature:

- **#4 Locate a group of thinkers** — served by the URL itself. You "locate" the group by being given the URL.
- **#8 Find out what this group is discussing** — served by the index view.
- **#9 Present myself to this group** — served by the handle on each post. There is no profile page, no introduction thread, no avatar.

**Deferred** — explicitly not built in v0:

- **#5** Track a person's thinking over time — no profile pages, no post history view per handle.
- **#6** Follow a specific thread over time — no subscribe, no bookmark, no follow.
- **#7** Search what has been said — no search interface.
- **#10** Leave the group — no account to delete; you leave by closing the tab.
- **#11** Bring someone into the group — done out-of-band by sharing the URL.
- **#12** Remove someone from the group — no formal mechanism; if needed, the deployer can change the URL.
- **#13** Amend a thought — explicitly refused in v0.
- **#14** Withdraw a thought — explicitly refused in v0.
- **#15, #16, #17** — the conversation-boundary family. A flat thread mechanic supports the underlying activities informally; no structured UI.
- **Sub-job 1.6** Pose a structured question to the group — no poll/question type in v0; pose questions in prose.

A v0 that serves the core loop honestly is more useful than a v0 that pretends to serve all seventeen jobs poorly. Every deferral above will be revisited only when real use shows the absence is doing harm.

---

## Identity Model

A participant has a handle. The handle is a string they type into the post form. On submit, the handle is saved in `localStorage` under a known key (e.g. `magic-circle:handle`). On the next visit, the post form pre-fills with the saved handle. The participant can change it at any time by typing something different.

The handle field is part of the post form, not a separate "set your identity" interface. The first post a participant writes is also the moment they declare a handle. There is no onboarding step, no welcome screen, no "create your username" flow.

There is no server-side uniqueness enforcement. Two devices can post under the same handle. One device can change its handle at will. The server stores the handle as a plain string attached to each post — historical posts are not retroactively re-attributed when a handle changes.

There is no minimum or maximum handle length beyond what is necessary to render in the byline (suggested: 1–32 characters). There is no character restriction beyond stripping leading and trailing whitespace and normalizing internal whitespace to single spaces. Unicode is allowed.

If the handle field is left empty, the post is rejected with a quiet inline message ("a handle is required to post"). There is no anonymous posting mode in v0. Anonymity defaults to handle reuse and the absence of accountability — the forum does not need to provide a separate anonymous mechanism for it.

---

## Containment Model

The instance must not be discoverable by search engines or accidentally surfaced by link-sharing tools. The following are required:

- **robots.txt** at `/robots.txt` returning `User-agent: *\nDisallow: /`.
- **X-Robots-Tag** header on every response: `noindex, nofollow, noarchive, nosnippet`.
- **No Open Graph tags.** No `og:title`, `og:description`, `og:image`. Pasting a thread URL into a chat client should not produce a rich preview card.
- **No Twitter card tags.** Same rationale.
- **No public RSS feed.** No `/feed`, no `/rss`, no Atom.
- **Page title** uses the format `<thread title> • magic circle` for thread pages and `magic circle` for the index. The thread title appearing in the browser tab is fine — the participant inside the room benefits from knowing what tab they're on. The containment is about external indexing, not internal usability.
- **Thread URLs are numeric:** `/threads/47`, not `/threads/47-the-question-of-anti-goals`. Slugs are an SEO affordance, and we are not extending one.

The URL is the gate. If a non-member ends up at the URL, they can read. That is the design — the alternative (auth gating reading) imposes account overhead that v0 explicitly refuses. The combination of search suppression, no rich-link previews, and no public-archive surface means the forum is reachable only by people the URL was deliberately given to.

---

## The Features in Detail

Each feature below names the JTBD it serves, the Foundations principle it expresses, and the build-level requirements. Edge cases are called out where they exist.

### The Index View — `/`

**Job:** #2 (observe), #8 (find out what's being discussed).
**Principle:** *The thread is the thing.* The index is the ground; the threads are what happens on it. The index is not a feed.

The index displays the list of threads, ordered by the timestamp of the most recent post in each thread (descending — most recently active first). Each thread row shows:

- **Title** — the title given when the thread was created. Per design decisions: 21px, Newsreader, sized as a heading. Clicking the title goes to the thread.
- **Author** — the handle of the participant who created the thread (the author of the first post). Per design decisions: meta row treatment.
- **Last activity timestamp** — when the most recent post in the thread was made. Per design decisions: literary timestamp schema (today / yesterday / day name / "a few weeks ago" / sparse date / month + year).

The meta row uses the ◆ separator, DM Sans 10px tracked uppercase, with the spacing and color decisions from the log. Author and timestamp only — no reply count, no preview, no tags.

The header at the top of the index shows the instance name in Newsreader italic on the left, and on the right: a "new thread" link and (on desktop) a text size toggle. A "new thread" affordance must be present and quiet.

The index has no pagination in v0. Threads are listed in full, scrollable. If an instance grows past the point where this is workable, that is a real problem to solve — but it is a problem we want to encounter rather than pre-solve, because the answer is informative about what the forum has become.

**Empty state.** When the instance has no threads, the index replaces the thread list with a drawn-circle evocation — a large, quiet animation that enacts the founding moment of the room. This is a deliberate departure from conventional "no content yet" empty-state copy. The forum is named after Huizinga's magic circle — the bounded space in which different rules apply — and the empty state is the act of drawing that circle.

*What the animation does.* A thin line (1.5px stroke, in the meta color) is drawn as a circle over ~2.2 seconds, starting at 12 o'clock and progressing clockwise. A small bright spark with a soft halo rides the leading edge as the line is drawn. The drawing uses a pronounced ease-out curve (`cubic-bezier(0.45, 0, 0.12, 1)`) — fast at the start, noticeably slower as the gesture completes. As the spark reaches the closing point, it fades out. Inside the now-closed circle, three typographic marks fade through one after another: the pilcrow (¶) at 2.3s, the reference mark (※) at 2.9s, and the project's chosen separator (◆) at 3.5s. The diamond settles and holds. Beneath the circle, the word *begin* fades in at 4.2s as an italic Newsreader link that routes to the new-thread composer.

*Why those three marks.* The pilcrow is the most writing-coded of all punctuation — it literally means "paragraph." The reference mark (※, *kome*) is the scholarly one, used in classical typography for footnotes and citations. The diamond is the project's own. A small incantation of writing marks instead of sigils, landing on the mark the forum itself uses.

*Sizing.* The circle fills the content column on mobile (full width up to 400px). On desktop it caps at 400px, centered. The symbols inside scale proportionally using container queries (`25cqw`) — roughly 25% of the container width. The stroke weight stays constant at 1.5px in absolute pixels regardless of rendered size, reinforcing "ink on paper."

*Playback.* The animation plays once per session. A `sessionStorage` flag is set when the animation completes, and subsequent visits to the empty state within the same session show the completed circle with ◆ in the middle and *begin* beneath, with no animation. The animation is the founding gesture; repeating it on every visit would cheapen it.

*Rendering note.* The three symbols must be rendered as HTML `<span>` elements positioned over the SVG, not as SVG `<text>` elements. See the Mobile section for why.

**Sparse state.** When the instance has a small number of threads, the spacing around them matters more than at scale. Generous vertical rhythm. Do not pad the page with placeholder content.

### The Thread View — `/threads/:id`

**Job:** #2.3 (observe what the group thinks about a topic), #3 (respond).
**Principle:** *Posts as documents.* No cards, no boxes — posts sit directly on the page background, separated by hairline rule and space, per design decisions.

The thread view displays:

- **Thread title** at the top, 24px Newsreader, line-height 1.35.
- **Posts in chronological order** (oldest first, top to bottom). Each post is body text in Newsreader at 19px on the 580px measure, followed by the byline meta row (author ◆ timestamp). The byline appears *after* the post body, per the design decision that writing earns its reading before identity is declared.
- **A reply composer at the bottom of the thread.** Always present, never collapsed. Same typeface, size, and color as the post body — the compose experience belongs to the reading experience. Placeholder text in the register of the forum (e.g. *take your time with this*).
- **A back link** in the upper right: `← all threads`. Minimal, does not compete with content.

There is no reply count at the top. There is no "jump to latest" button. There is no nesting — replies are flat and chronological. Quoting another post is done by the participant in prose; there is no structured quote mechanism in v0.

**The first post and subsequent posts use the same visual treatment.** The first post is not styled as an "OP" with special weight. Treating every post identically reinforces the principle that standing is earned in the thread, not granted by structural position.

**Long threads.** No pagination in v0. The thread renders top-to-bottom. The reading experience should reward scrolling — typography, measure, and rhythm should hold over a long page.

### The Compose New Thread View — `/threads/new`

**Job:** #1 (share my thoughts), specifically the act of starting a new conversation.
**Principle:** *The first post is a gift regardless of whether it was labored over or naive.* The composer should not force a particular shape on the gift.

The compose view contains:

- A title field. Required. Single line. Newsreader, sized at the thread-title size (24px) so the participant sees roughly what their title will look like in the index.
- A body field. Required. Newsreader, 19px on the 580px measure, same as a post in a thread. Generous initial height (suggested: 12 lines visible). Auto-grows with content.
- A handle field. Required. DM Sans, smaller. Pre-filled from `localStorage` if present.
- A submit button: `start thread`. Ghost style, per design decisions.
- A back link: `← all threads`.

On submit, the server creates a new thread row, creates the first post row attached to it, redirects to the new thread's URL.

**No drafts in v0.** If the participant navigates away without submitting, the composition is lost. This is consistent with no edits / no deletes — once you commit, you commit; until then, you have not committed. The browser may preserve form state on back-navigation; we don't fight it, but we don't engineer drafts either.

### The Reply Composer — within `/threads/:id`

**Job:** #3 (respond).
**Principle:** *The compose experience belongs to reading.* No context switch.

The reply composer is at the bottom of the thread view. Always visible, always available. It contains:

- A body field. Newsreader, 19px, 580px measure. Generous initial height (suggested: 6 lines). Auto-grows.
- A handle field. Required. Pre-filled from `localStorage`.
- A submit button: `post reply`. Ghost style.

On submit, the server appends the post to the thread, redirects to the thread URL with the new post present. The page should land the participant near the post they just wrote — anchor scroll to the new post is acceptable; reloading and letting them scroll is also acceptable. Either is fine for v0.

**No "reply to a specific post" mechanism.** Replies attach to the thread, not to other posts. A participant who wants to address a specific post does so in prose ("re: the point about the magic circle being porous —"). This is intentional — threading-by-reply is one of the open questions Foundations holds, and v0 does not pre-commit to a tree structure.

### Setting and Changing the Handle

**Job:** #9 (present myself to this group).
**Principle:** *Identity as accumulation, not declaration.* No profile page, no bio, no upfront declaration.

There is no separate "set your handle" interface. The handle is set when the participant first posts. It is changed by typing a different value into the handle field on any subsequent post.

The handle field on the post form should be visible enough that participants understand what's happening (their post will be signed with this name) but not so prominent that it competes with the body. Suggested treatment: small label "posting as" above the field, DM Sans, low contrast.

### Text Size Toggle

**Job:** Reading comfort, accessibility.
**Principle:** *Reading is the primary activity.* The reader should be able to size the text.

On desktop, a small control (`Aa`) in the page header steps the body size between 19px (default) and 22px (large). Title sizes scale proportionally. Line height ratio is preserved. Choice persisted in `localStorage`.

On mobile, the toggle is not rendered. Phones provide their own text-size accessibility (pinch-zoom, reader mode, system font-size settings), and the narrow header has higher-priority claimants on its space. This is a small compromise consistent with "the tool stays invisible."

Two sizes is enough for v0. A continuous slider or three-step toggle is more than the design needs at this stage.

---

## Data Model

SQLite, single file, two tables.

**threads**

| Column | Type | Notes |
|---|---|---|
| id | INTEGER PRIMARY KEY | autoincrement |
| title | TEXT NOT NULL | the thread title |
| created_at | INTEGER NOT NULL | unix timestamp (seconds) |

**posts**

| Column | Type | Notes |
|---|---|---|
| id | INTEGER PRIMARY KEY | autoincrement |
| thread_id | INTEGER NOT NULL | foreign key → threads.id |
| body | TEXT NOT NULL | post content |
| handle | TEXT NOT NULL | the handle as typed |
| created_at | INTEGER NOT NULL | unix timestamp (seconds) |

That's it. No users table (no accounts). No edits table (no edits). No tags, no votes, no reactions, no read receipts, no sessions. The schema can be expanded; it should not be expanded preemptively.

The first post in a thread is identified by being the post with the lowest `created_at` for that `thread_id`. The thread's "last activity" is `MAX(created_at)` across its posts.

---

## Visual and Typographic Requirements

The design decisions log is authoritative. The PRD does not restate it; it points to it. The build must implement:

- Newsreader Text (Production Type) for body and titles. DM Sans for meta and controls. Both via Google Fonts. `font-optical-sizing: auto` set on body.
- Body 19px, line-height 1.5. Index titles 21px. Thread titles 24px, line-height 1.35. Large mode bumps body to 22px proportionally.
- Content column 580px, centered.
- Dark mode background `#1a1a1a`, surfaces `#242424`, hairline rules `#2a2a2a`. Text colors per the log (titles `#efefef`, body `#d4d4d4`, author `#b4b4b4`, meta `#a8a8a8`). All content text WCAG AAA. Light mode background `#f0f0f0` warm off-white with corresponding dark text.
- Posts separated by 0.5px rule and 1.75rem padding. No card backgrounds, no borders, no shadows.
- Meta rows use the ◆ separator with 0.6em spacing each side, DM Sans 10px tracked uppercase.
- Timestamps follow the literary schema in the log.

If the build encounters a design question not answered by the log, it goes back to the design brief. If the brief does not answer it, it stops and asks. It does not invent.

---

## Mobile

Mobile is an equal citizen, not a corner case. Reading is the primary activity; a meaningful share of reading will happen on phones. The design decisions log is authoritative for any viewport, with the following mobile-specific overrides and clarifications.

**The measure.** The content column uses `min(580px, 100vw - 40px)`. Desktop hits the calibrated 580px measure; mobile is fluid with 20px padding on each side. On a 390px iPhone, this produces a 350px column — about 50 characters per line at body size. Shorter than the desktop ideal of 65–70, but well within comfortable reading range. The measure does not break below this; it narrows.

**Body size stays at 19px.** No step-down on mobile. Newsreader's optical sizing handles small-screen rendering well, and stepping down preemptively is the kind of "mobile is lesser" instinct the rest of the design rejects.

**Meta type is 11px on mobile, 10px on desktop.** The 10px DM Sans tracked uppercase of the desktop meta row is genuinely too small on phone viewports — it reads as fiddly rather than subordinate. The 1px bump on mobile holds the same visual hierarchy without sacrificing legibility. Applies to byline meta, back links, composer labels, handle labels, and submit buttons.

**The header at narrow widths carries only the wordmark and "new thread."** The text size toggle is not rendered on mobile (see its feature section above). The theme toggle is not rendered anywhere per Core Decisions.

**Touch targets are at least 36px in the narrow dimension.** This affects the header links, the back link, and the submit buttons. Visual sizing of labels stays at the decided type sizes; padding provides the hit area.

**The empty state fills the content column on mobile.** The drawn-circle evocation sized up is the point — the rest of the design is so restrained that this moment of the founding gesture deserves the whole column's width. See Empty State in the Index View section above.

**Keyboard behavior in the composer is native.** When the soft keyboard appears and pushes the submit button off-screen, we let the phone do what phones do. No sticky submit, no viewport locking. The reader scrolls naturally.

**Known rendering gotcha: large Unicode glyphs inside SVG.** iOS Safari clips tall decorative characters (◆, ¶, ※, and similar) at the line-box boundary when rendered as SVG `<text>` elements, regardless of `overflow` settings or `dominant-baseline` attributes. The reliable approach for any display-sized symbol is an HTML overlay positioned over the SVG — a `<span>` with absolute positioning, `transform: translate(-50%, -50%)` centering, `line-height: 1.5`, and `padding: 0.25em 0` to ensure the glyph's full vertical extent renders without clipping. The small meta-row ◆ at 11px is safe as native text; anything approaching display size should use the HTML overlay pattern.

---

## Stack

- **Runtime:** Node.js (current LTS).
- **Web framework:** something minimal. Express or Fastify. Not Next.js, not Remix. Server renders HTML; there is no client-side rendering layer.
- **Templates:** server-side templating. EJS, Handlebars, or equivalent. Plain enough to read at a glance.
- **Database:** SQLite via `better-sqlite3`. Synchronous API, no separate database server, single file on disk.
- **Frontend dependencies:** none. No bundler, no build step. Plain CSS. A single small inline JavaScript file for the documented client-side behaviors (handle persistence, text size toggle on desktop, once-per-session empty-state animation flag). Fonts loaded from Google Fonts via `<link>` in the head.
- **No ORM.** Hand-written SQL. The schema is two tables; an ORM is overhead.
- **No authentication library.** There is no auth.
- **No frontend framework.** Already stated; restated because the temptation will recur.
- **Configuration via environment variables.** A minimal surface, read at startup. v0 needs only two: `DATABASE_PATH` (where the SQLite file lives — a relative path for local dev, an absolute path on a mounted persistent volume in production) and `INSTANCE_NAME` (what the wordmark displays; defaults to `magic circle`). No config file, no runtime reconfiguration, no admin UI for settings. Each deployed instance has its own values.

This stack is chosen partly for what it does not require: no compilation, no JSX, no migration tooling, no Webpack config to debug. The whole codebase should be readable in a single afternoon.

---

## Deployment

The deployment target is a managed platform-as-a-service with persistent disk support. Recommended primary: **Railway**. Acceptable alternatives: **Fly.io**, **Render** (paid tier — free tier does not have persistent disks). Not acceptable for v0: bare VPS deployment requiring nginx and SSL configuration; serverless platforms that do not support a long-running Node process and a writable disk.

**Persistent volume is a hard requirement.** The SQLite file must live on a persistent disk that survives redeploys. Most cheap hosting platforms ship with ephemeral filesystems by default — a redeploy wipes the database. The application must be configured to write the SQLite file to a mounted persistent volume (Railway calls this a "volume"; Fly calls it a "volume"; Render calls it a "disk"). The configuration must be checked into the repository so that re-deployments cannot accidentally lose the volume mount.

Suggested layout: SQLite file at `/data/magic-circle.db`, volume mounted at `/data`, with the path configurable via environment variable (`DATABASE_PATH`) so local development can use a relative path.

**Hello-world milestone.** Before any feature is built, the deploy path must be proven end-to-end. A first deployable version of the app should print "magic circle" to a hosted URL, with a SQLite file initialized on the persistent volume, and a manually-inserted row read back and rendered. This verifies: GitHub → Railway connection, Node runtime, SQLite write to persistent volume, and live URL serving. Only after this milestone passes should real features be built.

**Standing up an instance.** Each instance of Magic Circle is a separate deployment. To spin up a new one: create a new project on Railway (or equivalent), connect it to the same GitHub repository, add a persistent volume (mounted at the path you'll set for `DATABASE_PATH`), set the `DATABASE_PATH` and `INSTANCE_NAME` environment variables, and deploy. The new instance gets its own URL, its own SQLite file, and its own set of threads. No code changes needed to support multiple instances — the same build runs independently everywhere it's deployed. A code push to the repository triggers a redeploy on every connected project simultaneously, which keeps all instances on the same version. If you ever need to run a risky experimental build on one instance while keeping another stable, the workaround is a separate git branch per instance; for typical v0 use this will not come up.

**Updates.** New code is pushed to the GitHub repository; the platform redeploys automatically. The participant-facing URL stays stable across deploys. The persistent volume preserves the database.

**Domain.** v0 can live on the platform-provided URL (e.g. `magic-circle.up.railway.app`). A custom domain is not required and is deferred unless the deployer chooses to add one.

---

## Build Sequence

A loose order. Not a schedule, just a sequence that compounds — each milestone earns the right to start the next.

1. **Hello world deploy.** As described above. Proves the pipeline before there is anything to lose.
2. **Read-only forum.** Hard-coded threads and posts in the database, rendered through the index and thread views. No composer. Proves the read path, the templates, the typography, the layout.
3. **Posting.** New thread composer and reply composer wired up. Handle persistence in `localStorage`. Forms POST, server inserts, page reloads. Proves the write path.
4. **Containment.** robots.txt, X-Robots-Tag header, page title rules, removal of any default OG tags the framework adds. Proves the room is closed.
5. **Polish.** Text size toggle (desktop), the literary timestamp schema, sparse-state styling, the empty-state evocation with its once-per-session playback. The small things that make the room feel like a considered object.
6. **Quiet launch.** Deploy a fresh instance. Share the URL with the first few people. Watch what happens.

Each milestone is shippable. If something blocks a milestone, that block is a real signal — it is more important than the next milestone. Address it before continuing.

---

## What Is Not in v0

These are absences, and the absences are themselves the point. They are listed here so that the absence is intentional and traceable, not a thing to be quietly fixed later without remembering why it was missing in the first place.

- **No user accounts, profiles, or authentication.** Identity is the handle on each post, and it is owned by the browser, not the server.
- **No edit or delete.** The thread holds.
- **No nested replies.** Threads are flat. The threading question is open and v0 does not pre-commit.
- **No quote-reply, no @mentions.** Quoting is done in prose. Addressing is done by name.
- **No notifications of any kind.** No email, no push, no in-app badge. You arrive when you arrive.
- **No reactions, no upvotes, no likes.** No structured signal of approval. Approval is a reply, written in prose, or no reply.
- **No search.** Yet. The instance is small enough at v0 scale that scrolling serves; when it isn't, search becomes a real design question — what kind of search reinforces the principles, what kind betrays them.
- **No tags or categories.** A single instance is a single room.
- **No image uploads.** Text only. The forum is typographic. Image attachments are deferred until there is a clear principled reason to add them.
- **No rich text formatting.** Plain text body. Line breaks render as paragraph breaks. No markdown rendering, no bold/italic toolbar. The constraint is the form.
- **No moderation tools.** v0 has no moderator role, no ban list, no flagging. The instance is small enough and the URL-gate is closed enough that this is acceptable for v0. It will not be acceptable forever.
- **No analytics.** No Google Analytics, no Plausible, no Mixpanel, no first-party event logging. The deployer can read the SQLite file directly to see what is happening.
- **No federation.** Each instance stands alone.

Each of these absences is a position. Each is also reversible. The discipline is: do not reverse one without naming what changed.

---

## Provisional Positions on Open Questions

The Foundations document holds a list of open questions. Several of them require provisional answers for v0 to be buildable. Each position below is a working hypothesis, to be revised by what real use teaches.

- **What is the right unit of identity?** A handle on each post, browser-remembered. No accumulation visible to others initially. *Revisit when:* the room develops voices distinct enough that participants want to track them.
- **What does threading look like?** Flat, chronological, single-level. No nesting, no reply-to-post. *Revisit when:* a thread becomes long enough that flatness is breaking it.
- **What role does time play?** The literary timestamp schema (today / yesterday / day name / etc.). No reply windows, no read receipts, no edit windows (no edits exist). *Revisit when:* time-related friction shows up in real use.
- **What does moderation look like?** Not implemented in v0. The deployer is the implicit moderator by virtue of controlling the URL. *Revisit when:* a real conflict occurs that the room cannot resolve in-thread.
- **Lurking vs. participation?** Lurking is free (anyone with the URL can read without identifying themselves). Participation requires only a handle. *Revisit when:* the lurker-to-poster ratio is well off-balance in either direction.
- **Construct identity within constraints?** A handle string is the entire constructible identity surface in v0. *Revisit when:* there is something the handle cannot carry that voices want to carry.
- **Speak without permanent consequence?** No mechanism. The thread holds. If you would not want it to last, do not post it. *Revisit when:* this proves to be the wrong tradeoff in practice.
- **Magic circle technically?** Search engine suppression, no Open Graph, no public RSS, numeric thread URLs, no archive interface. The URL is the gate. *Revisit when:* containment is breached in a way the v0 design did not anticipate.
- **What form should entry friction take?** The URL itself, in v0. No fee, no invite flow, no lurking period. *Revisit when:* an instance grows to a size where the URL is no longer functioning as a gate.

Open questions not addressed above (federation, fork mechanics, sortition, scale-before-fork) are not in scope for v0 and need no provisional answer to ship.

---

## How to Tell When v0 Is Right

Per Design Brief: *can you read three posts in a row and feel like the experience was unobtrusive and pleasurable?* That is the AAA test for the reading experience.

The product-level equivalents:

- A first-time visitor can land on the URL, read the index, open a thread, read it, and leave — without confusion about what kind of place this is.
- A first-time poster can write a thread, sign it with a handle, submit, and see their post in the room — without an onboarding flow, without a tutorial, without a confirmation email.
- A returning visitor's handle is still there; they did not have to retype it.
- The room looks considered when sparse, not broken.
- An external link to a thread does not unfurl with a rich preview card. A Google search for the instance turns up nothing.
- The deployer can stand up a second instance, on a different URL, and the two do not know about each other.

If all of the above are true, v0 is doing what v0 is for. What it teaches us about Foundations is the next document.

---

## What This Document Does Not Decide

A v1 PRD will need to decide questions v0 deliberately defers — most of them downstream of what real use surfaces. The list to revisit, in rough order of likely urgency:

- **Edit and delete model.** If the no-edits position holds, why and how. If it does not, what authorization model replaces it.
- **Search.** What kind, scoped to what, with what visibility.
- **Threading.** Whether flat continues to serve, or whether some structured response mechanism earns its place.
- **Moderation.** When the URL-gate stops being sufficient, what replaces it. Per Foundations, not a permanent moderator class — closer to a jury drawn from trusted members.
- **Profiles or post-history-by-handle.** When the room starts wanting to track voices, what surface is honest to that without becoming a brand mechanism.
- **Multi-instance awareness.** If the project grows beyond solo dogfood, what (if anything) connects instances. Federation is the technical answer; the social answer is harder.
- **Entry friction beyond URL access.** When the URL stops working as a gate, what form the next layer takes — fee, invitation, lurking period, something else.

None of these are v0 decisions. All of them are v1 candidates.

---

*First draft: April 2026. To be revised by the build, then by the use, then by what the use teaches.*
