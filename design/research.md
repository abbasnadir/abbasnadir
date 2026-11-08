# Research behind the design rules

Collected 2026-11-07 and 2026-11-08. Points marked *(unverified)* came from secondary sources or could not be fetched directly.

## 1. What makes a developer portfolio work

- **The resume is read first and the site is checked afterwards.** Profy.dev surveyed about 60 hiring managers (2021). About 93% would look at a junior's portfolio, but about 51% said not having one wouldn't hurt, and a broken or outdated site does hurt. https://dev.to/profydev/this-survey-among-60-hiring-managers-reveals-don-t-waste-your-time-on-a-react-portfolio-website-17ge
- **Review time:** about 55 seconds per portfolio plus resume, measured on design applicants. https://presentum.io/design/hiring-explained/evaluating-portfolio-and-resume
- **Josh Comeau's advice** (from reviewing several hundred junior portfolios): show 2 to 5 projects, skip tutorial clones, act as a tour guide, keep it skimmable. Don't fork a famous template; he was sent exact forks of Brittany Chiang's site. https://www.joshwcomeau.com/effective-portfolio/ · https://www.joshwcomeau.com/blog/why-my-blog-is-closed-source
- **Case study shape:** problem, your role, architecture, decisions, tradeoffs, results, what you'd change.
- **Showing backend work** that has no UI: one diagram per project, real metrics only, an OpenAPI spec as the demo, READMEs that explain why. https://slategit.com/blog/backend-developer-portfolio-without-visuals · https://cvfy.dev/blog/backend-developer-portfolio-projects
- **Core Web Vitals "good" thresholds:** LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. https://web.dev/articles/vitals
- **Engineering managers on Hacker News:** a portfolio helps juniors and gives the interview something to talk about; "don't try to be too cute". https://news.ycombinator.com/item?id=17671490
- **Best backend-portfolio model:** https://arpitbhayani.me (systems projects with deep write-ups). For making systems ideas visual: https://samwho.dev

## 2. Resume design patterns

- **Butterick, Practical Typography resume chapter.** Keep headings quiet ("who cares about résumé headings?"); employer and school names carry the emphasis; bigger margins, shorter lines; a serif body with a sans for structure; one page for students. https://practicaltypography.com/resumes.html
- **Jake's Resume** (LaTeX, very common in r/cscareerquestions). One serif, black only. The name is huge, bold and small caps. Contact details on one line separated by `|`. Section headings are small caps with a full-width rule. Each entry has a bold organisation with location right-aligned, then the title on a second line with dates right-aligned. Order: Education, Experience, Projects, Skills. https://raw.githubusercontent.com/jakegut/resume/master/resume.tex
- **Ladders eye-tracking study, 2018.** 7.4 s initial screen; F and E scan patterns; bold job titles over bullet lists; a summary at the top helps. In 2012, about 80% of the time went on name, titles, companies, dates and education. *(The PDF was blocked; summary from the press release.)* https://www.prnewswire.com/news-releases/ladders-updates-popular-recruiter-eye-tracking-study-with-new-key-insights-on-how-job-seekers-can-improve-their-resumes-300744217.html
- **Google XYZ formula:** "Accomplished X as measured by Y, by doing Z". https://www.linkedin.com/pulse/20140929001534-24454816-my-personal-formula-for-a-better-resume
- **Harvard Career Services:** consistent bold, italics and caps; balanced white space; reverse chronological order. https://careerservices.fas.harvard.edu/resources/create-a-strong-resume

## 3. Colour and type on respected personal sites (checked against their CSS)

