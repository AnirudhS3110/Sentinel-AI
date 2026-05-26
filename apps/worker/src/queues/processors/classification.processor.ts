import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AgentJobPayload, IncidentStatus, QUEUE_NAMES, WorkflowEventType } from '@sentinel/shared';
import { AgentType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ClassificationAgent } from '../../agents/classification/classification.agent';
import { AgentExecutionService } from '../../common/agent-execution.service';
import { EventPublisherService } from '../../redis/event-publisher.service';
import { QueueDispatcherService } from '../../common/queue-dispatcher.service';
import { WORKFLOW_CONCURRENCY } from '@sentinel/shared';

@Processor(QUEUE_NAMES.CLASSIFICATION, { concurrency: WORKFLOW_CONCURRENCY })
export class ClassificationProcessor extends WorkerHost {
  private readonly logger = new Logger(ClassificationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly agent: ClassificationAgent,
    private readonly executions: AgentExecutionService,
    private readonly events: EventPublisherService,
    private readonly dispatcher: QueueDispatcherService,
  ) { super(); }

  async process(job: Job<AgentJobPayload>) {
    this.logger.log(`Received job id=${job.id} queue=${QUEUE_NAMES.CLASSIFICATION}`);
    const { incidentId, workflowExecutionId } = job.data;
    const started = Date.now();
    const incident = await this.prisma.incident.findUniqueOrThrow({ where: { id: incidentId } });
    const plannerExec = await this.prisma.agentExecution.findFirst({
      where: { workflowExecutionId, agentType: AgentType.PLANNER, status: 'COMPLETED' },
      orderBy: { startedAt: 'desc' },
    });
    const plan = (plannerExec?.output as { steps?: string[] })?.steps ?? [];
    const exec = await this.executions.start(workflowExecutionId, AgentType.CLASSIFICATION);
    const output = await this.agent.run({ title: incident.title, rawLogs: incident.rawLogs, planSteps: plan });
    await this.executions.complete(exec.id, output, Date.now() - started);
    await this.prisma.incident.update({
      where: { id: incidentId },
      data: { severity: output.severity, category: output.category },
    });
    await this.executions.updateStage(workflowExecutionId, incidentId, IncidentStatus.ROOT_CAUSE_ANALYSIS);
    await this.events.publish({
      type: WorkflowEventType.CLASSIFICATION_COMPLETED,
      incidentId,
      workflowExecutionId,
      timestamp: new Date().toISOString(),
      stage: IncidentStatus.ROOT_CAUSE_ANALYSIS,
      message: `Classified as ${output.severity} / ${output.category}`,
      metadata: { confidence: output.confidence },
    });
    await this.dispatcher.enqueueAnalysis(job.data);
  }
}
