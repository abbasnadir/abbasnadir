# Design rules for abbasnadir.tech

This folder is the memory for the portfolio site in `../site`. Read this before changing anything visual or any copy, whether you are a person or an AI agent. Every rule here came from research done on 2026-11-07/08; sources are in [research.md](research.md).

Contents:

- `README.md`: the rules (this file)
- `research.md`: what the research found, with source URLs
- `tools/`: browser, snapshot, screenshot, interaction and lint scripts (`tools/lint.sh` runs everything)
- `vendor/`: licensed copies of the anti-slop skills the rules come from
- `lint-history/`: linter output over time (`2026-11-08-before-*` is the first, Claude-default version; `<date>-hallmark.txt`, `<date>-gesso.txt` and `<date>-interactions.txt` are written by `lint.sh`)
- `screenshots/`: dated review screenshots

## 0. The one-paragraph version

A resume-first portfolio in Vite, React and Tailwind v4. White paper, ink text, one grey, one cobalt accent used only for things you can click. Rethink Sans for names and headings, Source Serif 4 for reading text and the same sans for code excerpts: no monospace anywhere. Bold goes on job titles and project names; dates sit right-aligned in grey. **Projects are shown with real evidence**: a screenshot of the live app, an excerpt of the project’s own code linked to the file, and one proof line. Never diagrams or flowcharts standing in for the work. The hero has a band of packets moving on a wire; smaller motion (link underlines, the nav indicator, the timeline) uses **threads**. No gradients, no cards, no eyebrows, no numbered sections, no middle dots, no arrows on links, no status dots, no dashes in copy. Motion is swift (120 to 320ms), transform or opacity only, tied to a user action or to data moving, and off under reduced motion. Every fact must be verifiable from the resume, a repo, or a PR. Run `design/tools/lint.sh` before committing.

## 1. Why these rules exist

The first version of this site was built in one prompt by Claude and landed on Claude's own house style: warm near-black background, vermilion accent, Fraunces serif, small uppercase mono labels, "§01" section numbers, a pulsing green "now" dot, `A · B · C` meta strings and `→` on links. Anthropic's own frontend-design skill lists almost every one of those as "the commonest tells of a generated page". Hallmark's linter scored it 19 FAIL / 13 REFLEX.

The lesson: avoiding the old AI look (Inter, purple gradients, card grids) is not enough. Models have a second default, and banning one default pushes them into the next one. Choices have to be made for a reason specific to this page, then checked by a linter and by looking at screenshots.

History:

- v1 (2026-11-07): single page, Claude default look. 19 FAIL.
- v2 (2026-11-08): single-page resume layout, plain CSS. Down to the stamp artefact.
- v3 (2026-11-08): multi-page portfolio in Tailwind, threads and shapes, more motion. Hallmark: only FAIL 20 (stamp artefact) plus the dismissed word count; Gesso: only the accepted prose underlines; interactions: 12 of 12 pass.
- v4 (2026-11-10): Abbas’s verdict on v3 was “doesn’t feel like portfolio material” and “the flowcharts are senseless”. Rebuilt around the content strategy of strong portfolios (research.md): a short home page with three featured projects that each carry real evidence and a proof line, a “How it works” page per project, and an archive table for everything else. The packet wire is back in the hero; the thread band and all diagrams are gone. MetricFlow left the featured list (Abbas: unfinished and not novel).

## 2. Pages

| Route | Job | Contents |
| --- | --- | --- |
| `/` | Orient in one screen, then prove it | Name, two short sentences, one bio line linking the internship, the Nextcloud patch and the hospital work, three links; the packet wire; Selected work (3 rows: name, date, summary, proof line, stack, How it works / Live / Code, and the project’s evidence on the right); Experience (3 rows); Patches sent upstream; What I’m doing now |
| `/projects/:slug` | Prove depth (“How it works”) | Title, lead, Role/When/Stack/Links, screenshot, The problem, Where it started, How it works (paragraphs with code excerpts), Decisions and what they cost, What’s missing, What I’d do next, next project |
| `/archive` | Everything else | One table, newest first: year, project with one line, built with, links (“Private” when there’s no public code) |
| `/about` | The person | Bio (DRAFT), experience timeline, education, hackathons, skills; photo when Abbas provides it |
| `/resume` | The one-page resume as HTML | Same order and emphasis as the PDF; Download and Print links; printable |
| `*` | Recover | A cut thread, a plain sentence, two ways back |

