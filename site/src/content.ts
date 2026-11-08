// Every fact here comes from the resume, the project repos, or the PRs themselves.
// Fields marked DRAFT are wording Abbas should rewrite in his own voice before publishing.
// Copy rules: no dashes as punctuation, curly quotes, no "X, not Y" rebuttals, no filler adjectives.

export const site = {
  name: 'Abbas Nadir',
  url: 'https://abbasnadir.tech',
  email: 'abbasnadir.dev@proton.me',
  resume: '/Abbas_Nadir_Resume.pdf',
  links: {
    github: 'https://github.com/abbasnadir',
    linkedin: 'https://www.linkedin.com/in/abbas-nadir-393143322/',
    leetcode: 'https://leetcode.com/pro0grammer/',
  },
  // DRAFT
  summary: 'Backend developer and CSE student in Nagpur, looking for an internship.',
  // DRAFT: everything below is assembled from the resume and repos; rewrite it in your own voice.
  bio: [
    'I’m a third-year B.Tech student in Computer Science (AI and ML) at Ramdeobaba University in Nagpur. Most of what I build is backend work: REST APIs in Express and TypeScript, schemas in PostgreSQL and MongoDB, auth with JOSE and Supabase row-level security.',
    'I run Linux on everything and wrote Lock Keys for the COSMIC desktop, and I send patches upstream when something in a tool I use is broken. Outside coursework I go to hackathons and help run my college’s CTF.',
  ],
  now: 'I’m building a video-to-OpenSim pipeline for a digital shoulder twin at Leelatai Kulkarni Hospital: MediaPipe, RTMW3D and MotionBERT estimate pose from video, and OpenSim 4.6 turns it into shoulder kinematics.',
}

export const tags = ['APIs', 'Real-time', 'Data', 'Mobile', 'Systems'] as const
export type Tag = (typeof tags)[number]

export type DiagramNode = {
  id: string
  label: string
  sub?: string
  x: number
  y: number
  w?: number
  accent?: boolean
}

export type DiagramEdge = {
  from: string
  to: string
  label?: string
  // Pixel offset to separate two edges between the same pair of nodes.
  bend?: number
  hot?: boolean
  // Traffic flows both ways along one line.
  both?: boolean
}

export type Diagram = {
  title: string
  height: number
  nodes: DiagramNode[]
  edges: DiagramEdge[]
}

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
  stack: string[]
  tags: Tag[]
  role: string
  repo: string
  live?: string
  problem: string
  built: string[]
  diagram: Diagram
  decisions: Decision[]
  didntWork?: string
  // DRAFT
  nextTime: string
}

