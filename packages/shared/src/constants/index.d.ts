export declare const QUEUE_NAMES: {
    readonly PLANNER: "planner";
    readonly CLASSIFICATION: "classification";
    readonly ANALYSIS: "analysis";
    readonly VALIDATION: "validation";
    readonly REMEDIATION: "remediation";
    readonly REPORT_GENERATION: "report-generation";
};
export declare const REDIS_CHANNELS: {
    readonly WORKFLOW_EVENTS: "sentinel:workflow:events";
};
export declare const DEFAULT_QUEUE_OPTS: {
    attempts: number;
    backoff: {
        type: "exponential";
        delay: number;
    };
    removeOnComplete: number;
    removeOnFail: number;
};
export declare const WORKFLOW_CONCURRENCY = 5;