Featured projects are the ones with real backend work Abbas can stand behind: Hangman V2, the Digikraft restaurant ordering app (text only, the code is the company’s) and bwars-helper. Three to five is the range strong portfolios use; add one only when it has evidence to show.

Adding a route means adding it in `site/src/App.tsx` **and** in the `pages` list in `site/scripts/spa-routes.mjs` (GitHub Pages has no SPA rewrites), and adding it to `design/tools/snapshot.mjs` so it gets linted.

Content lives only in `site/src/content.ts`. Pages never hard-code facts.

## 3. Colour

Literal hex values live in one plain `:root` block at the top of `site/src/index.css` and nowhere else. Tailwind’s default palette is wiped (`--color-*: initial`) and the theme maps to the tokens with `@theme inline`, so classes like `bg-indigo-500` or `text-emerald-600` do not exist. The canvas reads the same tokens with `getComputedStyle`.

| Token | Tailwind | Hex | Used for | Never used for |
| --- | --- | --- | --- | --- |
| `--paper` | `paper` | `#fbfcfd` | page background, node fills | |
| `--surface` | `surface` | `#f1f3f6` | behind code excerpts only | cards (there are none) |
| `--ink` | `ink` | `#17191e` | text, headings, current nav item | backgrounds |
| `--muted` | `muted` | `#59606c` | dates, organisations, stack lists, captions, labels, inactive nav | anything clickable |
| `--rule` | `rule` | `#dde1e7` | one rule under each section heading, row separators, screenshot border, button border | boxes around content |
| `--packet` | `packet` | `#a9b0bb` | plain packets on the wire, timeline thread and nodes | text |
| `--accent` | `accent` | `#1d44b8` | links, current-page thread, accent packets, current role node | headings, decoration, a highlighted word |
| `--accent-press` | `accent-press` | `#142f80` | `:active` | |
| `--accent-ink` | `accent-ink` | `#fbfcfd` | text on an accent fill | |
| `--select` | `select` | `#d8e1fa` | `::selection` | |

Rules:

1. **One accent, meaning "you can click this".** The only decorative uses are a few packets on the wire and the current-role node. It never covers more than about 5% of a viewport (Hallmark 23).
2. **Not cream, not near-black with a bright accent, not terracotta, not indigo, not emerald.** Cream `#F4F1EA` with serif and terracotta `#D97757` is Claude’s default; near-black with vermilion or acid green is its second; indigo is the GPT/v0/shadcn default; emerald is the fallback after indigo is banned.
3. **No pure `#fff` or `#000`** (Hallmark 7b). Tint slightly cool, never warm.
4. **Shapes instead of gradients.** No gradients anywhere, including masks: packets on the wire fade near the edges through their own alpha in the canvas. No gradient text or borders, no glows, no glassmorphism, no shadows (Tailwind’s shadow scales are wiped too).
5. **Status is text.** “Merged”, “Open”, “Third prize” are grey words, never coloured pills.

## 4. Typography

1. **Two families.** Rethink Sans (variable) for the wordmark, page and section headings, entry titles, dates, labels, nav, buttons and standalone links. Source Serif 4 (variable) for body text, bullets and descriptions. This is Butterick’s resume pattern: serif to read, sans to structure.
2. **No monospace anywhere**, Abbas’s rule. Not for labels, dates, tags, captions or numbers (use `tabular-nums` on the sans instead), and not for code excerpts either: they use the sans with whitespace kept (`.code`). Mono outside code is one of the strongest Claude tells.
3. **Banned as defaults** (Hallmark `fonts.md`): Inter, Roboto, Open Sans, Lato, Poppins, Source Sans, Nunito, Montserrat, Raleway, Work Sans, DM Sans, Plus Jakarta Sans, system-ui, Arial, Helvetica; Merriweather, Lora, Georgia as the body serif.
4. **Saturated, need a written argument**: Playfair Display, Cormorant Garamond, DM Serif Display, Fraunces, Instrument Serif, Recoleta, Space Grotesk, Hubot Sans, Bebas Neue, Unbounded, Geist, Instrument Sans, Mona Sans; JetBrains Mono, IBM Plex Mono and Fira Code as “personality” faces. Schibsted Grotesk and Hanken Grotesk are used by Hallmark catalog themes, so they read as picked from a list.
5. **Weights: 400, 600, 700 only** (Hallmark F19). 700 for page titles and the masthead name, 600 for headings, entry titles and `<strong>`.
6. **Sentence case everywhere.** No all-caps, no tracked labels, no small caps.
7. **No single italic or coloured word inside a heading.**
8. **Hierarchy: page title > section heading > entry title > body.** Section headings must be bigger than the entry titles under them, otherwise they read as eyebrows (Hallmark 54). Headings say something specific: “Selected work”, “Patches sent upstream”, “What’s missing”, never a bare “Projects” or “Work” above content (the page title “Work” is fine).
9. `text-wrap: balance` on headings, `pretty` on paragraphs, `font-synthesis: none`, `tabular-nums` on dates and counts.
10. Reading measure is capped at 44rem (`max-w-page`), under about 70 characters of 18px serif.

