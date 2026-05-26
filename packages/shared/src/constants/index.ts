export const BULLMQ_PREFIX = 'bull';

export const QUEUE_NAMES = {
  PLANNER: 'planner',
  CLASSIFICATION: 'classification',
  ANALYSIS: 'analysis',
  VALIDATION: 'validation',
  REMEDIATION: 'remediation',
  REPORT_GENERATION: 'report-generation',
} as const;

export const REDIS_CHANNELS = {
  WORKFLOW_EVENTS: 'sentinel:workflow:events',
} as const;

export const DEFAULT_QUEUE_OPTS = {
  attempts: 3,
  backoff: { type: 'exponential' as const, delay: 2000 },
  removeOnComplete: 100,
  removeOnFail: 200,
};

export const WORKFLOW_CONCURRENCY = 5;
