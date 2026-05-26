import { Injectable } from '@nestjs/common';
import { classificationOutputSchema } from '@sentinel/shared';
import { LlmService } from '../../common/llm.service';

@Injectable()
export class ClassificationAgent {
  constructor(private readonly llm: LlmService) {}

  async run(input: { title: string; rawLogs: string; planSteps: string[] }) {
    return this.llm.generateStructured(
      'classification',
      'Classify the incident. severity MUST be exactly one of: LOW, MEDIUM, HIGH, CRITICAL (uppercase). category and incidentType are required strings. confidence is a number 0-1.',
      `Title: ${input.title}\nPlan: ${input.planSteps.join('; ') || 'none'}\nLogs:\n${input.rawLogs.slice(0, 6000)}`,
      classificationOutputSchema,
    );
  }
}
