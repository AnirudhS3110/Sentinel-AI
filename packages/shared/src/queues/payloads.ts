export interface WorkflowJobPayload {
  incidentId: string;
  workflowExecutionId: string;
  userId: string;
  retryCount?: number;
}

export type AgentJobPayload = WorkflowJobPayload;
