import { toJsonSchema } from '@langchain/core/utils/json_schema';
import {
  AGENT_LLM_SCHEMAS,
  AgentPromptKey,
  sanitizeGeminiSchema,
} from '@sentinel/shared';

const cache = new Map<AgentPromptKey, Record<string, unknown>>();

/** Zod → JSON Schema → Gemini-safe schema for response_schema (Gemini providers only). */
export function geminiResponseSchemaForAgent(agent: AgentPromptKey): Record<string, unknown> {
  const cached = cache.get(agent);
  if (cached) return cached;

  const raw = toJsonSchema(AGENT_LLM_SCHEMAS[agent]);
  const sanitized = sanitizeGeminiSchema<Record<string, unknown>>(raw);
  cache.set(agent, sanitized);
  return sanitized;
}
