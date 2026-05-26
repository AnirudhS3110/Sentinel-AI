import { z } from 'zod';
export declare const plannerOutputSchema: z.ZodObject<{
    steps: z.ZodArray<z.ZodString>;
    estimatedDurationMinutes: z.ZodOptional<z.ZodNumber>;
    focusAreas: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const classificationOutputSchema: z.ZodObject<{
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
export declare const analysisOutputSchema: z.ZodObject<{
    rootCause: z.ZodString;
    affectedServices: z.ZodDefault<z.ZodArray<z.ZodString>>;
    evidence: z.ZodDefault<z.ZodArray<z.ZodString>>;
    confidence: z.ZodNumber;
}, z.core.$strip>;
export declare const validationOutputSchema: z.ZodObject<{
    valid: z.ZodBoolean;
    issues: z.ZodDefault<z.ZodArray<z.ZodString>>;
    safetyScore: z.ZodNumber;
    requiresRetry: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const remediationOutputSchema: z.ZodObject<{
    steps: z.ZodArray<z.ZodString>;
    rollbackPlan: z.ZodOptional<z.ZodString>;
    estimatedImpact: z.ZodOptional<z.ZodString>;
    requiresHumanApproval: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const reportOutputSchema: z.ZodObject<{
    summary: z.ZodString;
    rootCause: z.ZodString;
    remediation: z.ZodString;
    timeline: z.ZodDefault<z.ZodArray<z.ZodObject<{
        timestamp: z.ZodString;
        stage: z.ZodString;
        message: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type PlannerOutput = z.infer<typeof plannerOutputSchema>;
export type ClassificationOutput = z.infer<typeof classificationOutputSchema>;
export type AnalysisOutput = z.infer<typeof analysisOutputSchema>;
export type ValidationOutput = z.infer<typeof validationOutputSchema>;
export type RemediationOutput = z.infer<typeof remediationOutputSchema>;
export type ReportOutput = z.infer<typeof reportOutputSchema>;
