"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportOutputSchema = exports.remediationOutputSchema = exports.validationOutputSchema = exports.analysisOutputSchema = exports.classificationOutputSchema = exports.plannerOutputSchema = exports.AGENT_LLM_SCHEMAS = exports.reportLlmSchema = exports.remediationLlmSchema = exports.validationLlmSchema = exports.analysisLlmSchema = exports.classificationLlmSchema = exports.plannerLlmSchema = void 0;
exports.formatAgentValidationError = formatAgentValidationError;
const zod_1 = require("zod");
const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
/**
 * Plain Zod objects for LangChain `jsonSchema` structured output.
 * Must not use z.preprocess / .default / .transform — those cannot convert to JSON Schema.
 */
exports.plannerLlmSchema = zod_1.z.object({
    steps: zod_1.z.array(zod_1.z.string()),
    estimatedDurationMinutes: zod_1.z.number().min(1).optional(),
    focusAreas: zod_1.z.array(zod_1.z.string()),
});
exports.classificationLlmSchema = zod_1.z.object({
    severity: zod_1.z.enum(SEVERITIES),
    category: zod_1.z.string(),
    incidentType: zod_1.z.string(),
    confidence: zod_1.z.number().min(0).max(1),
});
exports.analysisLlmSchema = zod_1.z.object({
    rootCause: zod_1.z.string(),
    affectedServices: zod_1.z.array(zod_1.z.string()),
    evidence: zod_1.z.array(zod_1.z.string()),
    confidence: zod_1.z.number().min(0).max(1),
});
exports.validationLlmSchema = zod_1.z.object({
    valid: zod_1.z.boolean(),
    issues: zod_1.z.array(zod_1.z.string()),
    safetyScore: zod_1.z.number().min(0).max(1),
    requiresRetry: zod_1.z.boolean().optional(),
});
exports.remediationLlmSchema = zod_1.z.object({
    steps: zod_1.z.array(zod_1.z.string()),
    rollbackPlan: zod_1.z.string().optional(),
    estimatedImpact: zod_1.z.string().optional(),
    requiresHumanApproval: zod_1.z.boolean().optional(),
});
const timelineEntryLlmSchema = zod_1.z.object({
    timestamp: zod_1.z.string(),
    stage: zod_1.z.string(),
    message: zod_1.z.string(),
});
exports.reportLlmSchema = zod_1.z.object({
    summary: zod_1.z.string(),
    rootCause: zod_1.z.string(),
    remediation: zod_1.z.string(),
    timeline: zod_1.z.array(timelineEntryLlmSchema).optional(),
});
/** Schemas passed to Gemini JSON Schema mode (no transforms). */
exports.AGENT_LLM_SCHEMAS = {
    planner: exports.plannerLlmSchema,
    classification: exports.classificationLlmSchema,
    analysis: exports.analysisLlmSchema,
    validation: exports.validationLlmSchema,
    remediation: exports.remediationLlmSchema,
    report: exports.reportLlmSchema,
};
const looseStringArray = () => zod_1.z.preprocess((val) => (Array.isArray(val) ? val.filter((x) => typeof x === 'string') : []), zod_1.z.array(zod_1.z.string()).default([]));
const normalizeSeverity = (val) => {
    if (typeof val !== 'string')
        return 'MEDIUM';
    const upper = val.toUpperCase().trim();
    if (SEVERITIES.includes(upper))
        return upper;
    if (['SEV1', 'P0', 'P1'].includes(upper))
        return 'CRITICAL';
    if (['SEV2', 'P2'].includes(upper))
        return 'HIGH';
    if (['SEV3', 'P3'].includes(upper))
        return 'MEDIUM';
    return 'MEDIUM';
};
const normalizeConfidence = (val) => {
    if (typeof val === 'number' && !Number.isNaN(val))
        return Math.min(1, Math.max(0, val));
    if (typeof val === 'string') {
        const n = parseFloat(val);
        if (!Number.isNaN(n))
            return Math.min(1, Math.max(0, n));
    }
    return 0.5;
};
const nonEmptyString = (fallback) => zod_1.z.preprocess((val) => {
    if (typeof val === 'string' && val.trim().length > 0)
        return val.trim();
    return fallback;
}, zod_1.z.string().min(1));
exports.plannerOutputSchema = zod_1.z.object({
    steps: looseStringArray(),
    estimatedDurationMinutes: zod_1.z.preprocess((val) => (typeof val === 'number' && val > 0 ? val : undefined), zod_1.z.number().positive().optional()),
    focusAreas: looseStringArray(),
});
exports.classificationOutputSchema = zod_1.z.object({
    severity: zod_1.z.preprocess(normalizeSeverity, zod_1.z.enum(SEVERITIES)),
    category: nonEmptyString('infrastructure'),
    incidentType: nonEmptyString('unknown'),
    confidence: zod_1.z.preprocess(normalizeConfidence, zod_1.z.number().min(0).max(1)),
});
exports.analysisOutputSchema = zod_1.z.object({
    rootCause: nonEmptyString('Root cause could not be determined from available logs.'),
    affectedServices: looseStringArray(),
    evidence: looseStringArray(),
    confidence: zod_1.z.preprocess(normalizeConfidence, zod_1.z.number().min(0).max(1)),
});
exports.validationOutputSchema = zod_1.z.object({
    valid: zod_1.z.preprocess((val) => val === true || val === 'true', zod_1.z.boolean()),
    issues: looseStringArray(),
    safetyScore: zod_1.z.preprocess(normalizeConfidence, zod_1.z.number().min(0).max(1)),
    requiresRetry: zod_1.z.preprocess((val) => val === true || val === 'true', zod_1.z.boolean().default(false)),
});
exports.remediationOutputSchema = zod_1.z.object({
    steps: looseStringArray(),
    rollbackPlan: zod_1.z.string().optional(),
    estimatedImpact: zod_1.z.string().optional(),
    requiresHumanApproval: zod_1.z.preprocess((val) => val !== false && val !== 'false', zod_1.z.boolean().default(true)),
});
const timelineEntrySchema = zod_1.z.object({
    timestamp: zod_1.z.string().default(''),
    stage: zod_1.z.string().default(''),
    message: zod_1.z.string().default(''),
});
exports.reportOutputSchema = zod_1.z.object({
    summary: nonEmptyString('Incident report summary pending.'),
    rootCause: nonEmptyString('Root cause pending.'),
    remediation: nonEmptyString('Remediation pending.'),
    timeline: zod_1.z.preprocess((val) => (Array.isArray(val) ? val : []), zod_1.z.array(timelineEntrySchema).default([])),
});
function formatAgentValidationError(error) {
    const parts = error.issues.map((issue) => {
        const path = issue.path.length ? issue.path.join('.') : 'root';
        if (issue.code === 'invalid_type' && issue.expected === 'array') {
            return `missing ${path} array`;
        }
        return `${path}: ${issue.message}`;
    });
    return `Validation failed: ${parts.join('; ')}`;
}
