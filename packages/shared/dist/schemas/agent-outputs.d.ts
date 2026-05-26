import { z } from 'zod';
import type { AgentPromptKey } from '../llm/agent-prompts';
/**
 * Plain Zod objects for LangChain `jsonSchema` structured output.
 * Must not use z.preprocess / .default / .transform — those cannot convert to JSON Schema.
 */
export declare const plannerLlmSchema: z.ZodObject<{
    steps: z.ZodArray<z.ZodString>;
    estimatedDurationMinutes: z.ZodOptional<z.ZodNumber>;
    focusAreas: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const classificationLlmSchema: z.ZodObject<{
    severity: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>;
    category: z.ZodString;
    incidentType: z.ZodString;
    confidence: z.ZodNumber;
}, z.core.$strip>;
export declare const analysisLlmSchema: z.ZodObject<{
    rootCause: z.ZodString;
    affectedServices: z.ZodArray<z.ZodString>;
    evidence: z.ZodArray<z.ZodString>;
    confidence: z.ZodNumber;
}, z.core.$strip>;
export declare const validationLlmSchema: z.ZodObject<{
    valid: z.ZodBoolean;
    issues: z.ZodArray<z.ZodString>;
    safetyScore: z.ZodNumber;
    requiresRetry: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const remediationLlmSchema: z.ZodObject<{
    steps: z.ZodArray<z.ZodString>;
    rollbackPlan: z.ZodOptional<z.ZodString>;
    estimatedImpact: z.ZodOptional<z.ZodString>;
    requiresHumanApproval: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const reportLlmSchema: z.ZodObject<{
    summary: z.ZodString;
    rootCause: z.ZodString;
    remediation: z.ZodString;
    timeline: z.ZodOptional<z.ZodArray<z.ZodObject<{
        timestamp: z.ZodString;
        stage: z.ZodString;
        message: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
/** Schemas passed to Gemini JSON Schema mode (no transforms). */
export declare const AGENT_LLM_SCHEMAS: Record<AgentPromptKey, z.ZodTypeAny>;
export declare const plannerOutputSchema: z.ZodObject<{
    steps: z.ZodPreprocess<z.ZodDefault<z.ZodArray<z.ZodString>>>;
    estimatedDurationMinutes: z.ZodPreprocess<z.ZodOptional<z.ZodNumber>>;
    focusAreas: z.ZodPreprocess<z.ZodDefault<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
export declare const classificationOutputSchema: z.ZodObject<{
    severity: z.ZodPreprocess<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>>;
    category: z.ZodPreprocess<z.ZodString>;
    incidentType: z.ZodPreprocess<z.ZodString>;
    confidence: z.ZodPreprocess<z.ZodNumber>;
}, z.core.$strip>;
export declare const analysisOutputSchema: z.ZodObject<{
    rootCause: z.ZodPreprocess<z.ZodString>;
    affectedServices: z.ZodPreprocess<z.ZodDefault<z.ZodArray<z.ZodString>>>;
    evidence: z.ZodPreprocess<z.ZodDefault<z.ZodArray<z.ZodString>>>;
    confidence: z.ZodPreprocess<z.ZodNumber>;
}, z.core.$strip>;
export declare const validationOutputSchema: z.ZodObject<{
    valid: z.ZodPreprocess<z.ZodBoolean>;
    issues: z.ZodPreprocess<z.ZodDefault<z.ZodArray<z.ZodString>>>;
    safetyScore: z.ZodPreprocess<z.ZodNumber>;
    requiresRetry: z.ZodPreprocess<z.ZodDefault<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const remediationOutputSchema: z.ZodObject<{
    steps: z.ZodPreprocess<z.ZodDefault<z.ZodArray<z.ZodString>>>;
    rollbackPlan: z.ZodOptional<z.ZodString>;
    estimatedImpact: z.ZodOptional<z.ZodString>;
    requiresHumanApproval: z.ZodPreprocess<z.ZodDefault<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const reportOutputSchema: z.ZodObject<{
    summary: z.ZodPreprocess<z.ZodString>;
    rootCause: z.ZodPreprocess<z.ZodString>;
    remediation: z.ZodPreprocess<z.ZodString>;
    timeline: z.ZodPreprocess<z.ZodDefault<z.ZodArray<z.ZodObject<{
        timestamp: z.ZodDefault<z.ZodString>;
        stage: z.ZodDefault<z.ZodString>;
        message: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
export type PlannerOutput = z.infer<typeof plannerOutputSchema>;
export type ClassificationOutput = z.infer<typeof classificationOutputSchema>;
export type AnalysisOutput = z.infer<typeof analysisOutputSchema>;
export type ValidationOutput = z.infer<typeof validationOutputSchema>;
export type RemediationOutput = z.infer<typeof remediationOutputSchema>;
export type ReportOutput = z.infer<typeof reportOutputSchema>;
export declare function formatAgentValidationError(error: z.ZodError): string;
