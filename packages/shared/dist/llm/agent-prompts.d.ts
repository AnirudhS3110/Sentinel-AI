export declare const JSON_ONLY_INSTRUCTION = "Return ONLY valid JSON. No markdown. No explanations. No code blocks.";
/** Example shapes — models must match these keys and types exactly. */
export declare const AGENT_SCHEMA_HINTS: {
    readonly planner: "{\"steps\":[\"investigate logs\",\"identify blast radius\"],\"focusAreas\":[\"database\"],\"estimatedDurationMinutes\":30}";
    readonly classification: "{\"severity\":\"HIGH\",\"category\":\"database\",\"incidentType\":\"connection_pool_exhaustion\",\"confidence\":0.85}";
    readonly analysis: "{\"rootCause\":\"Detailed root cause at least ten characters\",\"affectedServices\":[\"api\"],\"evidence\":[\"log line\"],\"confidence\":0.8}";
    readonly validation: "{\"valid\":true,\"issues\":[],\"safetyScore\":0.9,\"requiresRetry\":false}";
    readonly remediation: "{\"steps\":[\"restart service\"],\"rollbackPlan\":\"revert deploy\",\"requiresHumanApproval\":true}";
    readonly report: "{\"summary\":\"Incident summary at least ten chars\",\"rootCause\":\"Root cause narrative\",\"remediation\":\"Remediation narrative\",\"timeline\":[]}";
};
export type AgentPromptKey = keyof typeof AGENT_SCHEMA_HINTS;
