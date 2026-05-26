import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import {
  AGENT_SCHEMA_HINTS,
  AgentPromptKey,
  formatAgentValidationError,
  JSON_ONLY_INSTRUCTION,
} from '@sentinel/shared';
import { z } from 'zod';
import { geminiResponseSchemaForAgent } from './gemini-response-schema';

function extractJsonPayload(text: string): string {
  let trimmed = text.trim();
  if (trimmed.startsWith('```')) {
    trimmed = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('LLM response did not contain a JSON object');
  }
  return trimmed.slice(start, end + 1);
}

function parseModelContent(content: unknown): string {
  return typeof content === 'string' ? content : JSON.stringify(content);
}

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private model: ChatGoogleGenerativeAI;

  constructor(config: ConfigService) {
    const temperature = Number(config.get<string>('geminiTemperature') ?? 0);
    this.model = new ChatGoogleGenerativeAI({
      model: config.get<string>('geminiModel') ?? 'gemini-2.5-flash-lite',
      apiKey: config.get<string>('geminiApiKey'),
      temperature: Math.min(0.1, Math.max(0, temperature)),
      topP: 1,
      json: true,
    });
  }

  async generateStructured<T extends z.ZodType>(
    agent: AgentPromptKey,
    system: string,
    user: string,
    schema: T,
  ): Promise<z.infer<T>> {
    const hint = AGENT_SCHEMA_HINTS[agent];
    const prompt = `${system}\n\n${JSON_ONLY_INSTRUCTION}\n\nExact JSON shape (match keys and types):\n${hint}\n\n${user}`;

    try {
      return await this.invokeStructuredOutput(agent, prompt, schema);
    } catch (structuredErr) {
      this.logger.warn(
        `LLM [${agent}] structured output failed, trying JSON mode: ${structuredErr}`,
      );
    }

    try {
      return await this.invokeJsonModeFallback(agent, prompt, schema);
    } catch (jsonErr) {
      this.logger.warn(
        `LLM [${agent}] JSON mode failed, trying manual extraction: ${jsonErr}`,
      );
    }

    return this.invokeManualExtraction(agent, prompt, schema);
  }

  /** Tier 1: Gemini response_schema with sanitized JSON Schema (no unsupported keywords). */
  private async invokeStructuredOutput<T extends z.ZodType>(
    agent: AgentPromptKey,
    prompt: string,
    schema: T,
  ): Promise<z.infer<T>> {
    const responseSchema = geminiResponseSchemaForAgent(agent);
    const structured = this.model.withStructuredOutput(responseSchema, {
      method: 'jsonSchema',
      name: agent,
    });
    const result = await structured.invoke(prompt);
    const rawText = JSON.stringify(result);
    this.logger.log(`LLM [${agent}] structured response: ${rawText.slice(0, 1500)}`);
    return this.validateParsed(agent, schema, result);
  }

  /** Tier 2: Plain invoke with model JSON mode (constructor json: true). */
  private async invokeJsonModeFallback<T extends z.ZodType>(
    agent: AgentPromptKey,
    prompt: string,
    schema: T,
  ): Promise<z.infer<T>> {
    const response = await this.model.invoke(prompt);
    const text = parseModelContent(response.content);
    this.logger.log(`LLM [${agent}] json-mode raw: ${text.slice(0, 1500)}`);
    const parsed = JSON.parse(text.trim());
    return this.validateParsed(agent, schema, parsed);
  }

  /** Tier 3: Extract JSON object from prose / markdown wrappers. */
  private async invokeManualExtraction<T extends z.ZodType>(
    agent: AgentPromptKey,
    prompt: string,
    schema: T,
  ): Promise<z.infer<T>> {
    const response = await this.model.invoke(prompt);
    const text = parseModelContent(response.content);
    this.logger.log(`LLM [${agent}] manual-extract raw: ${text.slice(0, 1500)}`);
    const jsonStr = extractJsonPayload(text);
    const parsed = JSON.parse(jsonStr);
    return this.validateParsed(agent, schema, parsed);
  }

  private validateParsed<T extends z.ZodType>(
    agent: AgentPromptKey,
    schema: T,
    parsed: unknown,
  ): z.infer<T> {
    const result = schema.safeParse(parsed);
    if (!result.success) {
      this.logger.warn(`LLM [${agent}] ${formatAgentValidationError(result.error)}`);
      throw result.error;
    }
    return result.data;
  }
}
