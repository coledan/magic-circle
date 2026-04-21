# Design Decisions
## Magic Circle — Working Log

*A running record of design decisions made, with brief rationale. Intended as reference for the PRD and for Cursor during the build. Add decisions as they are made; do not remove old ones.*

---

## Typography

| Decision | Value | Rationale |
|----------|-------|-----------|
| Body typeface | Newsreader Text (Production Type) | Designed specifically for continuous on-screen reading. Warm, sturdy, optical sizing built in. Free via Google Fonts. |
| UI / meta typeface | DM Sans | Neutral sans for contrast against serif body. Present but subordinate — never used for content. |
| Body size (default) | 19px | Generous enough to reward unhurried reading. At this size the measure gives 65–70 characters per line. |
| Body size (large / Aa) | 22px | Proportional step up. Same line height. |
| Line height (body) | 1.5 | Tested across 1.4–1.75. 1.5 has enough air without lines feeling detached. |
| Title size (index) | 21px | Larger than body. Titles are headings, not subject lines. |
| Title size (thread view) | 24px | Slightly larger still — functioning as a proper heading in context. |
| Title line height | 1.35 | Tighter than body. Multi-line titles hold together better. |
| Measure (content column) | 580px | Calibrated for optimal line length at body size. |
| Contrast standard | WCAG AAA (7:1+) | All body and content text. Small decorative UI elements (controls, site name) are AA only — noted as known exception. |
| Text colors (dark mode) | Titles #efefef (~14.8:1), Body #d4d4d4 (~11.5:1), Author #b4b4b4 (~8.6:1), Meta #a8a8a8 (~7.6:1) | All clear AAA against #1a1a1a background. |
| font-optical-sizing | auto | Browser serves correct Newsreader optical cut at each size automatically. |

---

## Color & Theme

