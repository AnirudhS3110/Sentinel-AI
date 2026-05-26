# SentinelAI

AI-powered incident orchestration for production infrastructure. Submit an incident with logs; six specialized agents plan, classify, analyze, validate, remediate, and report — with live progress streamed to a command-center dashboard.

Teach Stack: Next.js, NestJS, TypeScript, PostgreSQL, Prisma, Redis, BullMQ, Socket.IO, LangGraph, LangChain, Google Gemini, Tailwind CSS, Framer Motion, Recharts, Firebase Auth, Railway, Vercel, Neon, Upstash

**Live demo:** [sentinel-ai-v1.vercel.app](https://sentinel-ai-v1.vercel.app/)

---

## Table of contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Monorepo structure](#monorepo-structure)
- [AI agents](#ai-agents)
- [Workflow pipeline](#workflow-pipeline)
- [Tech stack](#tech-stack)
- [Data model](#data-model)
- [Real-time updates](#real-time-updates)
- [Authentication](#authentication)
- [Prerequisites](#prerequisites)
- [Local setup](#local-setup)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [App routes](#app-routes)

---

## Overview

SentinelAI automates the incident lifecycle:

1. A user creates an incident (title, description, raw logs) via the web UI.
2. The **API** persists the incident and enqueues the first job on **BullMQ** (Redis).
3. The **worker** runs six **Gemini**-powered agents in sequence, updating PostgreSQL and publishing events.
4. The **API** forwards events over **Socket.IO** so the dashboard updates in real time.

Orchestration is **queue-driven** (BullMQ). **LangGraph** is used only for validation routing (retry analysis vs. continue vs. fail).

---

## Architecture

```mermaid
flowchart TB
  subgraph Client["Browser (Next.js)"]
    UI[Dashboard / Incidents]
    REST[REST client]
    SIO[Socket.IO client]
  end

  subgraph API["apps/api — NestJS"]
    HTTP[REST + Auth]
    GW[IncidentsGateway]
    SUB[Redis subscriber]
    PROD[Queue producer]
  end

  subgraph Worker["apps/worker — NestJS"]
    PROC[BullMQ processors ×6]
    AGT[Gemini agents ×6]
    LG[LangGraph router]
    PUB[Redis publisher]
  end

  subgraph Data["Infrastructure"]
    PG[(PostgreSQL)]
    RD[(Redis)]
  end

  UI --> REST --> HTTP
  UI --> SIO --> GW
  HTTP --> PG
  PROD --> RD
  RD --> PROC
  PROC --> AGT
  AGT --> LG
  PROC --> PG
  PROC --> PUB --> RD --> SUB --> GW
```

| Service | Port (local) | Role |
|---------|----------------|------|
| **web** | `3000` | Next.js UI; proxies `/backend/*` → API |
| **api** | `3001` | REST API, Firebase auth, BullMQ **producer**, Socket.IO |
| **worker** | — | BullMQ **consumer**, Gemini LLM calls, workflow routing |

All three processes must run locally (or be deployed separately in production) for end-to-end orchestration.

---

## Monorepo structure

```
sentinel-ai/
├── apps/
│   ├── web/          # Next.js 16 dashboard & marketing
│   ├── api/          # NestJS API + WebSockets + queue producer
│   └── worker/       # NestJS worker + agents + queue consumers
├── packages/
│   └── shared/       # Enums, Zod schemas, queue names, events, prompts
├── railway.toml      # Railway build/start for API
├── DEPLOYMENT.md     # Production deploy checklist
└── package.json      # npm workspaces root
```

| Package | npm name | Description |
|---------|----------|-------------|
| `apps/web` | `web` | React 19, TanStack Query, Firebase client, Recharts |
| `apps/api` | `api` | Prisma, BullMQ producer, Firebase Admin, Socket.IO |
| `apps/worker` | `worker` | LangChain + Gemini, LangGraph, BullMQ consumers |
| `packages/shared` | `@sentinel/shared` | Shared types, constants, agent output schemas |

---

## AI agents

Six agents run in a fixed pipeline. Each agent uses **Google Gemini** (`gemini-2.5-flash-lite` by default) via LangChain, with **Zod-validated JSON** outputs defined in `packages/shared`.

| # | Agent | Queue | Purpose | Key output |
|---|--------|-------|---------|------------|
| 1 | **Planner** | `planner` | Builds an investigation plan from incident context and logs | `steps`, `focusAreas`, `estimatedDurationMinutes` |
| 2 | **Classification** | `classification` | Assigns severity, category, and incident type | `severity`, `category`, `incidentType`, `confidence` |
| 3 | **Analysis** | `analysis` | Root cause analysis with evidence | `rootCause`, `affectedServices`, `evidence`, `confidence` |
| 4 | **Validation** | `validation` | Checks analysis safety and correctness | `valid`, `issues`, `safetyScore`, `requiresRetry` |
| 5 | **Remediation** | `remediation` | Proposes fix steps and rollback plan | `steps`, `rollbackPlan`, `requiresHumanApproval` |
| 6 | **Report** | `report-generation` | Compiles the final post-mortem | `summary`, `rootCause`, `remediation`, `timeline` |

**Implementation paths**

| Agent | Worker source |
|-------|----------------|
| Planner | `apps/worker/src/agents/planner/planner.agent.ts` |
| Classification | `apps/worker/src/agents/classification/classification.agent.ts` |
| Analysis | `apps/worker/src/agents/analysis/analysis.agent.ts` |
| Validation | `apps/worker/src/agents/validation/validation.agent.ts` |
| Remediation | `apps/worker/src/agents/remediation/remediation.agent.ts` |
| Report | `apps/worker/src/agents/report/report.agent.ts` |

**LLM layer:** `apps/worker/src/common/llm.service.ts` — structured JSON schema → JSON mode → manual extraction fallback.

**Prompts & schemas:** `packages/shared/src/llm/agent-prompts.ts`, `packages/shared/src/schemas/agent-outputs.ts`

---

## Workflow pipeline

### Stages

| Stage | `IncidentStatus` | Set by |
|-------|------------------|--------|
| Plan | `PLANNING` | Planner |
| Classify | `CLASSIFICATION` | Classification |
| Analyze | `ROOT_CAUSE_ANALYSIS` | Analysis |
| Validate | `VALIDATION` | Validation |
| Remediate | `REMEDIATION` | Remediation |
| Human approval | `HUMAN_APPROVAL` | Remediation (auto-advances today) |
| Report | `REPORT_GENERATION` | Report agent |
| Done | `RESOLVED` | Report stored |
| Failed | `FAILED` | Agent error or validation exhausted |

### Control flow

```
POST /incidents (API)
  → enqueue planner
  → Planner → Classification → Analysis → Validation
                    ↑_________________________|  (retry, max 3)
  → Remediation → Report → RESOLVED
```

- **BullMQ** chains jobs: each processor completes, then enqueues the next queue (`apps/worker/src/common/queue-dispatcher.service.ts`).
- **API** only enqueues the first job (`apps/api/src/queues/queue-producer.service.ts`).
- **LangGraph** (`apps/worker/src/workflows/workflow-router.service.ts`) decides after validation:
  - `retry_analysis` — re-run analysis (up to `MAX_VALIDATION_RETRIES`, default 3)
  - `remediation` — continue pipeline
  - `failed` — mark incident failed

Post-validation rules also force retry when `safetyScore < 0.5` or analysis `confidence < 0.4`.

---

## Tech stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4, TanStack Query, Framer Motion, Socket.IO client, Recharts, XYFlow |
| **API** | NestJS 11, Prisma 7, PostgreSQL, BullMQ, Socket.IO, Firebase Admin |
| **Worker** | NestJS 11, BullMQ, LangChain, `@langchain/google-genai`, LangGraph, Zod |
| **Shared** | TypeScript, Zod 4, shared enums and event types |
| **Infra** | PostgreSQL, Redis (queues + pub/sub) |
| **AI** | Google Gemini API |
| **Auth** | Firebase Authentication |

---

## Data model

Prisma schema: `apps/api/prisma/schema.prisma`

| Model | Purpose |
|-------|---------|
| `User` | Linked to Firebase UID |
| `Incident` | Title, logs, severity, category, status |
| `WorkflowExecution` | Per-incident run, `currentStage`, `retryCount` |
| `AgentExecution` | Per-agent input/output, duration, status |
| `IncidentReport` | Final generated report |

---

## Real-time updates

1. Worker/API publish `WorkflowEventPayload` to Redis channel `sentinel:workflow:events`.
2. API `RedisSubscriberService` receives events and broadcasts via Socket.IO.
3. Web clients connect to namespace `/incidents`, join room `incident:{id}`, and listen for `workflow.event`.

| Component | Path |
|-----------|------|
| Event types | `packages/shared/src/events/workflow-events.ts` |
| Gateway | `apps/api/src/websocket/incidents.gateway.ts` |
| Client hook | `apps/web/hooks/use-workflow-socket.ts` |

---

## Authentication

- **Production:** Firebase ID token in `Authorization: Bearer` header; API verifies with Firebase Admin and upserts `User` in PostgreSQL.
- **Local dev (no Firebase):** Web uses a dev bearer token; API decodes JWT payload without verification (`apps/web/lib/dev-auth.ts`).

Configure Firebase web keys on the client (`NEXT_PUBLIC_FIREBASE_*`) and Admin credentials on the API (`FIREBASE_*`).

---

## Prerequisites

- **Node.js** 20+ (22 recommended)
- **npm** 10+
- **PostgreSQL** 14+
- **Redis** 6+
- **Google Gemini API key** (`GEMINI_API_KEY`) — required for the worker
- **Firebase project** (optional for local dev with dev-auth bypass)

---

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/AnirudhS3110/Sentinel-AI.git
cd sentinel-ai   # or your clone directory name
npm install
```

### 2. Configure environment

**API** — copy and edit:

```bash
cp apps/api/.env.example apps/api/.env
```

**Worker** — use the same `.env` or a dedicated file with at least:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/sentinel
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key
```

**Web** — create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/backend
NEXT_PUBLIC_WS_URL=http://localhost:3001
NEXT_PUBLIC_WEB_URL=http://localhost:3000

# Optional: Firebase (omit to use dev-auth)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

The Next.js dev server proxies `/backend/*` to the API (`apps/web/next.config.ts`, override with `API_PROXY_TARGET`).

### 3. Database

```bash
npm run db:generate
npm run db:push    # quick start
# or
npm run db:migrate # with migrations
```

### 4. Build shared package

```bash
npm run build --workspace=@sentinel/shared
```

### 5. Run all services (three terminals)

```bash
npm run dev:api      # http://localhost:3001
npm run dev:worker   # BullMQ consumers + Gemini
npm run dev:web      # http://localhost:3000
```

### 6. Verify

```bash
curl http://localhost:3001/health
# → {"ok":true}
```

Open [http://localhost:3000](http://localhost:3000), sign in, and create an incident from the dashboard.

---

## Environment variables

### API (`apps/api`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | Yes | Redis for BullMQ and pub/sub |
| `PORT` | No | HTTP port (default `3001`; Railway sets this) |
| `CORS_ORIGIN` | Prod | Comma-separated allowed origins (e.g. Vercel URL) |
| `FIREBASE_PROJECT_ID` | Prod | Firebase Admin |
| `FIREBASE_CLIENT_EMAIL` | Prod | Firebase Admin |
| `FIREBASE_PRIVATE_KEY` | Prod | Firebase Admin (escape `\n` in PEM) |

### Worker (`apps/worker`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Same database as API |
| `REDIS_URL` | Yes | Same Redis as API |
| `GEMINI_API_KEY` | Yes | Google AI API key |
| `GEMINI_MODEL` | No | Default `gemini-2.5-flash-lite` |
| `GEMINI_TEMPERATURE` | No | Default `0` |
| `MAX_VALIDATION_RETRIES` | No | Default `3` |

### Web (`apps/web`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | REST base (local: `http://localhost:3000/backend`) |
| `NEXT_PUBLIC_WS_URL` | Yes | Socket.IO server (local: `http://localhost:3001`) |
| `NEXT_PUBLIC_WEB_URL` | No | Public site URL |
| `NEXT_PUBLIC_FIREBASE_*` | Prod | Firebase web SDK config |
| `API_PROXY_TARGET` | No | Next rewrite target (default `http://localhost:3001`) |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:web` | Start Next.js dev server |
| `npm run dev:api` | Start API in watch mode |
| `npm run dev:worker` | Start worker in watch mode |
| `npm run build` | Build shared → api → worker |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run Prisma migrations |

Per-workspace builds:

```bash
npm run build --workspace=@sentinel/shared
npm run build --workspace=api
npm run build --workspace=worker
npm run build --workspace=web
```

---

## Deployment

Production requires **three** deploy targets: **Vercel (web)**, **Railway (API)**, and **a worker process** (Railway second service, Render, Fly.io, etc.).

> Without the worker, incidents are enqueued but agents never run.

### API (Railway)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for troubleshooting (e.g. "Failed to fetch").

- Service root: **monorepo root**
- Build: `npm ci && npm run build --workspace=@sentinel/shared && npm run build --workspace=api`
- Start: `npm run start:prod --workspace=api`
- Health: `GET /health`
- Public URL: use HTTPS **without** `:3001` (e.g. `https://sentinalai-apiservice.up.railway.app`)

### Worker (separate service)

Same `DATABASE_URL`, `REDIS_URL`, and `GEMINI_API_KEY` as the API:

```bash
npm ci
npm run build --workspace=@sentinel/shared
npm run build --workspace=worker
npm run start:prod --workspace=worker
```

### Web (Vercel)

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_WEB_URL` | `https://sentinel-ai-v1.vercel.app` |
| `NEXT_PUBLIC_API_URL` | `https://sentinalai-apiservice.up.railway.app` |
| `NEXT_PUBLIC_WS_URL` | `https://sentinalai-apiservice.up.railway.app` |
| `NEXT_PUBLIC_FIREBASE_*` | Your Firebase web app |

Redeploy after changing environment variables.

---

## App routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Firebase sign-in |
| `/dashboard` | Command center, live activity |
| `/incidents/[id]` | Incident detail, agent grid, timeline |
| `/workflows` | Workflow visualization |
| `/agents` | Agent fleet metrics |
| `/reports` | Incident reports |
| `/architecture` | In-app architecture overview |

---

## License

Private / unlicensed unless otherwise specified in the repository.
