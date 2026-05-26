"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentExecutionStatus = exports.AgentType = exports.IncidentSeverity = exports.IncidentStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var IncidentStatus;
(function (IncidentStatus) {
    IncidentStatus["INCIDENT_CREATED"] = "INCIDENT_CREATED";
    IncidentStatus["PLANNING"] = "PLANNING";
    IncidentStatus["CLASSIFICATION"] = "CLASSIFICATION";
    IncidentStatus["ROOT_CAUSE_ANALYSIS"] = "ROOT_CAUSE_ANALYSIS";
    IncidentStatus["VALIDATION"] = "VALIDATION";
    IncidentStatus["REMEDIATION"] = "REMEDIATION";
    IncidentStatus["HUMAN_APPROVAL"] = "HUMAN_APPROVAL";
    IncidentStatus["REPORT_GENERATION"] = "REPORT_GENERATION";
    IncidentStatus["RESOLVED"] = "RESOLVED";
    IncidentStatus["FAILED"] = "FAILED";
})(IncidentStatus || (exports.IncidentStatus = IncidentStatus = {}));
var IncidentSeverity;
(function (IncidentSeverity) {
    IncidentSeverity["LOW"] = "LOW";
    IncidentSeverity["MEDIUM"] = "MEDIUM";
    IncidentSeverity["HIGH"] = "HIGH";
    IncidentSeverity["CRITICAL"] = "CRITICAL";
})(IncidentSeverity || (exports.IncidentSeverity = IncidentSeverity = {}));
var AgentType;
(function (AgentType) {
    AgentType["PLANNER"] = "PLANNER";
    AgentType["CLASSIFICATION"] = "CLASSIFICATION";
    AgentType["ANALYSIS"] = "ANALYSIS";
    AgentType["VALIDATION"] = "VALIDATION";
    AgentType["REMEDIATION"] = "REMEDIATION";
    AgentType["REPORT_GENERATION"] = "REPORT_GENERATION";
})(AgentType || (exports.AgentType = AgentType = {}));
var AgentExecutionStatus;
(function (AgentExecutionStatus) {
    AgentExecutionStatus["PENDING"] = "PENDING";
    AgentExecutionStatus["RUNNING"] = "RUNNING";
    AgentExecutionStatus["COMPLETED"] = "COMPLETED";
    AgentExecutionStatus["FAILED"] = "FAILED";
    AgentExecutionStatus["RETRYING"] = "RETRYING";
})(AgentExecutionStatus || (exports.AgentExecutionStatus = AgentExecutionStatus = {}));
//# sourceMappingURL=index.js.map