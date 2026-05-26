"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowEventType = void 0;
var WorkflowEventType;
(function (WorkflowEventType) {
    WorkflowEventType["INCIDENT_CREATED"] = "incident.created";
    WorkflowEventType["WORKFLOW_STARTED"] = "workflow.started";
    WorkflowEventType["PLANNING_COMPLETED"] = "planning.completed";
    WorkflowEventType["CLASSIFICATION_COMPLETED"] = "classification.completed";
    WorkflowEventType["ANALYSIS_COMPLETED"] = "analysis.completed";
    WorkflowEventType["VALIDATION_FAILED"] = "validation.failed";
    WorkflowEventType["REMEDIATION_GENERATED"] = "remediation.generated";
    WorkflowEventType["REPORT_GENERATED"] = "report.generated";
    WorkflowEventType["WORKFLOW_COMPLETED"] = "workflow.completed";
    WorkflowEventType["WORKFLOW_FAILED"] = "workflow.failed";
    WorkflowEventType["AGENT_STARTED"] = "agent.started";
    WorkflowEventType["AGENT_COMPLETED"] = "agent.completed";
    WorkflowEventType["RETRY_TRIGGERED"] = "retry.triggered";
})(WorkflowEventType || (exports.WorkflowEventType = WorkflowEventType = {}));
