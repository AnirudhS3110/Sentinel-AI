"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseWorkflowEventMessage = parseWorkflowEventMessage;
const zod_1 = require("zod");
const eventMessageSchema = zod_1.z.object({
    event: zod_1.z.object({
        type: zod_1.z.string(),
        incidentId: zod_1.z.string(),
        workflowExecutionId: zod_1.z.string(),
        timestamp: zod_1.z.string(),
        message: zod_1.z.string(),
        stage: zod_1.z.string().optional(),
        retryCount: zod_1.z.number().optional(),
        metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    }),
});
function parseWorkflowEventMessage(raw) {
    try {
        const parsed = JSON.parse(raw);
        const result = eventMessageSchema.safeParse(parsed);
        return result.success ? result.data : null;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=parse-event.js.map