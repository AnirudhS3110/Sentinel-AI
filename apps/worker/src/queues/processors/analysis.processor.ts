import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AgentJobPayload, AgentType, IncidentStatus, QUEUE_NAMES, WorkflowEventType } from '@sentinel/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { RootCauseAnalysisAgent } from '../../agents/analysis/analysis.agent';
import { AgentExecutionService } from '../../common/agent-execution.service';
import { EventPublisherService } from '../../redis/event-publisher.service';
import { QueueDispatcherService } from '../../common/queue-dispatcher.service';
import { WORKFLOW_CONCURRENCY } from '@sentinel/shared';

@Processor(QUEUE_NAMES.ANALYSIS, { concurrency: WORKFLOW_CONCURRENCY })
export class AnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalysisProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly agent: RootCauseAnalysisAgent,
    private readonly executions: AgentExecutionService,
    private readonly events: EventPublisherService,
    private readonly dispatcher: QueueDispatcherService,
  ) { super(); }

  async process(job: Job<AgentJobPayload>) {
    this.logger.log(`Received job id=${job.id} queue=${QUEUE_NAMES.ANALYSIS}`);
    const { incidentId, workflowExecutionId, retryCount = 0 } = job.data;
    const started = Date.now();
    const incident = await this.prisma.incident.findUniqueOrThrow({ where: { id: incidentId } });
    if (retryCount > 0) {
      await this.events.publish({
        type: WorkflowEventType.RETRY_TRIGGERED,
        incidentId,
        workflowExecutionId,
        timestamp: new Date().toISOString(),
        stage: IncidentStatus.ROOT_CAUSE_ANALYSIS,
        message: `Retry analysis (attempt ${retryCount})`,
        retryCount,
      });
    }
    const exec = await this.executions.start(workflowExecutionId, AgentType.ANALYSIS, { retryCount });
    const output = await this.agent.run({
      title: incident.title,
      rawLogs: incident.rawLogs,
      category: incident.category ?? 'unknown',
      severity: incident.severity ?? 'MEDIUM',
    });
    await this.executions.complete(exec.id, output, Date.now() - started);
    await this.executions.updateStage(workflowExecutionId, incidentId, IncidentStatus.VALIDATION);
    await this.events.publish({
      type: WorkflowEventType.ANALYSIS_COMPLETED,
      incidentId,
      workflowExecutionId,
      timestamp: new Date().toISOString(),
      stage: IncidentStatus.VALIDATION,
      message: 'Root cause analysis completed',
      metadata: { confidence: output.confidence },
    });
    await this.dispatcher.enqueueValidation({ ...job.data, retryCount });
  }
}
