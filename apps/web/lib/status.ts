import type { IncidentStatus } from './types';

export function statusLabel(status: IncidentStatus | string): string {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function statusTone(status: string): 'running' | 'done' | 'failed' | 'idle' {
  if (status === 'RESOLVED') return 'done';
  if (status === 'FAILED') return 'failed';
  if (['PLANNING', 'CLASSIFICATION', 'ROOT_CAUSE_ANALYSIS', 'VALIDATION', 'REMEDIATION', 'HUMAN_APPROVAL', 'REPORT_GENERATION'].includes(status)) {
    return 'running';
  }
  return 'idle';
}

export function severityTone(severity?: string | null): 'low' | 'medium' | 'high' | 'critical' | 'muted' {
  switch (severity) {
    case 'LOW': return 'low';
    case 'MEDIUM': return 'medium';
    case 'HIGH': return 'high';
    case 'CRITICAL': return 'critical';
    default: return 'muted';
  }
}
