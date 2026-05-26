# SentinelAI Database Schema

## Prisma Generator

```prisma
generator client {
  provider = "prisma-client-js"
}
```

---

## Datasource

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

# ENUMS

## UserRole

```prisma
enum UserRole {
  USER
  ADMIN
}
```

---

## IncidentStatus

```prisma
enum IncidentStatus {
  INCIDENT_CREATED
  PLANNING
  CLASSIFICATION
  ROOT_CAUSE_ANALYSIS
  VALIDATION
  REMEDIATION
  HUMAN_APPROVAL
  REPORT_GENERATION
  RESOLVED
  FAILED
}
```

---

## IncidentSeverity

```prisma
enum IncidentSeverity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
```

---

## AgentType

```prisma
enum AgentType {
  PLANNER
  CLASSIFICATION
  ANALYSIS
  VALIDATION
  REMEDIATION
  REPORT_GENERATION
}
```

---

## AgentExecutionStatus

```prisma
enum AgentExecutionStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
  RETRYING
}
```

---

# MODELS

## User

```prisma
model User {
  id                 String              @id @default(cuid())

  firebaseUid        String              @unique
  email              String              @unique

  name               String?
  avatarUrl          String?

  role               UserRole            @default(USER)

  createdAt          DateTime            @default(now())
  updatedAt          DateTime            @updatedAt

  incidents          Incident[]
  workflowExecutions WorkflowExecution[]

  @@index([email])
  @@index([firebaseUid])
}
```

---

## Incident

```prisma
model Incident {
  id                 String                @id @default(cuid())

  userId             String
  user               User                  @relation(fields: [userId], references: [id])

  title              String
  description        String?
  rawLogs            String

  severity           IncidentSeverity?
  category           String?

  status             IncidentStatus        @default(INCIDENT_CREATED)

  createdAt          DateTime              @default(now())
  updatedAt          DateTime              @updatedAt

  workflowExecutions WorkflowExecution[]
  reports            IncidentReport[]

  @@index([userId])
  @@index([status])
  @@index([createdAt])
}
```

---

## WorkflowExecution

```prisma
model WorkflowExecution {
  id                 String                @id @default(cuid())

  incidentId         String
  incident           Incident              @relation(fields: [incidentId], references: [id])

  initiatedById      String?
  initiatedBy        User?                 @relation(fields: [initiatedById], references: [id])

  currentStage       IncidentStatus

  retryCount         Int                   @default(0)

  startedAt          DateTime              @default(now())
  completedAt        DateTime?

  agentExecutions    AgentExecution[]

  @@index([incidentId])
  @@index([currentStage])
}
```

---

## AgentExecution

```prisma
model AgentExecution {
  id                   String                  @id @default(cuid())

  workflowExecutionId  String
  workflowExecution    WorkflowExecution       @relation(fields: [workflowExecutionId], references: [id])

  agentType            AgentType
  status               AgentExecutionStatus

  input                Json?
  output               Json?

  error                String?

  durationMs           Int?

  startedAt            DateTime                @default(now())
  completedAt          DateTime?

  @@index([workflowExecutionId])
  @@index([agentType])
  @@index([status])
}
```

---

## IncidentReport

```prisma
model IncidentReport {
  id                 String                @id @default(cuid())

  incidentId         String
  incident           Incident              @relation(fields: [incidentId], references: [id])

  summary            String
  rootCause          String
  remediation        String

  timeline           Json?

  createdAt          DateTime              @default(now())

  @@index([incidentId])
}
```

---

# ARCHITECTURE NOTES

## Authentication

Authentication uses:

* Firebase Authentication
* Google Sign-In

Backend validates Firebase JWT using Firebase Admin SDK.

User records are persisted in PostgreSQL.

---

## Workflow Architecture

Workflow execution is:

* queue-driven
* event-driven
* stateful
* retry-capable

BullMQ handles:

* retries
* concurrency
* delayed jobs
* orchestration execution

LangGraph handles:

* workflow state
* branching
* validation loops
* sequential orchestration

---

## Event Architecture

Worker publishes events using Redis Pub/Sub.

API service subscribes and forwards events to Socket.IO clients.

Events include:

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

---

## Realtime Updates

Frontend receives realtime websocket events such as:

```txt
[10:01] Planner Agent started
[10:02] Classification completed
[10:03] Validation failed
[10:04] Retry triggered
[10:05] Remediation generated
```

---

## Agent Responsibilities

### Planner Agent

Builds workflow execution plan.

### Classification Agent

Determines severity, category, and incident type.

### Root Cause Analysis Agent

Analyzes logs and infrastructure failures.

### Validation Agent

Validates AI outputs and remediation safety.

### Remediation Agent

Generates remediation steps and suggested fixes.

### Report Generation Agent

Generates final incident report and execution summary.
