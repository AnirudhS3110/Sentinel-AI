"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportOutputSchema = exports.remediationOutputSchema = exports.validationOutputSchema = exports.analysisOutputSchema = exports.classificationOutputSchema = exports.plannerOutputSchema = void 0;
const zod_1 = require("zod");
exports.plannerOutputSchema = zod_1.z.object({
    steps: zod_1.z.array(zod_1.z.string()).min(1),
    estimatedDurationMinutes: zod_1.z.number().positive().optional(),
    focusAreas: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.classificationOutputSchema = zod_1.z.object({
    severity: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    category: zod_1.z.string().min(1),
    incidentType: zod_1.z.string().min(1),
    confidence: zod_1.z.number().min(0).max(1),
});
exports.analysisOutputSchema = zod_1.z.object({
    rootCause: zod_1.z.string().min(10),
    affectedServices: zod_1.z.array(zod_1.z.string()).default([]),
    evidence: zod_1.z.array(zod_1.z.string()).default([]),
    confidence: zod_1.z.number().min(0).max(1),
});
exports.validationOutputSchema = zod_1.z.object({
    valid: zod_1.z.boolean(),
    issues: zod_1.z.array(zod_1.z.string()).default([]),
    safetyScore: zod_1.z.number().min(0).max(1),
    requiresRetry: zod_1.z.boolean().default(false),
});
exports.remediationOutputSchema = zod_1.z.object({
    steps: zod_1.z.array(zod_1.z.string()).min(1),
    rollbackPlan: zod_1.z.string().optional(),
    estimatedImpact: zod_1.z.string().optional(),
    requiresHumanApproval: zod_1.z.boolean().default(true),
});
exports.reportOutputSchema = zod_1.z.object({
    summary: zod_1.z.string().min(10),
    rootCause: zod_1.z.string().min(10),
    remediation: zod_1.z.string().min(10),
    timeline: zod_1.z.array(zod_1.z.object({
        timestamp: zod_1.z.string(),
        stage: zod_1.z.string(),
        message: zod_1.z.string(),
    })).default([]),
});
//# sourceMappingURL=agent-outputs.js.map