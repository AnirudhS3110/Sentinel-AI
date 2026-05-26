import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BULLMQ_PREFIX, QUEUE_NAMES } from '@sentinel/shared';
import { AgentsModule } from '../agents/agents.module';
import { WorkflowsModule } from '../workflows/workflows.module';
import { PlannerProcessor } from './processors/planner.processor';
import { ClassificationProcessor } from './processors/classification.processor';
import { AnalysisProcessor } from './processors/analysis.processor';
import { ValidationProcessor } from './processors/validation.processor';
import { RemediationProcessor } from './processors/remediation.processor';
import { ReportProcessor } from './processors/report.processor';

const queueNames = Object.values(QUEUE_NAMES);

@Module({
  imports: [
    ...queueNames.map((name) => BullModule.registerQueue({ name, prefix: BULLMQ_PREFIX })),
    AgentsModule,
    WorkflowsModule,
  ],
  providers: [
    PlannerProcessor,
    ClassificationProcessor,
    AnalysisProcessor,
    ValidationProcessor,
    RemediationProcessor,
    ReportProcessor,
  ],
})
export class QueuesModule implements OnModuleInit {
  private readonly logger = new Logger(QueuesModule.name);

  onModuleInit() {
    this.logger.log(`BullMQ workers registered for queues: ${queueNames.join(', ')}`);
  }
}
