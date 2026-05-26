import { Injectable } from '@nestjs/common';
import { analysisOutputSchema } from '@sentinel/shared';
import { LlmService } from '../../common/llm.service';

@Injectable()
export class RootCauseAnalysisAgent {
  constructor(private readonly llm: LlmService) {}

  async run(input: { title: string; rawLogs: string; category: string; severity: string }) {
    return this.llm.generateStructured(
      'analysis',
      'Perform root cause analysis. rootCause must be a detailed string (min 10 chars). confidence is 0-1. affectedServices and evidence are string arrays.',
      `Title: ${input.title}\nCategory: ${input.category}\nSeverity: ${input.severity}\nLogs:\n${input.rawLogs.slice(0, 10000)}`,
      analysisOutputSchema,
    );
  }
}
