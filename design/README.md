# Design rules for abbasnadir.tech

This folder is the memory for the portfolio site in `../site`. Read this before changing anything visual or any copy, whether you are a person or an AI agent. Every rule here came from research done on 2026-11-07/08; sources are in [research.md](research.md).

Contents:

- `README.md`: the rules (this file)
- `research.md`: what the research found, with source URLs
- `tools/`: snapshot, screenshot and lint scripts (`tools/lint.sh` runs everything)
- `vendor/`: licensed copies of the anti-slop skills the rules come from
- `lint-history/`: linter output over time, so regressions are visible (`2026-11-08-before-*` is the first, Claude-default version; `<date>-hallmark.txt` / `<date>-gesso.txt` are written by `lint.sh`)
- `screenshots/`: dated review screenshots

## 0. The one-paragraph version

The site is a resume that happens to be a website. White paper, ink text, one grey, one cobalt accent used only on links and on the "hot" data path in diagrams. Rethink Sans for the name and headings, Source Serif 4 for body text, no monospace anywhere. Bold goes on job titles and project names; dates sit right-aligned in grey. No eyebrows, no numbered sections, no middle dots, no arrows on links, no status dots, no dashes in copy. Motion only where data moves: the packet wire under the masthead and the packets in the architecture diagrams. Every fact must be verifiable from the resume, a repo, or a PR. Run `design/tools/lint.sh` before committing.

## 1. Why these rules exist

The first version of this site was built in one prompt by Claude and landed on Claude's own house style: warm near-black background, vermilion accent, Fraunces serif, small uppercase mono labels, "§01" section numbers, a pulsing green "now" dot, `A · B · C` meta strings and `→` on links. Anthropic's own frontend-design skill lists almost every one of those as "the commonest tells of a generated page". Hallmark's linter scored it 19 FAIL / 13 REFLEX. The redesign brought that to 2 FAIL (a bundling artefact, see section 9) and 1 dismissed WARN.

The lesson: avoiding the old AI look (Inter, purple gradients, card grids) is not enough. Models have a second default, and banning one default pushes them into the next one. Choices have to be made for a reason specific to this page, then checked by a linter, not by eye.

## 2. Colour

Tokens live in `site/src/index.css` under `:root`. No colour literal appears anywhere else (Hallmark floor rule 48), including the canvas, which reads `--packet` and `--accent` with `getComputedStyle`.

| Token | Hex | Used for | Never used for |
| --- | --- | --- | --- |
| `--paper` | `#fbfcfd` | page background | |
| `--surface` | `#f1f3f6` | diagram panel only | cards (there are no cards) |
| `--ink` | `#17191e` | body text, headings | backgrounds |
| `--muted` | `#59606c` | dates, organisations, stack lists, captions, labels | anything clickable |
| `--rule` | `#dde1e7` | the single rule under each section heading, button border, footer top border | dividing every entry |
| `--packet` | `#a9b0bb` | plain packets, diagram edges and node outlines | text |
| `--accent` | `#1d44b8` | links, the hot path in diagrams, accent packets | headings, decoration, single highlighted words |
| `--accent-press` | `#142f80` | `:active` state of links and the button | |
| `--select` | `#d8e1fa` | `::selection` | |

Rules:

1. **One accent, and it means "you can click this" (or, in a diagram, "this is the main data path").** Five of ten well-regarded personal sites use no hue in body text at all; the rest use one accent on links. Resumes use black only.
2. **The accent never covers more than about 5% of a viewport** (Hallmark gate 23).
3. **Not cream, not near-black with a bright accent, not terracotta, not indigo, not emerald.** Cream `#F4F1EA` plus serif plus terracotta `#D97757` is Claude's default; near-black plus vermilion or acid green is its second default; indigo/violet is the GPT/v0/shadcn default; emerald is what models fall back to when indigo is banned.
4. **No pure `#fff` paper and no pure `#000` ink** (Hallmark 7b). Tint slightly cool, not warm, because warm off-white reads as the cream default.
5. **No gradients**, except the mask that fades the packet wire at its left and right edges. No gradient text, no gradient borders, no glows, no glassmorphism.
6. **Status is text, not colour.** "Merged" and "Open" on PRs are plain grey words. A second hue is only justified when it carries meaning that can't be said in words.

