import { Injectable } from '@nestjs/common';
import { reportOutputSchema, AnalysisOutput, RemediationOutput } from '@sentinel/shared';
import { LlmService } from '../../common/llm.service';

@Injectable()
export class ReportGenerationAgent {
  constructor(private readonly llm: LlmService) {}

  async run(input: {
    title: string;
    analysis: AnalysisOutput;
    remediation: RemediationOutput;
    timeline: { timestamp: string; stage: string; message: string }[];
  }) {
    return this.llm.generateStructured(
      'report',
      'Generate final incident report. summary, rootCause, and remediation must each be at least 10 characters. timeline is an array (can be empty).',
      `Incident: ${input.title}\nAnalysis: ${JSON.stringify(input.analysis)}\nRemediation: ${JSON.stringify(input.remediation)}\nTimeline: ${JSON.stringify(input.timeline)}`,
      reportOutputSchema,
    );
  }
}
