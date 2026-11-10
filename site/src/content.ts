// Every fact here comes from the resume, the project repos, the PRs or Abbas himself.
// Fields marked DRAFT are wording Abbas should rewrite or confirm before publishing.
// Copy rules: no dashes as punctuation, curly quotes, no "X, not Y" rebuttals, no filler adjectives.

export const site = {
  name: 'Abbas Nadir',
  url: 'https://abbasnadir.tech',
  email: 'abbasnadir.dev@proton.me',
  resume: '/Abbas_Nadir_Resume.pdf',
  // Set to '/img/abbas.jpg' once the photo is in site/public/img (4:5 portrait works best).
  photo: undefined as string | undefined,
  links: {
    github: 'https://github.com/abbasnadir',
    linkedin: 'https://www.linkedin.com/in/abbas-nadir-393143322/',
    leetcode: 'https://leetcode.com/pro0grammer/',
  },
  // DRAFT
  summary: 'Backend developer and CS student in Nagpur.',
  // DRAFT
  lede: 'I build APIs, real-time systems and data pipelines.',
  // DRAFT: everything below is assembled from the resume and repos; rewrite it in your own voice.
  bio: [
    'I’m a third-year B.Tech student in Computer Science (AI and ML) at Ramdeobaba University in Nagpur. Most of what I build is backend work: REST APIs in Express and TypeScript, real-time servers on Socket.IO, schemas in PostgreSQL, and auth with JWTs and Supabase row-level security.',
    'I run Linux on everything and wrote Lock Keys for the COSMIC desktop, and when a library I depend on is missing something, I send the patch upstream. Outside coursework I go to hackathons and help run my college’s CTF.',
  ],
  // DRAFT
  now: 'Building a video-to-OpenSim pipeline for shoulder research at Leelatai Kulkarni Hospital.',
}

// A piece of real evidence shown on a project page: code from the repo, or a screenshot.
export type Evidence =
  | { kind: 'code'; title: string; source: string; url: string; code: string }
  | { kind: 'image'; title: string; src: string; alt: string; width: number; height: number }

export type Decision = {
  choice: string
  why: string
  cost: string
}

export type Project = {
  slug: string
  name: string
  when: string
  summary: string
  // One line of proof under the summary: where it runs, who it’s for, what it’s connected to.
  proof: string
  stack: string[]
  role: string
  repo?: string
  live?: string
  // Shown in place of links when the code can’t be public.
  closed?: string
  cover?: Evidence
  problem: string
  firstTry?: string
  how: { text: string; evidence?: Evidence }[]
  decisions: Decision[]
  limits: string[]
  // DRAFT
  next?: string
}

const inverseMode = `export class InverseSinglePlayer extends SinglePlayerMode {
    constructor(lives: number = 5) {
        super("InverseSinglePlayer", 1, 1, lives);
    }

    evaluatePlayerResult(userId: string, isSolved: boolean) {
        const player = this.players[userId];
        return (player && player.lives > 0) ? "won" : "lost";
    }

    resetRound(word: string): void {
        this.word = word;
        this.players = {};
        this.completedPlayersCount = 0;
    }

    getFinalResult(userId: string): string {
        const p = this.players[userId];
        return (p?.completed && p.lives > 0) ? "won" : "lost";
    }
}`

const rateLimiter = `def hit(self, key) -> float:
    now = time.monotonic()
    self._prune(now)

    hits = self._hits.setdefault(key, deque())
    while hits and now - hits[0] >= self.per:
        hits.popleft()

    if len(hits) >= self.rate:
        return self.per - (now - hits[0])

    hits.append(now)
    return 0.0`

const transcript = `# Keep peak memory + API rate to one transcript at a time.
_export_lock = asyncio.Lock()

async with _export_lock:
    with tempfile.TemporaryDirectory(prefix="transcript-") as tmp_dir:
        out_path = os.path.join(tmp_dir, "transcript.html")
        count = await chat_exporter.export_to_file(
            channel,
            out_path,
            tz_info="UTC",
            guild=channel.guild,
            bot=bot,
            fetch_reactors=fetch_reactors,
            should_stop=should_stop,
        )`

