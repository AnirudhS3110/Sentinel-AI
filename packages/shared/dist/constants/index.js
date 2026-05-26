"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WORKFLOW_CONCURRENCY = exports.DEFAULT_QUEUE_OPTS = exports.REDIS_CHANNELS = exports.QUEUE_NAMES = exports.BULLMQ_PREFIX = void 0;
exports.BULLMQ_PREFIX = 'bull';
exports.QUEUE_NAMES = {
    PLANNER: 'planner',
    CLASSIFICATION: 'classification',
    ANALYSIS: 'analysis',
    VALIDATION: 'validation',
    REMEDIATION: 'remediation',
    REPORT_GENERATION: 'report-generation',
};
exports.REDIS_CHANNELS = {
    WORKFLOW_EVENTS: 'sentinel:workflow:events',
};
exports.DEFAULT_QUEUE_OPTS = {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 100,
    removeOnFail: 200,
};
exports.WORKFLOW_CONCURRENCY = 5;