## 3. Typography

1. **Two families, clearly distinct.** Rethink Sans (variable) for the name, headings, entry titles, dates, labels, links in UI rows and buttons. Source Serif 4 (variable) for body text, bullets and descriptions. This mirrors Butterick's resume advice: a serif reading face with a sans for structure.
2. **No monospace anywhere**, including labels, dates, tags and captions. Mono labels are one of the strongest Claude tells, and almost no respected personal site uses mono outside code. If a code sample is ever added, it may use a mono face for that `<code>` only.
3. **Banned as defaults** (Hallmark `fonts.md`): Inter, Roboto, Open Sans, Lato, Poppins, Source Sans, Nunito, Montserrat, Raleway, Work Sans, DM Sans, Plus Jakarta Sans, system-ui, Arial, Helvetica; Merriweather, Lora, Georgia as body serif.
4. **Saturated, need a written argument**: Playfair Display, Cormorant Garamond, DM Serif Display, Fraunces, Instrument Serif, Recoleta, Space Grotesk, Hubot Sans, Bebas Neue, Unbounded, Geist, Instrument Sans, Mona Sans. Also avoid JetBrains Mono, IBM Plex Mono, Fira Code as "personality" faces.
5. **Before picking a display face, check it**: `node design/vendor/hallmark/scripts/theme.mjs check --face "<name>"` needs the full Hallmark repo; without it, compare against the lists above. Schibsted Grotesk and Hanken Grotesk were rejected this way because Hallmark themes already use them.
6. **Weights in running use: 400, 600, 700 only** (Hallmark F19: three at most). 700 is the masthead name and case-study title; 600 is headings, entry titles and `<strong>`.
7. **Sentence case everywhere.** No all-caps labels, no letter-spaced (tracked) labels, no small caps.
8. **No single italic or coloured word inside a heading** (Hallmark floor rule 3, Anthropic skill). Set a whole heading one way.
9. **Hierarchy goes: name > section heading > entry title > body.** Section headings must be bigger than the entry titles under them; when they were smaller they read as eyebrow labels and failed Hallmark gate 54.
10. `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs, `font-synthesis: none`, `font-variant-numeric: tabular-nums` on dates.
11. Body measure stays under about 70 characters (`--measure: 44rem` at 18px serif).

## 4. Layout and structure

1. **Single column, left-aligned, ragged right, capped and centred.** At wide screens the gutters grow; the measure does not.
2. **No top navigation bar on the homepage.** Wordmark-left, links-right, hairline-under is "the AI nav" (Hallmark gate 42). The homepage opens like a printed resume: name, one sentence, contact line. Case-study pages get a single "Abbas Nadir" link back.
3. **Section order follows the recruiter scan**: Experience, Projects with case studies, Education, Open source, Hackathons, Other projects, Skills. Education must exist; recruiters look for it.
4. **Entry pattern (from Jake's Resume)**: a bold title on the left and the date on the right in grey on one line, then the organisation in grey, then bullets. Right column holds dates or a one-word status only, never prose.
5. **Headings say something.** A bare "Projects" or "Work" before content is an announce-eyebrow (Hallmark gate 54). Use "Projects with case studies" or similar.
6. **No decorative structure.** No 01/02/03 or § numbering unless the content is truly a sequence (a timeline is; a list of projects is not). No eyebrow above the name. No rule between every entry; one rule under each section heading, and whitespace between entries.
7. **No cards.** No rounded boxes around entries, no "card inside card", no identical card grids, no bento grid, no hover lift. The diagram panel is the only filled surface.
8. **Hero rules (Hallmark 12, 13):** the name, one sentence (twelve words or fewer) and the contact actions are all visible at 1280 by 800 without scrolling. About 80 words per screen at most.
9. **Footer is short**: one line saying email is fastest, the address with a copy button, four plain links. Never the four-column footer with a social row and copyright.
10. `overflow-x: clip` on both `html` and `body`, never `hidden` or `100vw` (Hallmark floor 4).

## 5. Links and controls

1. Links are cobalt. **Inside running text (`p a`, `li a`) they are also underlined**, because cobalt against ink is about 2:1, under the 3:1 WCAG 1.4.1 needs when colour alone marks a link. Standalone link rows (contact line, project links, footer) are not underlined until hover. Gesso's `underlined-text` rule flags this; it is a deliberate, documented exception (`--slop-allow: underlined-text`).
2. Underlines: 1px, 2px on hover, offset 0.2em (Hallmark F11: never thicker than 2px or offset more than 0.25em).
3. **Link text is a verb or a name, never with an arrow glued on.** "Read the case study", "Source", "Play it". Not "case study →".
4. Every interactive element has `:hover`, `:active`, `:focus-visible` (instant, 2px cobalt outline) and, for buttons, `:disabled`.
5. One button style on the whole site. The copy button is outline only: border, no fill. (Vite's minifier turns `transparent` into `#0000`, which Gesso misreads as a filled card, hence the `--slop-allow: redundant-border` and `data-slop-allow` on it.)
6. Themed browser surfaces: `::selection`, `caret-color`, `scrollbar-color`.