export const projects: Project[] = [
  {
    slug: 'metricflow',
    name: 'MetricFlow',
    when: '2026',
    summary: 'Self-hosted website analytics, from the tracking script to the metrics worker.',
    stack: ['Express', 'TypeScript', 'MongoDB', 'Python', 'Next.js', 'Zod', 'OpenAPI'],
    tags: ['APIs', 'Data'],
    role: 'Team of four. I wrote most of the code (16 of 20 commits), including the ingestion API.',
    repo: 'https://github.com/abbasnadir/analytics-tracker',
    problem:
      'Embed one script on a website and get page views, sessions, unique visitors, bounce rate, top pages and device or geo breakdowns, without handing the data to a third-party tracker.',
    built: [
      'A browser SDK that captures page views, clicks and custom events and sends them to the backend.',
      'An Express ingestion API (POST /api/v1/events) that accepts single or batched events, resolves the tenant from an API key, tags every request with a request ID and validates payloads with Zod.',
      'MongoDB models with a tenant/event uniqueness index, so a retried batch doesn’t double-count, and a TTL index that expires raw events once they’ve been summarised.',
      'A Python worker that pulls raw events, computes sessions, bounce rate, session duration and top pages, and posts the summaries back.',
      'A Next.js dashboard with filters, charts and CSV export.',
    ],
    diagram: {
      title: 'How a tracked event moves through MetricFlow',
      height: 364,
      nodes: [
        { id: 'dash', label: 'Dashboard', sub: 'Next.js', x: 310, y: 16 },
        { id: 'sdk', label: 'Website + SDK', sub: 'in the browser', x: 20, y: 150 },
        { id: 'api', label: 'Backend API', sub: 'Express and Zod', x: 310, y: 150, accent: true },
        { id: 'db', label: 'MongoDB', sub: 'raw and summaries', x: 600, y: 150 },
        { id: 'py', label: 'Analyzer', sub: 'Python worker', x: 310, y: 284 },
      ],
      edges: [
        { from: 'sdk', to: 'api', label: 'POST /events', hot: true },
        { from: 'api', to: 'db', label: 'read, write' },
        { from: 'dash', to: 'api', label: 'GET /metrics' },
        { from: 'api', to: 'py', label: 'GET raw events', bend: -40 },
        { from: 'py', to: 'api', label: 'POST summaries', bend: 40 },
      ],
    },
    decisions: [
      {
        choice: 'Only the backend talks to MongoDB; the analyzer reads raw events and writes summaries through the API.',
        why: 'Four people were building in parallel, so having one service own the data kept validation, auth and indexes in a single place where nobody could break someone else’s collections.',
        cost: 'The analyzer pays an extra network hop, and the backend becomes a single point of failure. Our architecture doc admits it: “if backend breaks, everyone gets blocked.”',
      },
      {
        choice: 'api.yml (OpenAPI) is the source of truth for every route and payload.',
        why: 'The SDK, analyzer and dashboard were written by different people against the same contract, which let each of us work without waiting on the others.',
        cost: 'Every route change has to be made twice, in code and in the spec, and drift only gets caught when someone notices.',
      },
      {
        choice: 'A TTL index on raw events instead of keeping them forever.',
        why: 'Raw events only matter until the worker has summarised them, so storage stays bounded without a cleanup job.',
        cost: 'If the analyzer logic changes, metrics for periods older than the retention window can’t be recomputed.',
      },
    ],
    // DRAFT
    nextTime:
      'Push raw events to the analyzer through a queue instead of having it pull them from the API, and load-test the ingestion endpoint so I can quote a real throughput number.',
  },
  {
    slug: 'hangman-v2',
    name: 'Hangman V2',
    when: 'Dec 2025 to 2026',
    summary: 'Multiplayer Hangman for up to 50 players over WebSockets.',
    stack: ['Node.js', 'Express', 'Socket.IO', 'Supabase', 'Next.js', 'JOSE', 'Zod'],
    tags: ['APIs', 'Real-time'],
    role: 'Solo project, 117 commits.',
    repo: 'https://github.com/abbasnadir/hangman-v2',
    live: 'https://hangman.abbasnadir.tech',
    problem:
      'My first Hangman was a frontend-only game. For V2 I wanted shared rooms, live turns, scoring and custom wordlists, on a backend that could grow new game modes without turning into one giant socket handler.',
    built: [
      'A Socket.IO server with a router for game actions (join, start, move) and pluggable game modes, Classic and Multiplayer, which implement a shared IGameMode interface and are looked up from a registry.',
      'A separate Express REST API (/me, /profile, /logs) with its own middleware and rate limiters.',
      'JWT auth with JOSE and Zod validation on every input.',
      'Scoring and wordlists stored in Supabase (PostgreSQL).',
      'A Next.js client where game-mode controllers live apart from the screens that draw them.',
    ],
    diagram: {
      title: 'Hangman V2: what talks to what',
      height: 330,
      nodes: [
        { id: 'client', label: 'Next.js client', sub: 'on Vercel', x: 20, y: 133 },
        { id: 'rest', label: 'REST API', sub: 'Express, on Heroku', x: 310, y: 20 },
        { id: 'ws', label: 'Socket.IO', sub: 'game modes, on Heroku', x: 310, y: 246, accent: true },
        { id: 'db', label: 'Supabase', sub: 'PostgreSQL', x: 600, y: 133 },
      ],
      edges: [
        { from: 'client', to: 'rest', label: 'HTTPS with JWT' },
        { from: 'client', to: 'ws', label: 'moves and state', hot: true, both: true },
        { from: 'rest', to: 'db', label: 'profiles' },
        { from: 'ws', to: 'db', label: 'scores' },
      ],
    },
    decisions: [
      {
        choice: 'Frontend on Vercel; API and WebSocket server on Heroku.',
        why: 'Vercel’s serverless functions can’t hold long-lived WebSocket connections, so the game server needed a persistent process.',
        cost: 'Two deployments, two domains (hangman. and api.hangman.) and CORS to configure between them.',
      },
      {
        choice: 'Game modes are classes behind an IGameMode interface, registered by name.',
        why: 'Adding a mode means writing one controller instead of growing a switch statement in the socket router.',
        cost: 'It’s more indirection than a two-mode game strictly needs, and it only pays off if more modes arrive.',
      },
      {
        choice: 'REST and WebSocket code live in separate top-level folders (src/api and src/socket).',
        why: 'Profile and log endpoints follow request and response rules while game actions are event-driven, and keeping them apart stopped middleware written for one from applying to the other.',
        cost: 'Some types and queries are needed by both, so a src/shared layer had to exist from day one.',
      },
    ],
    // DRAFT
    nextTime: 'Load-test a full 50-player room. Fifty is the limit I designed for; I haven’t measured it yet.',
  },
  {
    slug: 'surestep',
    name: 'SureStep',
    when: '2026',
    summary: 'Offline clubfoot assessment for rural health workers; third prize at Medithon.',
    stack: ['Flutter', 'Google ML Kit', 'SQLite', 'Flask', 'PostgreSQL'],
    tags: ['Mobile', 'Data'],
    role: 'Team TechSquad. I built landmark adjustment, patient records, brace tracking and teleconsultation, plus the early Flask backend.',
    repo: 'https://github.com/abbasnadir/techsquad-medithon',
    problem:
      'Clubfoot (CTEV) is scored with the Pirani method, which depends on consistent photos and an experienced examiner. Health workers at rural primary health centres often have neither, and often have no reliable connection either.',
    built: [
      'Guided capture of medial, lateral and posterior views using Google ML Kit pose detection on the device.',
      'Manual landmark adjustment, so a health worker can correct the model when detection is off.',
      'Patient records stored locally in SQLite, so the app works with no network.',
      'A brace tracker for parents to log daily wear, and a teleconsultation ticket for problems like swelling.',
      'An early Flask backend to act as the sync hub.',
    ],
    diagram: {
      title: 'SureStep: capture on the phone, sync when there’s signal',
      height: 300,
      nodes: [
        { id: 'cam', label: 'Camera', sub: 'guided views', x: 20, y: 20 },
        { id: 'ml', label: 'ML Kit', sub: 'on the device', x: 20, y: 216 },
        { id: 'app', label: 'Flutter app', sub: 'SQLite, offline', x: 310, y: 118, accent: true },
        { id: 'api', label: 'Flask', sub: 'sync hub', x: 600, y: 118 },
      ],
      edges: [
        { from: 'cam', to: 'app', label: 'frames' },
        { from: 'ml', to: 'app', label: 'landmarks' },
        { from: 'app', to: 'api', label: 'sync later', hot: true },
      ],
    },
    decisions: [
      {
        choice: 'Offline-first: SQLite on the device, synced to the server later.',
        why: 'The people using it work in low-connectivity areas, where an app that needs the network to save a patient record is useless.',
        cost: 'Sync and conflict handling become the hard part, and in a hackathon they stayed basic.',
      },
      {
        choice: 'Pose detection on the device instead of on a server.',
        why: 'Guiding the capture needs no upload, which keeps it fast and keeps images on the phone.',
        cost: 'ML Kit’s general pose model wasn’t trained on infant feet, which caps how accurate it can be.',
      },
    ],
    didntWork:
      'Real detection wasn’t reliable enough for a live demo, so the team built a fallback mode that generates simulated keypoints. The prototype demonstrates the workflow; it isn’t a validated clinical tool.',
    // DRAFT
    nextTime:
      'Collect a properly consented dataset of infant foot images (the app already has an opt-in flow for this) before claiming anything about scoring accuracy.',
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
      'Built backend and full-stack features for a private restaurant management app in Next.js, Express and Supabase.',
      'Designed the database schemas and set up Supabase auth with Row Level Security.',
      'Wrote REST APIs with JOSE-based JWT auth, Zod validation, rate limiting and file-type checks, and contributed to the API docs.',
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
    what: 'Shows who reacted to a message, and fixes emoji that didn’t enlarge.',
  },
]

