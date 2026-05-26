Build the complete frontend for SentinelAI phase-by-phase.

Frontend stack:

* Next.js App Router
* TypeScript
* Tailwind
* shadcn/ui
* Framer Motion
* Socket.IO client
* TanStack Query
* Firebase Auth

Use the existing backend APIs and websocket architecture.

Do NOT build fake backend logic.
Integrate with the real backend structure.

Complete ONE phase fully before moving to the next.

---

# PHASE 1 — FOUNDATION SETUP

Set up:

* App Router structure
* Tailwind + shadcn
* dark theme
* global layout
* typography system
* reusable page container
* sidebar/navbar layout
* query provider
* socket provider
* auth provider
* loading states
* skeleton loaders
* toast system

Design language:

* dark observability aesthetic
* subtle borders
* muted backgrounds
* glass/blur effects used minimally
* monospace accents
* compact spacing
* modern SaaS polish

Create:

* responsive sidebar
* top navigation
* command/menu button
* user dropdown
* reusable status badges
* reusable timeline components

---

# PHASE 2 — AUTHENTICATION

Build:
`/login`

Features:

* Firebase Google Sign-In
* modern centered auth card
* loading states
* auth persistence
* protected routes
* redirect to dashboard after login

UI should feel:

* clean
* premium
* minimal
* infra-focused

Avoid generic auth templates.

---

# PHASE 3 — DASHBOARD

Build:
`/dashboard`

Purpose:
Central orchestration overview.

Sections:

## Top Metrics

Show:

* Active Incidents
* Running Workflows
* Failed Executions
* Resolved Incidents

Use animated metric cards.

---

## Incident Table

Columns:

* Incident Title
* Severity
* Current Stage
* Workflow Status
* Created Time

Features:

* status badges
* hover states
* clickable rows
* realtime status updates
* empty states
* loading states

---

## Create Incident Modal

Fields:

* title
* description
* raw logs

Submit button:
“Start Workflow”

Use real API integration.

After creation:
redirect to incident details page.

---

# PHASE 4 — INCIDENT DETAILS PAGE

Build:
`/incidents/[id]`

THIS IS THE MOST IMPORTANT PAGE.

This page should feel like:

* live workflow execution dashboard
* incident command center
* orchestration monitor

Layout:

* responsive multi-column dashboard layout
* sticky incident header
* timeline-driven structure

Sections:

---

## Incident Overview Card

Show:

* title
* severity
* status
* current stage
* root cause
* timestamps

---

## LIVE WORKFLOW TIMELINE

MOST IMPORTANT FEATURE.

Use websocket updates.

Timeline events:

* planner started
* classification completed
* validation failed
* retry triggered
* remediation completed
* report generated

Each event should show:

* timestamp
* stage
* status
* animated progression

Use:

* green for completed
* yellow for running
* red for failed

Timeline should animate as new websocket events arrive.

---

## Agent Execution Grid

Cards for:

* Planner
* Classification
* Analysis
* Validation
* Remediation
* Report Generation

Each card shows:

* execution status
* duration
* retry count
* structured outputs
* execution metadata

Use expandable sections for raw outputs.

---

## Final Report Panel

Render:

* summary
* root cause
* remediation steps
* generated timeline

Beautifully formatted.

---

## Raw Logs Panel

Terminal-style expandable log viewer.

Monospace.
Scrollable.
Infra aesthetic.

---

# PHASE 5 — LANDING PAGE

Build:
`/`

Landing page should feel:

* modern
* engineering-focused
* architecture-driven

NOT generic AI marketing.

Hero section:
“Realtime Incident Orchestration Platform”

Subheading:
“Event-driven incident workflows with AI-assisted remediation and realtime execution visibility.”

Sections:

* architecture overview
* orchestration workflow visualization
* realtime execution system
* event-driven architecture
* retry orchestration
* websocket infrastructure
* workflow lifecycle
* feature grid
* engineering highlights
* CTA

Add subtle animations and motion.

Use:

* grid backgrounds
* terminal sections
* architecture-inspired visuals
* workflow diagrams
* execution flow cards

---

# PHASE 6 — ARCHITECTURE PAGE

Build:
`/architecture`

Purpose:
Explain engineering depth visually.

Include:

* frontend architecture
* backend architecture
* workers
* BullMQ
* Redis Pub/Sub
* websocket flow
* LangGraph orchestration
* retry lifecycle
* event propagation

Create beautiful animated architecture sections.

This page should help recruiters quickly understand:

* distributed systems thinking
* event-driven architecture
* orchestration depth
* realtime infrastructure

---

# IMPORTANT UI RULES

* Avoid excessive gradients
* Avoid generic AI SaaS aesthetic
* Use compact engineering-focused layouts
* Use meaningful animations only
* Prioritize clarity and orchestration visibility
* Maintain visual consistency across all pages
* Use reusable UI primitives
* Prefer elegant subtle motion over flashy motion

---

# IMPORTANT ENGINEERING RULES

* Use proper loading/error states
* Use typed API clients
* Use websocket event handling cleanly
* Keep realtime state synchronized
* Use reusable hooks
* Avoid prop drilling
* Avoid unnecessary context usage
* Keep components maintainable

---

# FINAL GOAL

The frontend should feel like:

* a production-grade orchestration platform
* an observability system
* a realtime incident response dashboard

NOT:

* an AI wrapper
* a chatbot app
* a prompt playground
