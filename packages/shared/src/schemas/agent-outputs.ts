import { z } from 'zod';
import type { AgentPromptKey } from '../llm/agent-prompts';

const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

/**
 * Plain Zod objects for LangChain `jsonSchema` structured output.
 * Must not use z.preprocess / .default / .transform — those cannot convert to JSON Schema.
 */
export const plannerLlmSchema = z.object({
  steps: z.array(z.string()),
  estimatedDurationMinutes: z.number().min(1).optional(),
  focusAreas: z.array(z.string()),
});

export const classificationLlmSchema = z.object({
  severity: z.enum(SEVERITIES),
  category: z.string(),
  incidentType: z.string(),
  confidence: z.number().min(0).max(1),
});

export const analysisLlmSchema = z.object({
  rootCause: z.string(),
  affectedServices: z.array(z.string()),
  evidence: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

export const validationLlmSchema = z.object({
  valid: z.boolean(),
  issues: z.array(z.string()),
  safetyScore: z.number().min(0).max(1),
  requiresRetry: z.boolean().optional(),
});

export const remediationLlmSchema = z.object({
  steps: z.array(z.string()),
  rollbackPlan: z.string().optional(),
  estimatedImpact: z.string().optional(),
  requiresHumanApproval: z.boolean().optional(),
});

const timelineEntryLlmSchema = z.object({
  timestamp: z.string(),
  stage: z.string(),
  message: z.string(),
});

export const reportLlmSchema = z.object({
  summary: z.string(),
  rootCause: z.string(),
  remediation: z.string(),
  timeline: z.array(timelineEntryLlmSchema).optional(),
});

/** Schemas passed to Gemini JSON Schema mode (no transforms). */
export const AGENT_LLM_SCHEMAS: Record<AgentPromptKey, z.ZodTypeAny> = {
  planner: plannerLlmSchema,
  classification: classificationLlmSchema,
  analysis: analysisLlmSchema,
  validation: validationLlmSchema,
  remediation: remediationLlmSchema,
  report: reportLlmSchema,
};

const looseStringArray = () =>
  z.preprocess(
    (val) => (Array.isArray(val) ? val.filter((x): x is string => typeof x === 'string') : []),
    z.array(z.string()).default([]),
  );

const normalizeSeverity = (val: unknown): (typeof SEVERITIES)[number] => {
  if (typeof val !== 'string') return 'MEDIUM';
  const upper = val.toUpperCase().trim();
  if ((SEVERITIES as readonly string[]).includes(upper)) return upper as (typeof SEVERITIES)[number];
  if (['SEV1', 'P0', 'P1'].includes(upper)) return 'CRITICAL';
  if (['SEV2', 'P2'].includes(upper)) return 'HIGH';
  if (['SEV3', 'P3'].includes(upper)) return 'MEDIUM';
  return 'MEDIUM';
};

const normalizeConfidence = (val: unknown): number => {
  if (typeof val === 'number' && !Number.isNaN(val)) return Math.min(1, Math.max(0, val));
  if (typeof val === 'string') {
    const n = parseFloat(val);
    if (!Number.isNaN(n)) return Math.min(1, Math.max(0, n));
  }
  return 0.5;
};

const nonEmptyString = (fallback: string) =>
  z.preprocess((val) => {
    if (typeof val === 'string' && val.trim().length > 0) return val.trim();
    return fallback;
  }, z.string().min(1));

export const plannerOutputSchema = z.object({
  steps: looseStringArray(),
  estimatedDurationMinutes: z.preprocess(
    (val) => (typeof val === 'number' && val > 0 ? val : undefined),
    z.number().positive().optional(),
  ),
  focusAreas: looseStringArray(),
});

export const classificationOutputSchema = z.object({
  severity: z.preprocess(normalizeSeverity, z.enum(SEVERITIES)),
  category: nonEmptyString('infrastructure'),
  incidentType: nonEmptyString('unknown'),
  confidence: z.preprocess(normalizeConfidence, z.number().min(0).max(1)),
});

export const analysisOutputSchema = z.object({
  rootCause: nonEmptyString('Root cause could not be determined from available logs.'),
  affectedServices: looseStringArray(),
  evidence: looseStringArray(),
  confidence: z.preprocess(normalizeConfidence, z.number().min(0).max(1)),
});

export const validationOutputSchema = z.object({
  valid: z.preprocess((val) => val === true || val === 'true', z.boolean()),
  issues: looseStringArray(),
  safetyScore: z.preprocess(normalizeConfidence, z.number().min(0).max(1)),
  requiresRetry: z.preprocess((val) => val === true || val === 'true', z.boolean().default(false)),
});

export const remediationOutputSchema = z.object({
  steps: looseStringArray(),
  rollbackPlan: z.string().optional(),
  estimatedImpact: z.string().optional(),
  requiresHumanApproval: z.preprocess((val) => val !== false && val !== 'false', z.boolean().default(true)),
});

const timelineEntrySchema = z.object({
  timestamp: z.string().default(''),
  stage: z.string().default(''),
  message: z.string().default(''),
});

export const reportOutputSchema = z.object({
  summary: nonEmptyString('Incident report summary pending.'),
  rootCause: nonEmptyString('Root cause pending.'),
  remediation: nonEmptyString('Remediation pending.'),
  timeline: z.preprocess(
    (val) => (Array.isArray(val) ? val : []),
    z.array(timelineEntrySchema).default([]),
  ),
});

export type PlannerOutput = z.infer<typeof plannerOutputSchema>;
export type ClassificationOutput = z.infer<typeof classificationOutputSchema>;
export type AnalysisOutput = z.infer<typeof analysisOutputSchema>;
export type ValidationOutput = z.infer<typeof validationOutputSchema>;
export type RemediationOutput = z.infer<typeof remediationOutputSchema>;
export type ReportOutput = z.infer<typeof reportOutputSchema>;

export function formatAgentValidationError(error: z.ZodError): string {
  const parts = error.issues.map((issue) => {
    const path = issue.path.length ? issue.path.join('.') : 'root';
    if (issue.code === 'invalid_type' && issue.expected === 'array') {
      return `missing ${path} array`;
    }
    return `${path}: ${issue.message}`;
  });
  return `Validation failed: ${parts.join('; ')}`;
}
