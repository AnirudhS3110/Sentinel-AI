import { Injectable } from '@nestjs/common';
import { plannerOutputSchema } from '@sentinel/shared';
import { LlmService } from '../../common/llm.service';

@Injectable()
export class PlannerAgent {
  constructor(private readonly llm: LlmService) {}

  async run(input: { title: string; description?: string; rawLogs: string }) {
    return this.llm.generateStructured(
      'planner',
      'You are an infrastructure incident planner. Output a JSON object with keys: steps (string array), focusAreas (string array), estimatedDurationMinutes (optional number).',
      `Incident: ${input.title}\nDescription: ${input.description ?? 'N/A'}\nLogs:\n${input.rawLogs.slice(0, 8000)}`,
      plannerOutputSchema,
    );
  }
}