export const projects: Project[] = [
  {
    slug: 'hangman-v2',
    name: 'Hangman V2',
    when: 'Dec 2025 to Oct 2026',
    summary: 'Multiplayer Hangman with rooms for 2 to 50 players and custom wordlists.',
    proof: 'Live at hangman.abbasnadir.tech. Solo, 117 commits.',
    stack: ['Node.js', 'Express', 'Socket.IO', 'Supabase', 'Next.js', 'Zod'],
    role: 'Solo project, 117 commits.',
    repo: 'https://github.com/abbasnadir/hangman-v2',
    live: 'https://hangman.abbasnadir.tech',
    cover: {
      kind: 'image',
      title: 'Setting up a multiplayer game on the live site, with public wordlists to pick from',
      src: '/img/hangman-setup.png',
      alt: 'The Hangman V2 multiplayer setup screen: a wordlist search, a wordlist picker set to Blood Wars, a number of words field, and Cancel and Play buttons.',
      width: 1360,
      height: 1200,
    },
    firstTry:
      'Version one was a Hangman game that ran entirely in the browser: one player, one word list, no server. V2 is a rebuild from scratch around a backend, so several people can play the same words at once, results are saved, and players can make and share their own wordlists.',
    problem:
      'Once more than one person plays, the browser can’t be trusted with the game. The server has to own it: who is in the room, which guesses count, how many lives each player has left, when a round ends and who won. It also had to take new game modes without the socket handler turning into one long switch statement.',
    how: [
      {
        text: 'Creating a game is a REST call to POST /game/create with the mode, wordlist, lives and number of words. Playing it happens over Socket.IO: the client connects with its Supabase JWT, sends game:join with the game id, and sends its guesses as socket events.',
      },
      {
        text: 'Every mode extends an abstract CoreGameMode class, which handles moves, lives, rounds and scoring. A mode only defines the rules that differ: how many players it accepts, when a player has won and how a round resets. This is the whole of Inverse mode:',
        evidence: {
          kind: 'code',
          title: 'Inverse mode, a complete game mode',
          source: 'server/src/socket/game/modes/InverseSinglePlayer/index.ts',
          url: 'https://github.com/abbasnadir/hangman-v2/blob/main/server/src/socket/game/modes/InverseSinglePlayer/index.ts',
          code: inverseMode,
        },
      },
      {
        text: 'Multiplayer is the same base class with a lobby on top. It accepts 2 to 50 players, keeps a score per player, and shows players who drop as disconnected in the lobby. Running games are held in memory in a registry keyed by game id; profiles, wordlists and results are stored in Supabase.',
      },
    ],
    decisions: [
      {
        choice: 'Frontend on Vercel; API and socket server on Heroku.',
        why: 'Vercel’s serverless functions can’t hold long-lived WebSocket connections, so the game server needed a persistent process.',
        cost: 'Two deployments, two domains (hangman. and api.hangman.) and CORS to configure between them.',
      },
      {
        choice: 'Game modes are subclasses of one abstract CoreGameMode.',
        why: 'Adding Inverse mode took one file of about 25 lines, with no change to the socket router.',
        cost: 'The shared base class has grown to about 32 KB, so most fixes now land in one large file.',
      },
      {
        choice: 'Running games live in an in-memory registry.',
        why: 'Every guess is checked against the game state, and keeping that state in the process avoids a database round trip per move.',
        cost: 'Games live in one process: a restart ends every running game, and the server can’t run as a second instance without moving that state out. Heroku restarts dynos at least once a day.',
      },
    ],
    limits: ['There are no automated tests yet.', 'Fifty players is the limit I designed for; I haven’t load-tested a full room.'],
    // DRAFT
    next: 'Write tests for the game modes, then load-test a full 50-player room.',
  },
  {
    slug: 'restaurant-ordering',
    name: 'Restaurant ordering app',
    when: 'May to Jul 2026',
    summary: 'QR-code table ordering and a restaurant dashboard, built at my internship.',
    proof: 'Digikraft Media internship. I built it end to end; the code is private.',
    stack: ['Express', 'TypeScript', 'Supabase', 'PostgreSQL', 'Next.js', 'Zod', 'JOSE', 'Turborepo'],
    role: 'Backend Development Intern at Digikraft Media. I built the backend and the frontend (31 commits).',
    closed: 'The code belongs to Digikraft, so there are no links or screenshots.',
    // DRAFT: confirm this matches what the client asked for.
    problem:
      'Customers at a table should be able to scan a QR code, see the menu and order without installing an app or making an account. The restaurant needed one dashboard to run its menu, tables, offers and orders.',
    how: [
      {
        text: 'An Express API and a Next.js frontend in a Turborepo monorepo, with shared packages for types and the API client. Routes are split by who calls them: public restaurant pages, the cart, auth, media uploads, and an admin area for categories, menu items, offers, orders, tables, tags and onboarding.',
      },
      {
        // DRAFT: describe what "abuse of the QR code" meant in practice.
        text: 'Scanning a table’s QR code starts a cart session for that table. The session moved from localStorage to a cookie, and I tightened the session logic so a QR code can’t be used to abuse the cart.',
      },
      {
        text: 'Admin requests carry a JWT signed with JOSE. Request bodies are validated with Zod, and the API is rate limited with express-rate-limit. Database queries live in their own modules, apart from the route helpers.',
      },
      {
        text: 'Uploads are checked with the file-type library, which reads the file’s bytes, so a file can’t get through by being renamed. The frontend is an installable PWA, the table and cart endpoints have a written API spec, and the app is deployed on Render.',
      },
    ],
    decisions: [
      {
        choice: 'Check uploads by their content with file-type.',
        why: 'The file name and the MIME type in a request are both chosen by the client, so neither proves what a file is.',
        cost: 'Every upload has to be read before it’s stored.',
      },
    ],
    limits: ['I can’t show code or screenshots from this project.'],
  },
  {
    slug: 'bwars-helper',
    name: 'bwars-helper',
    when: 'Oct to Nov 2026',
    summary: 'Discord bot that runs game channels, tickets and archives on our server.',
    proof: 'In use on our Blood Wars server. Archives use my DiscordChatExporterPy patch.',
    stack: ['Python', 'discord.py', 'DiscordChatExporterPy'],
    role: 'Solo, 8 commits.',
    repo: 'https://github.com/abbasnadir/bwars-helper',
    cover: {
      kind: 'code',
      title: 'The limiter behind every slash command',
      source: 'utils/ratelimit.py',
      url: 'https://github.com/abbasnadir/bwars-helper/blob/main/utils/ratelimit.py',
      code: rateLimiter,
    },
    // DRAFT: confirm, and say what you did before the bot existed.
    problem:
      'We play Blood Wars, a game run inside a private Discord server. Every game needs its own category of channels with the right permissions for hosts, players, spectators and jailed players, and when a game ends its channels are worth keeping. Doing that by hand for every game was slow and easy to get wrong.',
    how: [
      {
        text: '/create_game builds a game’s category, channels and permission overwrites in one command, and /delete_game removes them. A ticket panel opens private support channels; its buttons keep working after the bot restarts because the views are registered as persistent.',
      },
      {
        text: '/archive turns a “The game N” category into HTML transcripts and locks it to an archive role, and /unarchive reverses it. Exporting a channel reads its whole history, so exports go through one lock and the bot runs at most three archive jobs at a time:',
        evidence: {
          kind: 'code',
          title: 'One transcript at a time',
          source: 'utils/transcript.py',
          url: 'https://github.com/abbasnadir/bwars-helper/blob/main/utils/transcript.py',
          code: transcript,
        },
      },
      {
        text: 'The fetch_reactors option above comes from my pull request to DiscordChatExporterPy, so archived transcripts show who reacted to each message. Every slash command also passes through a sliding-window limiter in the command tree: five commands per user every fifteen seconds, on top of each command’s own cooldown.',
      },
    ],
    decisions: [
      {
        choice: 'One rate limiter in the command tree’s interaction_check.',
        why: 'A single check covers every slash command, including ones added later.',
        cost: 'Hits are kept in memory, so limits reset when the bot restarts.',
      },
      {
        choice: 'Add the missing feature to the export library upstream.',
        why: 'Transcripts needed to show who reacted, and the library had no way to do it. The patch caps it at ten reactors per reaction to stay clear of Discord’s rate limits.',
        cost: 'Until the pull request is merged, the bot ships a build of the patched library in its repo and won’t pick up upstream fixes on its own.',
      },
    ],
    limits: ['No README or tests yet.'],
    // DRAFT
    next: 'Write a README with setup steps, and move rate limit state somewhere that survives a restart.',
  },
]

