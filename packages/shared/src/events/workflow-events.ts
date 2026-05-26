import { IncidentStatus } from '../enums';

export enum WorkflowEventType {
  INCIDENT_CREATED = 'incident.created',
  WORKFLOW_STARTED = 'workflow.started',
  PLANNING_COMPLETED = 'planning.completed',
  CLASSIFICATION_COMPLETED = 'classification.completed',
  ANALYSIS_COMPLETED = 'analysis.completed',
  VALIDATION_FAILED = 'validation.failed',
  REMEDIATION_GENERATED = 'remediation.generated',
  REPORT_GENERATED = 'report.generated',
  WORKFLOW_COMPLETED = 'workflow.completed',
  WORKFLOW_FAILED = 'workflow.failed',
  AGENT_STARTED = 'agent.started',
  AGENT_COMPLETED = 'agent.completed',
  RETRY_TRIGGERED = 'retry.triggered',
}

export interface WorkflowEventPayload {
  type: WorkflowEventType;
  incidentId: string;
  workflowExecutionId: string;
  timestamp: string;
  stage?: IncidentStatus;
  message: string;
  retryCount?: number;
  metadata?: Record<string, unknown>;
}

export interface WorkflowEventMessage {
  event: WorkflowEventPayload;
}
