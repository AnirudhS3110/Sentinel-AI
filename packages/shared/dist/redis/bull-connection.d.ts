import type { ConnectionOptions } from 'bullmq';
/** Shared BullMQ / ioredis connection — must match on API (producer) and worker (consumer). */
export declare function getBullMqConnection(redisUrl?: string): ConnectionOptions;
