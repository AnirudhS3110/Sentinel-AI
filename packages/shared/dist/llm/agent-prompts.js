"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AGENT_SCHEMA_HINTS = exports.JSON_ONLY_INSTRUCTION = void 0;
exports.JSON_ONLY_INSTRUCTION = 'Return ONLY valid JSON. No markdown. No explanations. No code blocks.';
/** Example shapes — models must match these keys and types exactly. */
exports.AGENT_SCHEMA_HINTS = {
    planner: '{"steps":["investigate logs","identify blast radius"],"focusAreas":["database"],"estimatedDurationMinutes":30}',
    classification: '{"severity":"HIGH","category":"database","incidentType":"connection_pool_exhaustion","confidence":0.85}',
    analysis: '{"rootCause":"Detailed root cause at least ten characters","affectedServices":["api"],"evidence":["log line"],"confidence":0.8}',
    validation: '{"valid":true,"issues":[],"safetyScore":0.9,"requiresRetry":false}',
    remediation: '{"steps":["restart service"],"rollbackPlan":"revert deploy","requiresHumanApproval":true}',
    report: '{"summary":"Incident summary at least ten chars","rootCause":"Root cause narrative","remediation":"Remediation narrative","timeline":[]}',
};
