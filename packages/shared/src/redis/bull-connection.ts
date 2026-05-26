import type { ConnectionOptions } from 'bullmq';

/** Shared BullMQ / ioredis connection — must match on API (producer) and worker (consumer). */
export function getBullMqConnection(redisUrl?: string): ConnectionOptions {
  const url = redisUrl ?? process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';
  const parsed = new URL(url);
  const isTls = parsed.protocol === 'rediss:';
  return {
    host: parsed.hostname,
    port: Number(parsed.port || 6379),
    username: parsed.username || undefined,
    password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    ...(isTls ? { tls: {} } : {}),
  };
}
