import { Module } from '@nestjs/common';
import { PlannerAgent } from './planner/planner.agent';
import { ClassificationAgent } from './classification/classification.agent';
import { RootCauseAnalysisAgent } from './analysis/analysis.agent';
import { ValidationAgent } from './validation/validation.agent';
import { RemediationAgent } from './remediation/remediation.agent';
import { ReportGenerationAgent } from './report-generation/report.agent';

@Module({
  providers: [
    PlannerAgent,
    ClassificationAgent,
    RootCauseAnalysisAgent,
    ValidationAgent,
    RemediationAgent,
    ReportGenerationAgent,
  ],
  exports: [
    PlannerAgent,
    ClassificationAgent,
    RootCauseAnalysisAgent,
    ValidationAgent,
    RemediationAgent,
    ReportGenerationAgent,
  ],
})
export class AgentsModule {}
