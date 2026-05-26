import { Injectable } from '@nestjs/common';
import { remediationOutputSchema, AnalysisOutput } from '@sentinel/shared';
import { LlmService } from '../../common/llm.service';

@Injectable()
export class RemediationAgent {
  constructor(private readonly llm: LlmService) {}

  async run(input: { title: string; analysis: AnalysisOutput }) {
    return this.llm.generateStructured(
      'remediation',
      'Generate remediation steps. steps is a string array. requiresHumanApproval is boolean.',
      `Incident: ${input.title}\nRoot cause: ${input.analysis.rootCause}\nServices: ${input.analysis.affectedServices.join(', ') || 'unknown'}`,
      remediationOutputSchema,
    );
  }
}