export const hackathons = [
  { place: 'Third prize', event: 'MEDHA Medithon 2026, VNIT Nagpur', what: 'SureStep, with Team TechSquad' },
  { place: 'Second place', event: 'TechmentorX, Priyadarshini College', what: 'AI-generated quizzes to spot learning gaps early, with Team Cybirbs' },
]

export type OtherProject = {
  name: string
  url: string
  what: string
  stack: string[]
  tags: Tag[]
  live?: string
}

// Role notes come from commit history: Nagpur Traffic AI is a team of three (9 of 17 commits are Abbas’s);
// the rest are solo repos.
export const otherProjects: OtherProject[] = [
  {
    name: 'Lock Keys',
    url: 'https://github.com/abbasnadir/lock-keys',
    what: 'A Rust daemon and COSMIC panel applets that show Caps Lock and Num Lock state on keyboards without indicator LEDs.',
    stack: ['Rust', 'COSMIC'],
    tags: ['Systems'],
  },
  {
    name: 'Nagpur Traffic AI',
    url: 'https://github.com/abbasnadir/viksit-nagpur',
    what: 'Team project: a traffic dashboard for Nagpur with a FastAPI REST and WebSocket backend and a React map.',
    stack: ['FastAPI', 'Python', 'React', 'WebSockets'],
    tags: ['Real-time', 'Data'],
  },
  {
    name: 'Stock market visualizer',
    url: 'https://github.com/abbasnadir/stock-market-visualizer',
    what: 'A Dash app for stock charts and paper-trading portfolios, with Supabase auth and live prices from Yahoo Finance.',
    stack: ['Python', 'Dash', 'Supabase'],
    tags: ['Data'],
  },
  {
    name: 'Chatbot',
    url: 'https://github.com/abbasnadir/chatbot',
    what: 'A Gemini wrapper with sign-in and chats saved to a database.',
    stack: ['Next.js', 'TypeScript'],
    tags: ['APIs'],
    live: 'https://chatbot-two-xi-30.vercel.app',
  },
  {
    name: 'Blink Bot',
    url: 'https://github.com/abbasnadir/blinkbot',
    what: 'A Discord bot with a web dashboard and a database. Archived.',
    stack: ['JavaScript', 'Discord'],
    tags: ['APIs'],
  },
  {
    name: 'Supabase backend template',
    url: 'https://github.com/abbasnadir/supabase-backend-template',
    what: 'The starter I reuse for full-stack apps on Supabase.',
    stack: ['TypeScript', 'Supabase'],
    tags: ['APIs'],
  },
]

export const skills = [
  { group: 'Backend', items: 'Node.js, Express, REST, OpenAPI, Socket.IO, JWT with JOSE, Zod' },
  { group: 'Data', items: 'PostgreSQL, Supabase with RLS, MongoDB and Mongoose' },
  { group: 'Frontend', items: 'TypeScript, React, Next.js, Tailwind CSS' },
  { group: 'Also', items: 'Python, Java, Rust (learning), Linux, Git, Docker (basic)' },
]