export type Job = {
  title: string
  org: string
  when: string
  points: string[]
}

export const experience: Job[] = [
  {
    title: 'Developer, Digital Shoulder Twin',
    org: 'Leelatai Kulkarni Hospital, research and patent project',
    when: 'Sep 2026 to now',
    points: [
      'Building a video-to-OpenSim pipeline: MediaPipe, RTMW3D and MotionBERT pose estimation feeding OpenSim 4.6 inverse kinematics on the Wu shoulder model.',
    ],
  },
  {
    title: 'Backend Development Intern',
    org: 'Digikraft Media Pvt. Ltd.',
    when: 'May to Jul 2026',
    points: [
      'Built a restaurant ordering app with QR-code table sessions and an admin dashboard in Next.js, Express and Supabase.',
      'Designed the database schemas and set up Supabase auth with Row Level Security.',
      'Wrote REST APIs with JOSE-based JWT auth, Zod validation, rate limiting and file-type checks on uploads, and wrote the API spec.',
    ],
  },
  {
    title: 'Web Developer, Pratishruti 2026',
    org: 'College fest website, one of seven developers',
    when: '2026',
    points: [],
  },
  {
    title: 'CTF Organizer, Cinecrypt 2026',
    org: 'Wrote challenges and ran the event',
    when: '2026',
    points: [],
  },
]

export const education = {
  degree: 'B.Tech, Computer Science and Engineering (AI and ML), Honors',
  school: 'Ramdeobaba University, Nagpur',
  when: '2024 to 2028',
  note: 'CGPA 8.77 / 10',
}