## 5. Layout

1. **One frame, one left edge.** Every page sits in the same centred 66rem frame (`max-w-wide`). Reading content is capped at 44rem inside it and stays **left-aligned**, so the wordmark, page titles, headings and text start at the same x on every page and nothing jumps during navigation. Only the Selected work list and the archive table use the full frame. Use the `Container` component; never centre a narrow column on its own.
2. **Nav: a left cluster after the wordmark**, current page marked by an accent thread under the link. No hairline under the header, no right-aligned link group, no button on the right (that is “the AI nav”, Hallmark 42).
3. **Entries follow Jake’s Resume**: bold title left, grey date right on one line, organisation in grey, then bullets. The right column holds a date or a one-word status, never prose.
4. **No cards.** Separation is whitespace plus one rule under each section heading, or a rule between repeated rows. The only filled surface is the panel behind a code excerpt.
5. **No decorative numbering.** The experience timeline is the one real sequence on the site, so it is the one place with a structural marker (a thread with nodes).
6. **Hero rules (Hallmark 12, 13):** the name, two sentences of twelve words or fewer, the bio line and the links fit in 1280 by 800 above the fold. Page leads are one sentence of twelve words or fewer.
7. **Footer**: one line saying email is fastest, the address with a copy button, four plain links. Never the four-column footer.
8. `overflow-x: clip` on `html` and `body`, never `hidden` or `100vw`.

## 6. Evidence, the wire and threads

**Evidence is the visual.** Strong portfolios show the work itself, so every featured project shows something real:

- a screenshot of the live app (`design/tools/capture-hangman.mjs` captures Hangman; screenshots live in `site/public/img/`),
- an excerpt of the project’s own code, a short complete unit (a whole game mode, one method), with a caption linking the exact file on GitHub,
- one proof line under the summary: where it runs, who uses it, what it’s connected to.

Never draw diagrams, flowcharts or architecture boxes in place of the work. v3 had them and Abbas called them senseless. If a project has nothing real to show (private company code), it gets text only and says why.

**The wire** (`components/PacketField.tsx`, home only). Short packets travel left to right across a 9rem band under the masthead; about one in eight is accent. Plain packets are pushed away from the pointer and accent ones are pulled toward it. Packets fade near both edges by their own alpha.

**Threads** are for the smaller motion. Straight lines only, never waves or wobbles:

1. **Link threads.** Standalone links draw a thread underline from the left on hover.
2. **Nav thread.** A 2px accent line under the current page that slides between items through a view transition.
3. **Timeline** (`Timeline`, about). A vertical thread that draws downward on first view, with nodes popping in one after another. Current role is the accent square; past roles are circles.
4. **Copy burst.** Pressing the copy button throws a ring of small squares and circles.
5. **404.** A thread cut in the middle between a circle and the accent square.

## 7. Motion

The user asked for more animation, swift. The constraints that keep it from becoming “AI motion”:

1. **Durations**: `--dur-fast` 120ms (colour, press), `--dur-base` 180ms (threads, pop, page fade-in), `--dur-slow` 320ms; one-off draws up to 600ms. Easing `--ease` `cubic-bezier(0.2, 0.8, 0.2, 1)`: fast out, no overshoot. Never bounce easing.
2. **Transform and opacity only.** Never animate `width`, `height`, `top`, `left`, margins or padding. Never `transition: all`. Tailwind’s `transition`, `transition-colors` and `transition-all` utilities are blocked with `@source not inline(...)` because they also animate `outline-color`, which makes focus rings fade in (Hallmark 15). Write explicit properties: `transition-[color]`.
3. **Every effect answers something.** A user action (hover, press, navigate, copy, pointer over the wire) or data moving (packets). No ambient decoration.
4. **Entrance effects run once** (`useSeen`), and only on things that have a structure to reveal (the timeline). Never fade-and-slide-up on every section: that is the generic AI default.
5. **Page transitions** use the View Transitions API through React Router’s `viewTransition` prop on every internal `Link`/`NavLink`: old page fades out in 120ms, new page fades in over 180ms, the page title (`.page-title`) morphs, and the nav thread slides.
6. **Reduced motion**: a global rule cuts all animation and transition to 1ms and disables view transitions. The wire draws one static frame, the copy burst is skipped.
7. **Cheap**: canvas DPR capped at 2, packet count scaled to width and capped, loops pause off-screen and in hidden tabs.

## 8. Links and controls

1. Links are cobalt. **Links inside running text keep an underline**, because cobalt on ink is about 2:1, under the 3:1 WCAG 1.4.1 needs when colour alone marks a link. **Standalone links use `.ui-link`**: no underline at rest, a thread draws in on hover and focus. Gesso flags the remaining underlines (`underlined-text`); that is accepted.
2. Underline: 1px, 2px on hover, offset 0.2em (Hallmark F11).
3. **Link text is a verb or a name.** “How it works”, “Live”, “Code”, “Everything else I’ve built”. Never an arrow glued on.
4. Every control has hover, `:active` (`.press` scales to 0.97 in 120ms), instant `:focus-visible` (2px accent outline), and `:disabled` for buttons.
5. One outline button style site-wide (the copy button).
6. Themed browser surfaces: `::selection`, `caret-color`, `scrollbar-color`.

## 9. Copy

1. **Every fact must be verifiable.** Commit counts come from the GitHub API, PR states were checked, project claims come from READMEs and the resume. Never invent a metric, user count, testimonial or logo. If something isn’t measured, say so.
2. **Site, resume, README and LinkedIn must agree.** One public email: `abbasnadir.dev@proton.me`. LeetCode 1492 is a contest rating, never a “rank”.
3. **No dashes as punctuation.** Ranges use “to” (“May to Jul 2026”, “2 to 50 players”).
4. **Typographic quotes and apostrophes** in prose.
5. **Banned constructions**: “not X but Y” and “X, not Y”; colon-reveal headlines (“I build backends: the ...”); fragment triplets; a closing maxim; “As a [role], I...”.
6. **Banned words** (selection; full list in the anti-ai-slop-writing repo): delve, tapestry, landscape, testament, vibrant, pivotal, crucial, intricate, meticulous, seamless, robust (outside engineering), leverage (verb), utilize, showcase, elevate, empower, supercharge, unlock, streamline, quietly, silently, genuinely, thoughtful, intentional, crafting, digital experiences, passionate.
7. **Don’t default to three.** Vary sentence length. Use contractions.
8. **Be specific**: name the real thing (Express, Zod, CoreGameMode, interaction_check). Check names against the code before writing them; v3 described an `IGameMode` interface that the code doesn’t have.
9. **Include what didn’t work**, plainly.
10. **Labels are the sans, one step smaller, sentence case**: “Role”, “When”, “Stack”, “Links”.
11. **Project summaries and page leads: twelve words or fewer.**
12. Fields marked `// DRAFT` in `content.ts` must be rewritten by Abbas in his own voice: the masthead summary and lede, the bio line, the bio, the “now” line, each “What I’d do next”, and the problem statements Abbas hasn’t confirmed.
13. Only list projects with real work behind them. Repos that are untouched `create-next-app` templates (giveNtake) or single-commit templates (multi-widget) stay off the site.

## 10. Project pages (“How it works”)

Order: title, one-sentence lead, Role/When/Stack/Links, screenshot (if any), The problem, Where it started (the first version and why it changed), How it works (short paragraphs, each optionally followed by a code excerpt), Decisions and what they cost, What’s missing, What I’d do next, next project. About five minutes to read.

Each decision has three parts: the choice, why, and what it cost. The cost is what interviewers ask about; never skip it.

“What’s missing” is required and plain: no tests, not load-tested, no README. Honest limits read as more credible than a polished claim.

Content is data in `content.ts` (`Project`, `Evidence`). Code excerpts are copied from the repo verbatim apart from trimming; link the exact file.