## 6. Motion and the particle effects

1. **Motion only where something actually moves.** Three effects, each with a reason:
   - The packet wire under the masthead: packets travel left to right like traffic; accent packets are pulled toward the pointer, plain ones pushed away. It is the page's one signature element.
   - Packets travelling along architecture-diagram edges, showing the real request path.
   - A small particle burst when the copy button is pressed (motion that answers a user action, which the Anthropic skill explicitly allows).
2. **Never**: fade-and-slide-up on every section, hover transitions on every card, bounce easing, scroll-jacking, splash loaders, ticker bars, pulsing status dots, `transition: all`, animating `width`/`height`/`top`/`left`.
3. **Every animation has a `prefers-reduced-motion: reduce` path**: the wire draws one static frame, the diagrams show static edges with no packets, the burst is skipped.
4. **Cheap by construction**: canvas DPR capped at 2, packet count scaled to area and capped, the animation loop stops when the canvas is off-screen (IntersectionObserver) or the tab is hidden.
5. Diagram packets start mid-flight with negative SMIL `begin` values, so none sit at (0,0) waiting.

## 7. Copy

Sources: the anti-ai-slop-writing skill, Wikipedia "Signs of AI writing", the Anthropic skill's writing section, Gesso's copy guards.

1. **Every fact must be verifiable.** Commit counts come from the GitHub API; PR numbers and states were checked; project claims come from READMEs and the resume. Never invent a metric, user count, testimonial or logo. If a number is not measured, say so ("50 is the limit I designed for; I haven't measured it yet").
2. **Site, resume, README and LinkedIn must agree.** Reviewers cross-check, and mismatches read as fabrication. One public email: `abbasnadir.dev@proton.me`. LeetCode 1492 is a contest *rating*, never a "rank".
3. **No dashes as punctuation in copy**, em or en. Date ranges use "to" ("May to Jul 2026"); numeric ranges too ("2 to 50 players").
4. **Typographic quotes and apostrophes** (“ ” ’), never straight ones in prose.
5. **Banned constructions**: "not X but Y" / "X, not Y" rebuttals; colon-reveal headlines ("I build backends: the ..."); fragment triplets ("Fast. Simple. Powerful."); a short final sentence restating the paragraph as a maxim; "As a [role], I...".
6. **Banned words** (selection; full list at the anti-ai-slop-writing repo): delve, tapestry, landscape (figurative), testament, vibrant, pivotal, crucial, intricate, meticulous, seamless, robust (outside engineering), leverage (verb), utilize, showcase/showcasing, elevate, empower, supercharge, unlock, streamline, quietly, silently, genuinely, thoughtful, intentional, crafting, digital experiences, passionate.
7. **Don't default to three.** Use two, four, one, five items. Vary sentence length; never three similar-length sentences in a row. Use contractions.
8. **Be specific**: name the real thing (Express, Zod, TTL index, IGameMode registry) instead of a category ("modern tools", "scalable architecture").
9. **Include what didn't work.** SureStep's simulated-keypoint fallback is stated plainly. Honest friction reads as human; uniformly polished success reads as generated.
10. **Labels are body face, one step smaller, sentence case.** "Role", "When", "Stack", "Links". Never `ROLE` or `role` in mono.
11. Summaries on project entries and case-study leads: twelve words or fewer (Hallmark 58).
12. Fields marked `// DRAFT` in `site/src/content.ts` are placeholders Abbas must rewrite in his own voice before publishing: the masthead summary and each "What I'd do next".

