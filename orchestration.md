You are building the frontend for SentinelAI — a realtime incident orchestration platform with AI-assisted remediation workflows.

Tech stack:

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* Socket.IO client
* TanStack Query

Design direction:

* Modern SaaS aesthetic similar to Linear, Vercel, Datadog, Sentry
* Dark infra-focused UI
* Minimal but highly polished
* Dense but readable layouts
* Subtle animations and glow effects
* Terminal/observability inspired styling

Important:

* This is NOT a chatbot product
* Frontend should visualize orchestration and realtime workflows
* Emphasize infrastructure and event-driven architecture
* Avoid generic “AI SaaS” gradients everywhere
* Avoid excessive whitespace and oversized cards
* Keep layouts engineering-focused and production-grade

Coding rules:

* Use clean folder structure
* Keep components modular and reusable
* Use human-readable formatting
* Avoid unnecessary abstraction
* Avoid giant component files
* Use realistic mock data only where backend integration is pending
* Prefer server components where appropriate
* Use websocket-driven realtime updates

Most important page:
`/incidents/[id]`

This page should feel like:

* live orchestration dashboard
* workflow execution monitor
* incident response timeline

The frontend must feel like a real engineering platform, not a generic AI demo.