| Site | Fonts | Mono | Colours | Accent used for |
| --- | --- | --- | --- | --- |
| leerob.com | Iowan Old Style body and headings; system sans for UI | code only | `#fff`, `#171717`, links `#6b7280` | none; grey underlined links |
| paco.me | Söhne / Newsreader | defined | Radix grays | none |
| rauno.me | custom face, Georgia | JetBrains Mono | hsl grays | links inherit text colour |
| emilkowal.ski | aliased Sans/Serif | code | warm grays `#21201c`, `#63635e` | none; thin grey underline |
| cassidoo.co | iA Writer Mono everywhere (the deliberate exception) | everywhere | `#faf5f6`, `#252525` | links black with thick underline |
| maggieappleton.com | Canela Deck/Text, Lato UI | code | cream `#f6f5f1`, `#353534` | crimson `#5f023e` on links |
| jvns.ca | PT Serif body | code | `#000` | orange `#CC4B00` on links and title |
| arpitbhayani.me | Assistant, Lora | code | `#faf9f6`, `#333` | blue on link hover |
| brittanychiang.com | Inter | system | slate `#0f172a` with teal | tags, hover, selection; the most-copied layout |
| joshwcomeau.com | Wotfard, Sriracha | code | `#4242fa` primary, `#e60067` secondary | full multi-hue system (the exception) |

**Takeaways:**

1. Colour is about 90% neutral; at most one accent, and it goes on links.
2. Hierarchy comes from weight, size and grey, not from hue.
3. Mono is for code.
4. A serif reading face is common.
5. Single column of about 65 to 70 characters.
6. Motion is small.

## 4. How to spot an AI-made website (with Claude-specific tells)

**Anthropic's own documents (strong evidence):**

- **frontend-design skill:** AI design "clusters around" these:
  1. Cream `#F4F1EA`, a high-contrast serif and a terracotta accent near `#D97757`.
  2. Near-black with a single acid-green or vermilion accent.
  3. A broadsheet layout with hairline rules and zero radius.
  4. A SaaS card kit: identical rounded cards and soft `rgba(0,0,0,.1)` shadows.
  5. Template chrome: tracked all-caps eyebrows, `A · B · C` meta strings, "WORD — fragment" labels, tinted near-black `#0B0B0B`/`#111`, mono data labels, `→` added to links.

  It also names one accented word in a headline, all-caps labels, unnecessary labels above content, 01/02/03 markers on content that isn't a sequence, and fade-up on every section. Copy is in `vendor/anthropic-frontend-design/SKILL.md`; source: https://github.com/anthropics/skills/tree/main/skills/frontend-design
- **"Prompting Claude Opus 4.8":** describes a "persistent" house style of cream, serif display, italic accent words and terracotta. Telling Claude only "not cream" moves it to another fixed palette, so give an exact spec instead. https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-4-8
- **Cookbook, "Prompting for frontend aesthetics":** names the mechanism "distributional convergence"; tells include Inter, Roboto, purple gradients on white, and convergence on Space Grotesk. https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb

**Five independent write-ups:**

1. **The New Yorker, "The A.I.-Design Aesthetic That's Taking Over the Internet"** (Jun 2026, on Claude Design). Beige and cream; rusty orange; large italic serifs; tracked-out subheadings; ticker bars; neon-glow rounded outlines; too many dots, dividing characters and emojis; em dashes and "not X but Y".
2. **prg.sh, "Why Your AI Keeps Building the Same Purple Gradient Website."** Inter or Roboto; indigo (Tailwind `bg-indigo-500`); centred hero with a button; three icon boxes; 0.1-opacity shadows; forms with no validation. https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website
3. **925studios, "AI slop design tells."** Unchanged Inter, indigo-to-purple gradients, three rounded cards, thin generic icons, weightless headlines ("Build faster. Ship smarter."). https://www.925studios.co/blog/ai-slop-design-tells
4. **Developers Digest, "AI Design Slop: 16 Patterns"** (from a scan of 1,590 Show HN pages). Inter, Space Grotesk, Instrument Serif, Geist; a serif-italic accent word; purple; permanent dark mode; a badge above the headline; coloured card borders; numbered steps; stat banners; all-caps labels; shadcn defaults. https://developersdigest.tech
5. **dev.to/laurilllll, "Is your website AI slop?"** Small uppercase mono captions above headings; "✨ Now with AI" pills; gradient text; bento grids. Key point: ban Inter and purple and "you get Instrument Serif and mono captions instead".

**Also:**

- dev.to/kenimo49, "3 UI Slop Patterns" (covers v0, Lovable, Bolt and Claude Artifacts).
- solodesign.cc: amber and cream is "the em-dash of design"; dot-prefixed labels; dark bento grid with glow; emerald as the fallback after indigo is banned.
- theagentschool.dev, on the eyebrow and the pulsing dot.
- r/ClaudeAI, "You can spot a Claude-built app instantly. It's the fonts": overuse of monospace, glowing buttons, middle dots.
- Wikipedia, "Signs of AI writing": puffery, the rule of three, "not just X but Y"; em-dash overuse is now a historical tell. https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing

