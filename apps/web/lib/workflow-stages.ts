import type { IncidentStatus } from './types';

export const PIPELINE_STAGES: { key: IncidentStatus; label: string }[] = [
  { key: 'PLANNING', label: 'Plan' },
  { key: 'CLASSIFICATION', label: 'Classify' },
  { key: 'ROOT_CAUSE_ANALYSIS', label: 'Analyze' },
  { key: 'VALIDATION', label: 'Validate' },
  { key: 'REMEDIATION', label: 'Remediate' },
  { key: 'REPORT_GENERATION', label: 'Report' },
  { key: 'RESOLVED', label: 'Resolved' },
];

export function stageIndex(status: IncidentStatus | string): number {
  if (status === 'FAILED') return -1;
  if (status === 'INCIDENT_CREATED') return 0;
  const idx = PIPELINE_STAGES.findIndex((s) => s.key === status);
  if (idx >= 0) return idx;
  if (status === 'HUMAN_APPROVAL') return PIPELINE_STAGES.findIndex((s) => s.key === 'REMEDIATION');
  return 0;
}

export function workflowHealth(status: IncidentStatus | string): 'running' | 'done' | 'failed' | 'idle' {
  if (status === 'RESOLVED') return 'done';
  if (status === 'FAILED') return 'failed';
  if (status === 'INCIDENT_CREATED') return 'idle';
  return 'running';
}