## 11. Tailwind conventions

- Tailwind v4 through `@tailwindcss/vite`; there is no `tailwind.config.js`. Everything is configured in `site/src/index.css`.
- Order in that file: the Hallmark stamp comments (must stay first), `@import 'tailwindcss'`, `@source not inline(...)`, the `:root` palette and motion tokens, keyframes, `@theme` (wipes defaults, sets fonts and container widths), `@theme inline` (maps colours to tokens), `@layer base`, `@layer components`, view-transition rules, reduced motion, print.
- Use utilities for layout and spacing (default 4px scale). Put things utilities can’t express in `@layer components`: `.ui-link`, `.nav-thread`, `.page-title`, `.press`, `.wire`, `.code`, timeline styles, the spark burst.
- Custom CSS uses the raw tokens (`var(--accent)`), not `var(--color-accent)`: Tailwind may not emit theme variables it thinks are unused.
- Tailwind has no theme namespace for durations; use `duration-[120ms]` or the CSS variables.
- Shared components in `components/ui.tsx`: `Container`, `PageHeader`, `Section`, `EntryHead`, `LinkRow`, `UiLink`. Use them so spacing and the left edge stay consistent.

## 12. Workflow before committing

1. `design/tools/lint.sh` builds the site, serves it, renders snapshots of every page type, runs Hallmark’s `sloplint` (vendored) and Gesso’s `npx @gessobuild/anti-slop`, runs `interactions.mjs` (the wire, nav transitions, project pages and their evidence, archive, timeline, copy), and takes screenshots into `screenshots/<date>/`.
2. **Look at the screenshots**: hero, mobile, reduced motion, and the full pages. Linters missed the misaligned left edges between pages; the screenshots caught it.
3. **Expected, accepted findings** (anything else is a regression):
   - Hallmark FAIL 20 “no Hallmark stamp” on each snapshot: the stamp is line 1 of `site/src/index.css`, but Vite strips CSS comments from the bundle.
   - Hallmark WARN 58 on project pages (over 450 words): dismissed in the stamp.
   - Gesso `underlined-text`: prose-link underlines kept for WCAG 1.4.1.
   - Gesso `overstuffed-row` (advisory): resume entries carry title, date, line and links by design.
4. Update the stamp comment at the top of `site/src/index.css` when the design changes. Format: `/* Hallmark · pre-emit critique: P H E S R V scores · weakest: <axis>, <why and what was done> */`. Axes: Philosophy, Hierarchy, Execution, Specificity, Restraint, Variety, 1 to 5; under 3 means revise first.
5. Mirror test before any new design decision: would a neighbouring prompt (“portfolio for a backend developer”) produce this exact choice? If yes, change it or write down why it is still right.

## 13. Gotchas

- `pkill -f "vite preview --port 4317"` also kills the shell that runs it. Kill the preview by PID (`lint.sh` does).
- Tailwind’s preflight sets `code`, `pre`, `kbd` and `samp` to a monospace stack; `index.css` resets them to the sans, and `interactions.mjs` fails if a code excerpt renders in a mono face.
- `capture-hangman.mjs` signs in as a guest on the live game, which creates an anonymous user in the game’s Supabase project each run. Run it only when the screenshot needs updating.
- In the agent environment, shell output and redirects are sometimes swallowed and commands may finish after the tool returns. Run long scripts through `opentoken wrap python3 …` writing to a new file name each time, then read that file.
- `vite preview` caches its file list at start; restart it after a rebuild.
- Full-page screenshots don’t scroll, so scroll-triggered drawing never fires; `screenshots.mjs` scrolls through first.
- Firefox `--headless --screenshot` fires before animation frames; use Chromium through `tools/browser.mjs`.
- The minifier changes values linters key on: `background: none` becomes `0 0`, `transparent` becomes `#0000`, comments disappear.
- Tailwind emits `@theme` variables on `:root, :host`; sloplint only accepts colour literals in a plain `:root` block, hence the `:root` palette plus `@theme inline`.
- Tailwind generates a utility for any matching word it finds in source files, including comments (the word “transition” in a comment produced `.transition`). Block unwanted utilities with `@source not inline(...)`.
- React Router: use `RouterProvider` from `react-router/dom` and `createBrowserRouter`, so `viewTransition` links work; `ScrollRestoration` lives in `Layout`.