| Decision | Value | Rationale |
|----------|-------|-----------|
| Background (dark) | #1a1a1a | Neutral near-black. No warmth. Referenced from Claude's own dark UI. |
| Input/surface (dark) | #242424 | Slightly lighter than page background. Same logic as Claude input field. |
| Rule color (dark) | #2a2a2a | Hairline rules for post separation. Barely visible, just enough. |
| Palette character | Neutral, no warmth | Earlier warm palette tested but felt mismatched against true near-black. Neutral throughout. |
| Light mode | Warm off-white (#f0f0f0) with near-black text | Book-like. Equal citizen to dark mode, not an inversion. |
| Theme behavior | Follows OS via `prefers-color-scheme` | No user toggle in v0. Removes a control, a decision on every load, and a persisted preference. Toggle can be added later if real use surfaces the need. |

---

## Layout & Structure

| Decision | Value | Rationale |
|----------|-------|-----------|
| Post containers | No cards | Posts sit directly on background, separated by hairline rule and space. Cards added visual weight that competed with reading. |
| Post separation | 0.5px rule + 1.75rem padding | Enough separation to feel like distinct documents. |
| Byline position | Below post body | Author revealed after reading, not before. Writing earns its reading before identity is declared. |
| Header layout | Site name left, controls right | Site name in Newsreader italic. Small and quiet. |
| Back navigation | "← all threads" top right in thread view | Minimal. Does not compete with content. |

---

## Meta Row

| Decision | Value | Rationale |
|----------|-------|-----------|
| Meta content | Author + timestamp only | Minimum useful information. No reply count, no tag (deferred). |
| Meta typeface treatment | DM Sans, 10px, tracked uppercase (letter-spacing: 0.1em) | Distinct from body serif. Tracked uppercase creates clear hierarchy against thread titles. |
| Separator character | ◆ | Geometric, quiet, slightly more considered than middot. Typographic pedigree without misuse. |
| Separator spacing | 0.6em each side (medium) | Elements read as distinct but connected. Tested tight/medium/loose. |
| Timestamp schema | Human/literary, precision decreasing with distance | Today: time of day ("9:04 am", "this morning"). Yesterday: "yesterday". This week: day name ("wednesday"). Last week: "last friday". 2–4 weeks: "a few weeks ago". 1–2 months: "last month". Further: sparse date ("18 april"). Much further: month + year ("march 2025"). |
| Timestamp style | Upright (not italic) | Italic tested, ruled out for now. |

---

## Interaction & Controls

| Decision | Value | Rationale |
|----------|-------|-----------|
| Text size toggle (Aa) | Scales body 19→22px on desktop; not rendered on mobile | Accessibility. Mobile relies on browser pinch-zoom and system font-size controls; the narrow header has higher-priority claimants. |
| Reply textarea typeface | Newsreader, same size/line height as body | Compose experience belongs to the reading experience. Not a context switch. |
| Placeholder tone | "take your time with this." / "there's no rush" | In register with the forum's pace. Not SaaS copy. |
| Submit button | Ghost style, "post reply" / "start thread" | Minimal. Does not demand attention. |

---

## Mobile

| Decision | Value | Rationale |
|----------|-------|-----------|
| Mobile stance | Equal citizen with desktop | Reading is the primary activity; phones are reading devices. Not a corner case. |
| Content column (mobile) | `min(580px, 100vw - 40px)` | Fluid below desktop measure with 20px padding each side. ~50 chars per line on a 390px viewport — short of the 65–70 ideal but well within comfortable reading range. |
| Body size on mobile | 19px (no step-down) | Newsreader's optical sizing handles small-screen rendering. Stepping down preemptively would treat mobile as lesser. |
| Meta type on mobile | 11px DM Sans tracked uppercase | Desktop's 10px reads as fiddly on phone viewports. 1px bump preserves hierarchy without sacrificing legibility. Applies to bylines, back links, composer labels, handle labels. |
| Header on mobile | Wordmark + "new thread" only | Text size toggle dropped; theme toggle absent everywhere per system-pref decision. |
| Touch targets | Minimum 36px in narrow dimension | Header links, back link, submit buttons. Visual sizing of labels stays at decided sizes; padding provides hit area. |
| Soft keyboard handling | Native, no sticky elements | When keyboard pushes submit off-screen, the reader scrolls. No custom viewport locking. |
| SVG text rendering | iOS Safari clips tall decorative glyphs at the line-box boundary inside SVG `<text>` elements | Render display-sized symbols (◆, ¶, ※ at large size) as HTML overlay over SVG, not as `<text>` elements. Pattern: `<span>` absolutely positioned with `transform: translate(-50%, -50%)`, `line-height: 1.5`, `padding: 0.25em 0`. Small meta-row ◆ at 11px is safe as native text. |

---

## Empty State

| Decision | Value | Rationale |
|----------|-------|-----------|
| Empty state treatment | Drawn-circle evocation | The forum is named after Huizinga's magic circle. The empty state enacts the founding moment by drawing the circle. Departure from conventional "no content yet" copy. |
| Circle size | 100% of content column on mobile, 400px max on desktop | Big enough to function as an evocation. Rest of design is so quiet the founding moment deserves the space. |
| Circle stroke | 1.5px, in `--meta` color | Constant absolute weight regardless of rendered size. Reinforces "ink on paper" — the contrast between thin line and large gesture is the point. |
| Drawing animation | 2.2s, `cubic-bezier(0.45, 0, 0.12, 1)` | Pronounced ease-out. Fast at start, noticeable slow at the end as the wizard closes the loop. |
| Spark | Bright dot (3.2 SVG units) + soft halo (9 SVG units, opacity 0.4) | Rides the leading edge of the drawing line. Halo in `--author`, core in `--title`. Fades out at end of orbit. |
| Symbols inside circle | ¶ → ※ → ◆ (cycle, settle on ◆) | Pilcrow (writing's most native mark) → reference mark (scholarly) → diamond (project's chosen). A small typographic incantation in place of arcane sigils. |
| Symbol size | 25cqw (container-query units) with 88px fallback | Scales proportionally with circle. ~88px at 350px circle, ~100px at 400px. Display-scale typography. |
| Symbol timing | ¶ at 2.3s, ※ at 2.9s, ◆ at 3.5s (settles) | Each cycling symbol holds ~0.5s with overlapping crossfades. Diamond settles and stays. |
| "begin" link | Italic Newsreader, 19px, `--author` color, fades in at 4.2s | Below the circle, in same register as the wordmark. Routes to new-thread composer. |
| Animation playback | Once per session via `sessionStorage` flag | The animation is the founding gesture. Repeating it on every visit cheapens it. Subsequent visits show the completed circle with ◆ + "begin", no animation. |
| Symbol rendering | HTML `<span>` overlay positioned over the SVG | iOS Safari clips tall glyphs inside SVG text. See Mobile section for the full pattern. |

---

## Project

| Decision | Value | Rationale |
|----------|-------|-----------|
| Project name | magic circle | References Huizinga's concept directly. The bounded space where play and thought happen. Replaces earlier name "a little offline." |
| Stack | Node + SQLite (planned) | Decided in earlier session. Full ownership of every design decision. |
| Build approach | From scratch, not Discourse | Discourse's mechanics would subtly shape behavior. The design philosophy requires full ownership. |

---

## Deferred / Open

- Tag system: exists in JTBD but not yet in prototype or meta row. No display decision made.
- 8×8 pixel avatar grid: proposed, not designed. Philosophically coherent with identity-as-accumulation principle.
- ◆ color variation: proposed (color based on thread age or earned state). Not yet designed.
- Entry mechanic: fee vs. invitation vs. lurking period — not decided.
- Light mode: established in code, not yet given equal design attention.
- Federation: held until community model is clearer.

---

*Last updated: April 2026*