export const openSource = [
  {
    repo: 'nextcloud/tables',
    pr: '#2455',
    url: 'https://github.com/nextcloud/tables/pull/2455',
    status: 'Merged',
    what: 'Replaced “circle” with “team” in CircleHelper, fixing issue #2249.',
  },
  {
    repo: 'mahtoid/DiscordChatExporterPy',
    pr: '#159',
    url: 'https://github.com/mahtoid/DiscordChatExporterPy/pull/159',
    status: 'Open',
    what: 'Adds an option to show who reacted to each message, capped at ten reactors to avoid rate limits, and fixes emoji-only messages that didn’t enlarge. bwars-helper uses it for its archives.',
  },
]

export const hackathons = [
  { place: 'Third prize', event: 'MEDHA Medithon 2026, VNIT Nagpur', what: 'SureStep, with Team TechSquad' },
  { place: 'Second place', event: 'TechmentorX, Priyadarshini College', what: 'AI-generated quizzes to spot learning gaps early, with Team Cybirbs' },
]

export type ArchiveEntry = {
  year: number
  name: string
  what: string
  stack: string[]
  code?: string
  live?: string
}

// Years are when each repo was created. Private repos have no links.
export const archive: ArchiveEntry[] = [
  {
    year: 2026,
    name: 'GroundTruth',
    what: 'SDG indicators for Indian districts from satellite data. Hackathon project, being rebuilt.',
    stack: ['FastAPI', 'Earth Engine', 'Supabase', 'Next.js'],
  },
  {
    year: 2026,
    name: 'SureStep',
    what: 'Offline clubfoot screening app for rural health workers. Team project, third prize at Medithon.',
    stack: ['Flutter', 'ML Kit', 'SQLite', 'Flask'],
    code: 'https://github.com/abbasnadir/techsquad-medithon',
  },
  {
    year: 2026,
    name: 'Nagpur Traffic AI',
    what: 'Traffic dashboard for Nagpur with a REST and WebSocket backend. Team of three.',
    stack: ['FastAPI', 'React', 'WebSockets'],
    code: 'https://github.com/abbasnadir/viksit-nagpur',
  },
  {
    year: 2026,
    name: 'MetricFlow',
    what: 'Website analytics: tracking SDK, ingestion API and a Python worker. Unfinished.',
    stack: ['Express', 'MongoDB', 'Python'],
    code: 'https://github.com/abbasnadir/analytics-tracker',
  },
  {
    year: 2026,
    name: 'Stock market visualizer',
    what: 'Stock charts and paper-trading portfolios with live prices from Yahoo Finance.',
    stack: ['Python', 'Dash', 'Supabase'],
    code: 'https://github.com/abbasnadir/stock-market-visualizer',
  },
  {
    year: 2026,
    name: 'VaniFlow',
    what: 'AI voice and IVR workflow platform, built at a hackathon.',
    stack: ['Node.js'],
  },
  {
    year: 2026,
    name: 'ags-auto-agent',
    what: 'An early experiment: an OpenAI-compatible client with a file-reading tool.',
    stack: ['TypeScript', 'OpenAI SDK'],
    code: 'https://github.com/abbasnadir/ags-auto-agent',
  },
  {
    year: 2026,
    name: 'Lock Keys',
    what: 'Rust daemon and COSMIC panel applets that show Caps Lock and Num Lock state.',
    stack: ['Rust', 'COSMIC'],
    code: 'https://github.com/abbasnadir/lock-keys',
  },
  {
    year: 2025,
    name: 'Supabase backend template',
    what: 'The starter I reuse for full-stack apps on Supabase.',
    stack: ['TypeScript', 'Supabase'],
    code: 'https://github.com/abbasnadir/supabase-backend-template',
  },
  {
    year: 2025,
    name: 'Chatbot',
    what: 'A Gemini wrapper with sign-in and chats saved to a database.',
    stack: ['Next.js', 'TypeScript'],
    code: 'https://github.com/abbasnadir/chatbot',
    live: 'https://chatbot-two-xi-30.vercel.app',
  },
  {
    year: 2021,
    name: 'Blink Bot',
    what: 'A Discord bot with a web dashboard. Archived.',
    stack: ['JavaScript', 'Discord'],
    code: 'https://github.com/abbasnadir/blinkbot',
  },
]

export const skills = [
  { group: 'Backend', items: 'Node.js, Express, REST, OpenAPI, Socket.IO, JWT with JOSE, Zod, FastAPI' },
  { group: 'Data', items: 'PostgreSQL, Supabase with RLS, MongoDB and Mongoose' },
  { group: 'Frontend', items: 'TypeScript, React, Next.js, Tailwind CSS' },
  { group: 'Also', items: 'Python, discord.py, Java, Rust (learning), Linux, Git, Docker (basic)' },
]
