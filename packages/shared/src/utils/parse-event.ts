import { z } from 'zod';
import { WorkflowEventMessage } from '../events/workflow-events';

const eventMessageSchema = z.object({
  event: z.object({
    type: z.string(),
    incidentId: z.string(),
    workflowExecutionId: z.string(),
    timestamp: z.string(),
    message: z.string(),
    stage: z.string().optional(),
    retryCount: z.number().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
});

export function parseWorkflowEventMessage(raw: string): WorkflowEventMessage | null {
  try {
    const parsed = JSON.parse(raw);
    const result = eventMessageSchema.safeParse(parsed);
    return result.success ? (result.data as WorkflowEventMessage) : null;
  } catch {
    return null;
  }
}
