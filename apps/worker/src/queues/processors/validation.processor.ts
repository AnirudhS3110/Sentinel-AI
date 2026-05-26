import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import {
  AgentJobPayload,
  AgentType,
  AnalysisOutput,
  IncidentStatus,
  QUEUE_NAMES,
  WorkflowEventType,
} from '@sentinel/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { ValidationAgent } from '../../agents/validation/validation.agent';
import { AgentExecutionService } from '../../common/agent-execution.service';
import { EventPublisherService } from '../../redis/event-publisher.service';
import { QueueDispatcherService } from '../../common/queue-dispatcher.service';
import { WorkflowRouterService } from '../../workflows/workflow-router.service';
import { WORKFLOW_CONCURRENCY } from '@sentinel/shared';

@Processor(QUEUE_NAMES.VALIDATION, { concurrency: WORKFLOW_CONCURRENCY })
export class ValidationProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly agent: ValidationAgent,
    private readonly executions: AgentExecutionService,
    private readonly events: EventPublisherService,
    private readonly dispatcher: QueueDispatcherService,
    private readonly router: WorkflowRouterService,
    private readonly config: ConfigService,
  ) { super(); }

  async process(job: Job<AgentJobPayload>) {
    const { incidentId, workflowExecutionId, retryCount = 0 } = job.data;
    const started = Date.now();
    const incident = await this.prisma.incident.findUniqueOrThrow({ where: { id: incidentId } });
    const analysisExec = await this.prisma.agentExecution.findFirst({
      where: { workflowExecutionId, agentType: AgentType.ANALYSIS, status: 'COMPLETED' },
      orderBy: { startedAt: 'desc' },
    });
    const analysis = analysisExec?.output as AnalysisOutput;
    const exec = await this.executions.start(workflowExecutionId, AgentType.VALIDATION);
    const output = await this.agent.run({ analysis });
    await this.executions.complete(exec.id, output, Date.now() - started);
    const maxRetries = this.config.get<number>('maxValidationRetries') ?? 3;
    const route = await this.router.routeAfterValidation({
      incidentId,
      workflowExecutionId,
      userId: job.data.userId,
      title: incident.title,
      description: incident.description ?? undefined,
      rawLogs: incident.rawLogs,
      currentStage: IncidentStatus.VALIDATION,
      retryCount,
      analysisOutput: analysis,
      validationOutput: output,
    });
    if (route === 'retry_analysis' && retryCount < maxRetries) {
      const nextRetry = retryCount + 1;
      await this.prisma.workflowExecution.update({
        where: { id: workflowExecutionId },
        data: { retryCount: nextRetry },
      });
      await this.events.publish({
        type: WorkflowEventType.VALIDATION_FAILED,
        incidentId,
        workflowExecutionId,
        timestamp: new Date().toISOString(),
        stage: IncidentStatus.VALIDATION,
        message: 'Validation failed — retrying analysis',
        retryCount: nextRetry,
        metadata: { issues: output.issues },
      });
      await this.dispatcher.enqueueAnalysis({ ...job.data, retryCount: nextRetry });
      return;
    }
    if (route === 'failed') {
      await this.executions.updateStage(workflowExecutionId, incidentId, IncidentStatus.FAILED, { failed: true });
      await this.events.publish({
        type: WorkflowEventType.WORKFLOW_FAILED,
        incidentId,
        workflowExecutionId,
        timestamp: new Date().toISOString(),
        message: 'Validation failed — workflow terminated',
      });
      return;
    }
    await this.executions.updateStage(workflowExecutionId, incidentId, IncidentStatus.REMEDIATION);
    await this.dispatcher.enqueueRemediation(job.data);
  }
}
