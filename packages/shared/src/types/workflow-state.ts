import {
  AnalysisOutput,
  ClassificationOutput,
  PlannerOutput,
  RemediationOutput,
  ReportOutput,
  ValidationOutput,
} from '../schemas/agent-outputs';
import { IncidentStatus } from '../enums';

export interface WorkflowGraphState {
  incidentId: string;
  workflowExecutionId: string;
  userId: string;
  title: string;
  description?: string;
  rawLogs: string;
  currentStage: IncidentStatus;
  retryCount: number;
  plannerOutput?: PlannerOutput;
  classificationOutput?: ClassificationOutput;
  analysisOutput?: AnalysisOutput;
  validationOutput?: ValidationOutput;
  remediationOutput?: RemediationOutput;
  reportOutput?: ReportOutput;
  error?: string;
}