**How recruiters spot AI-made portfolios:**

- Polish with no specifics, the same tone on every project, no failures, keyword lists that are improbably wide, claims on the site that don't match GitHub.
- The quickest check is asking the candidate to explain one decision and the alternatives they considered. https://highfive.global/hiring-recruitment/how-to-tell-if-a-candidates-portfolio-is-real-or-ai-generated-a-practical-verification-guide-for-hiring-managers/ · https://www.shrm.org/topics-tools/news/technology/how-to-spot-ai-generated-lies-on-a-resume · https://dev.to/francistrdev/why-you-still-need-a-website-portfolio-even-though-everyone-can-vibe-code-it-e63

**General anti-patterns:**

- Skill bars and percentages.
- Tutorial clones.
- Dead demos and slow cold starts.
- Scroll-jacking (NN/g: it harms control, discoverability and task success; https://www.nngroup.com/articles/scrolljacking-101/).
- Splash loaders, and a contact form where a `mailto:` would do.

## 5. Anti-slop prompt repositories

Found with the GitHub MCP search on 2026-11-08 (stars at that time):

| Repo | What it is | Used how |
| --- | --- | --- |
| [Nutlope/hallmark](https://github.com/Nutlope/hallmark) (about 50k stars) | Anti-AI-slop design skill for Claude Code, Cursor and Codex: floor rules, gates, font lists, and the `sloplint` checker | Rules adopted; `sloplint.mjs`, `fonts.md`, `gates.md`, `craft.md` and `SKILL.md` vendored (MIT) |
| [Gesso-Build/skills](https://github.com/Gesso-Build/skills) | 73 deterministic "slop guards" plus `npx @gessobuild/anti-slop check` | Run in `lint.sh`; `SKILL.md` and `rules.md` vendored (MIT) |
| [anthropics/skills, frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Anthropic's own skill, which lists Claude's default looks | Process followed (plan, review against the brief, build, critique); vendored (Apache 2.0) |
| [jalaalrd/anti-ai-slop-writing](https://github.com/jalaalrd/anti-ai-slop-writing) | Banned words, structure and punctuation rules for prose | Applied to all copy; **no licence in the repo, so not vendored**; summarised in README section 7 |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Large design skill and CLI | Not used (very large clone); referenced by design-taste |
| [h3nryprod01/design-taste](https://github.com/h3nryprod01/design-taste) | Merges emilkowalski/skill and impeccable | Not used yet |
| [tasteskill/tasteskill](https://github.com/tasteskill/tasteskill) | "Anti-slop frontend framework" with minimalist and brutalist variants | Not used yet |
| [wilwaldon/Claude-Code-Frontend-Design-Toolkit](https://github.com/wilwaldon/Claude-Code-Frontend-Design-Toolkit) | List of skills, plugins and MCP servers for Claude Code frontends | Not used yet; a good index |
| [Laith0003/ux-skill](https://github.com/Laith0003/ux-skill), [Ferousco-dev/anti-slop-design](https://github.com/Ferousco-dev/anti-slop-design), [ravidsrk/slop-detect](https://github.com/ravidsrk/slop-detect) | Smaller anti-slop linters and skills | Not used yet |

## 6. Typeface research notes

- Rejected for being AI defaults: Inter, Space Grotesk, Fraunces, Instrument Serif, IBM Plex Mono, JetBrains Mono, Geist.
- Rejected because a Hallmark catalog theme already uses them as display faces: Schibsted Grotesk (theme "Dose") and Hanken Grotesk (theme "Almanac").
- Cleared by Hallmark's face checker: Rethink Sans (chosen), Albert Sans, Reddit Sans, Public Sans, Source Serif 4 (chosen as body).
- Other pairs suggested in the research, as alternatives: Literata with a grotesk; Charter (XCharter) with Public Sans, close to Jake's resume; Source Serif 4 with Hanken Grotesk; Atkinson Hyperlegible Next.
