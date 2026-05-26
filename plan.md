Build the complete backend architecture for SentinelAI — an AI-powered autonomous infrastructure incident orchestration platform.

This is a production-style event-driven orchestration backend using:

* NestJS
* BullMQ
* Redis
* Socket.IO
* LangGraph
* Prisma
* PostgreSQL
* Firebase Authentication
* TypeScript

The goal is to build a realistic startup-grade orchestration platform that feels production-ready, scalable, observable, modular, and maintainable without unnecessary enterprise overengineering.

==================================================
FINAL BACKEND ARCHITECTURE
==========================

The monorepo structure already exists:

```txt
apps/
├── api/
└── worker/

packages/
└── shared/
```

There are ONLY two backend runtimes:

1. API Service
2. Worker Service

Both are separate NestJS applications.

The worker service contains ALL agents internally.

Do NOT generate:

* separate services per agent
* unnecessary microservices
* distributed infrastructure complexity

==================================================
API SERVICE RESPONSIBILITIES
============================

apps/api is responsible for:

* REST APIs
* Socket.IO gateway
* workflow initiation
* incident retrieval
* report retrieval
* Redis Pub/Sub subscription
* websocket broadcasting
* Firebase JWT validation

Suggested structure:

```txt
apps/api/src/
├── incidents/
├── workflows/
├── websocket/
├── redis/
├── queues/
├── reports/
├── auth/
├── prisma/
├── config/
├── common/
└── main.ts
```

==================================================
WORKER SERVICE RESPONSIBILITIES
===============================

apps/worker is responsible for:

* BullMQ processors
* LangGraph orchestration
* AI agents
* workflow execution
* retries
* remediation generation
* report generation
* workflow event publishing

Suggested structure:

```txt
apps/worker/src/
├── agents/
│   ├── planner/
│   ├── classification/
│   ├── analysis/
│   ├── validation/
│   ├── remediation/
│   └── report-generation/
│
├── workflows/
├── queues/
├── redis/
├── prisma/
├── config/
├── common/
└── main.ts
```

==================================================
SHARED PACKAGE RESPONSIBILITIES
===============================

packages/shared should contain:

* shared enums
* shared types
* shared DTOs
* shared Zod schemas
* queue payloads
* event contracts
* constants
* utility helpers

Suggested structure:

```txt
packages/shared/src/
├── enums/
├── types/
├── schemas/
├── events/
├── dto/
├── queues/
├── constants/
└── utils/
```

==================================================
WORKFLOW EXECUTION MODEL
========================

The workflow is:

* queue-driven
* event-driven
* stateful
* retry-capable
* observable
* realtime-enabled

Workflow stages:

1. INCIDENT_CREATED
2. PLANNING
3. CLASSIFICATION
4. ROOT_CAUSE_ANALYSIS
5. VALIDATION
6. REMEDIATION
7. HUMAN_APPROVAL
8. REPORT_GENERATION
9. RESOLVED
10. FAILED

Workflow is MOSTLY sequential:

Planner
↓
Classification
↓
Analysis
↓
Validation

If validation fails:
Retry Analysis
↓
Validation

If validation succeeds:
Remediation
↓
Human Approval
↓
Report Generation
↓
Resolved

Multiple incidents may process concurrently using BullMQ concurrency.

==================================================
RESPONSIBILITY SEPARATION
=========================

BullMQ handles:

* async execution
* retries
* delayed jobs
* queue orchestration
* concurrency
* resilience

LangGraph handles:

* workflow state
* branching
* retry routing
* execution context
* workflow orchestration logic

Redis Pub/Sub handles ONLY:

* realtime event propagation
* websocket event distribution

Do NOT use Redis Pub/Sub for inter-agent communication.

==================================================
AUTHENTICATION ARCHITECTURE
===========================

Authentication uses:

* Firebase Authentication
* Google Sign-In

Frontend sends Firebase JWT to backend.

Backend validates Firebase JWT using Firebase Admin SDK.

PostgreSQL stores:

* users
* incidents
* workflows
* reports
* execution traces

Firebase is ONLY the identity provider.

==================================================
DATABASE REQUIREMENTS
=====================

Use Prisma with PostgreSQL.

Use:

* CUID IDs
* proper indexes
* enums
* timestamps
* JSON fields where appropriate
* production-grade relations

Implement these models:

* User
* Incident
* WorkflowExecution
* AgentExecution
* IncidentReport

Use the finalized SCHEMA.md definitions exactly.

Database should support:

* observability
* workflow tracing
* realtime updates
* retry visibility
* agent execution history

==================================================
QUEUE SYSTEM
============

Implement BullMQ queues for:

* planner
* classification
* analysis
* validation
* remediation
* report-generation

Requirements:

* typed payloads
* retries
* exponential backoff
* dead-letter handling
* concurrency support
* reusable queue infrastructure

Worker service should process queues internally.

==================================================
EVENT SYSTEM
============

Implement Redis Pub/Sub event architecture.

Worker publishes events.

API subscribes and forwards to Socket.IO clients.

Workflow events:

* incident.created
* workflow.started
* planning.completed
* classification.completed
* analysis.completed
* validation.failed
* remediation.generated
* report.generated
* workflow.completed
* workflow.failed

Requirements:

* typed event payloads
* centralized publishers
* centralized subscribers
* event serialization
* event validation

==================================================
SOCKET.IO REALTIME ARCHITECTURE
===============================

Implement realtime websocket updates.

Clients subscribe to:

```txt
incident:{incidentId}
```

Frontend should receive realtime events like:

```txt
[10:01] Planner Agent started
[10:02] Classification completed
[10:03] Validation failed
[10:04] Retry triggered
[10:05] Remediation generated
```

Payloads should include:

* timestamps
* workflow stage
* incidentId
* retry metadata
* execution metadata

==================================================
LANGGRAPH IMPLEMENTATION
========================

Implement LangGraph orchestration for:

* workflow state
* sequential execution
* branching
* validation loops
* retry routing
* human approval routing

The LangGraph workflow should orchestrate:

* PlannerAgent
* ClassificationAgent
* RootCauseAnalysisAgent
* ValidationAgent
* RemediationAgent
* ReportGenerationAgent

Each agent should contain:

* prompts
* schemas
* execution services
* validators
* typed outputs

Validation agent responsibilities:

* validate remediation safety
* detect malformed outputs
* reject hallucinated remediation
* validate confidence thresholds

==================================================
API IMPLEMENTATION
==================

Implement:

* incident creation endpoint
* incident retrieval endpoint
* workflow retrieval endpoint
* workflow timeline endpoint
* report retrieval endpoint

Create:
POST /incidents

Payload:

* title
* description
* rawLogs

On incident creation:

1. persist incident
2. initialize workflow execution
3. publish incident.created event
4. enqueue planner job

Requirements:

* DTO validation
* structured API responses
* typed responses
* pagination support
* proper error handling

==================================================
CODE QUALITY REQUIREMENTS
=========================

Requirements:

* clean readable TypeScript
* human-like formatting
* compact readable functions
* avoid excessive line breaks
* avoid vertically stretched formatting
* avoid unnecessary abstractions
* modular architecture
* reusable services
* proper dependency injection
* maintainable codebase
* typed contracts everywhere

Formatting expectations:

* do not unnecessarily move to new lines after opening brackets
* avoid AI-style formatting
* maintain compact readable spacing
* code should feel naturally human-written

Do NOT generate:

* toy implementations
* fake placeholder services
* fake enterprise architecture
* unnecessary complexity
* deeply nested abstraction layers

Generate realistic scalable backend architecture and implementation suitable for a modern AI orchestration SaaS platform.