## 8. Case studies

Structure, in this order: title, one-sentence lead, a meta list (Role, When, Stack, Links), the architecture diagram, The problem, What I built, Decisions and what they cost, What didn't work (when true), What I'd do next, a link to the next case study.

Each decision has three parts: the choice, why, and what it cost. The cost is the part interviewers ask about; never skip it.

Diagrams are data in `content.ts` (`nodes`, `edges`, `hot`, `both`, `bend`), drawn by `FlowDiagram.tsx`. Node boxes are outlines with no fill. The accent outline marks the component Abbas owned or the centre of the system. Every diagram has an `aria-label` that reads out the edges.

## 9. Workflow before committing

1. `design/tools/lint.sh` builds the site, serves it, renders snapshots, runs Hallmark's `sloplint` (vendored, zero dependencies) and Gesso's `npx @gessobuild/anti-slop`, and saves dated output to `lint-history/` plus screenshots.
2. **Look at the screenshots**, at least the hero, mobile and one full case study. Linters miss composition problems; the screenshots caught overlapping diagram labels and a misaligned hero that no rule flagged.
3. **Expected, accepted findings** (anything else is a regression):
   - Hallmark FAIL 20 "no Hallmark stamp": the stamp is line 1 of `site/src/index.css`, but Vite strips CSS comments from the bundle. Not a design issue.
   - Hallmark WARN 58 on case-study pages (over 450 words): dismissed in the stamp; a case study is a long document the reader chose to open.
   - Gesso `underlined-text`: prose-link underlines kept for WCAG 1.4.1 (section 5).
   - Gesso `overstuffed-row` (advisory): resume entries have a title, date, line and links by design.
4. Update the stamp comment at the top of `site/src/index.css` when the design changes. Format: `/* Hallmark · pre-emit critique: P H E S R V scores · weakest: <axis>, <why and what was done> */`. Axes: Philosophy, Hierarchy, Execution, Specificity, Restraint, Variety, each 1 to 5; anything under 3 means revise first. Never invent a weakness to fill the field.
5. Mirror test before any new design decision: would a neighbouring prompt ("portfolio for a backend developer") produce this exact choice? If yes, change it or write down why it is still right.

## 10. Gotchas from building this

- `pkill -f "vite preview --port 4317"` also kills the shell that runs it. Kill the preview by PID (`lint.sh` does).
- `vite preview` caches its file list at start; after a rebuild with new hashed asset names, restart it or pages render stale.
- Firefox `--headless --screenshot` fires before animation frames run, so canvas effects look empty; use Chromium through `tools/screenshots.mjs`, which waits two seconds and moves the pointer.
- The minifier changes values linters key on: `background: none` becomes `0 0`, `transparent` becomes `#0000`, comments disappear.
- GitHub Pages has no SPA rewrites; `site/scripts/spa-routes.mjs` copies `index.html` into each `/work/<slug>/` route and `404.html`, and writes `sitemap.xml` and `robots.txt`. Add new case studies to `content.ts` and the script picks up their slugs.
