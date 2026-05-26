export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus =
  | 'INCIDENT_CREATED'
  | 'PLANNING'
  | 'CLASSIFICATION'
  | 'ROOT_CAUSE_ANALYSIS'
  | 'VALIDATION'
  | 'REMEDIATION'
  | 'HUMAN_APPROVAL'
  | 'REPORT_GENERATION'
  | 'RESOLVED'
  | 'FAILED';

export interface User {
  id: string;
  email: string;
  name?: string | null;
}

export interface Incident {
  id: string;
  title: string;
  description?: string | null;
  rawLogs: string;
  severity?: IncidentSeverity | null;
  category?: string | null;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
  workflowExecutions?: WorkflowExecution[];
  reports?: IncidentReport[];
}

export interface WorkflowExecution {
  id: string;
  incidentId: string;
  currentStage: IncidentStatus;
  retryCount: number;
  startedAt: string;
  completedAt?: string | null;
  agentExecutions?: AgentExecution[];
}

export interface AgentExecution {
  id: string;
  agentType: string;
  status: string;
  input?: unknown;
  output?: unknown;
  error?: string | null;
  durationMs?: number | null;
  startedAt: string;
  completedAt?: string | null;
}

export interface IncidentReport {
  id: string;
  summary: string;
  rootCause: string;
  remediation: string;
  timeline?: unknown;
  createdAt: string;
}

export interface PaginatedIncidents {
  data: Incident[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
