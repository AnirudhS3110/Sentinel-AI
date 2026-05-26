export default () => ({
  port: parseInt(process.env.WORKER_PORT ?? process.env.PORT ?? '3002', 10),
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL ?? 'gemini-2.5-flash-lite',
  geminiTemperature: process.env.GEMINI_TEMPERATURE ?? '0',
  maxValidationRetries: parseInt(process.env.MAX_VALIDATION_RETRIES ?? '3', 10),
});
