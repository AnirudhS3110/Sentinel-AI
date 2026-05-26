import { Injectable } from '@nestjs/common';
import { validationOutputSchema, AnalysisOutput, RemediationOutput } from '@sentinel/shared';
import { LlmService } from '../../common/llm.service';

@Injectable()
export class ValidationAgent {
  constructor(private readonly llm: LlmService) {}

  async run(input: { analysis: AnalysisOutput; remediation?: RemediationOutput }) {
    const result = await this.llm.generateStructured(
      'validation',
      'Validate the correctness and safety of the incident analysis. If no remediation is provided yet (indicated as N/A), do NOT fail validation for its absence; simply validate that the analysis is safe, accurate, and ready for remediation. Output valid (boolean), issues (string array), safetyScore (0-1), requiresRetry (boolean).',
      `Analysis: ${JSON.stringify(input.analysis)}\nRemediation: ${input.remediation ? JSON.stringify(input.remediation) : 'N/A'}`,
      validationOutputSchema,
    );
    if (result.safetyScore < 0.5) return { ...result, valid: false, requiresRetry: true };
    if (result.valid && input.analysis.confidence < 0.4) return { ...result, valid: false, requiresRetry: true };
    return result;
  }
}
