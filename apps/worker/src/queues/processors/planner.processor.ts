import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AgentType } from '@prisma/client';
import { AgentJobPayload, IncidentStatus, QUEUE_NAMES, WorkflowEventType } from '@sentinel/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { PlannerAgent } from '../../agents/planner/planner.agent';
import { AgentExecutionService } from '../../common/agent-execution.service';
import { EventPublisherService } from '../../redis/event-publisher.service';
import { QueueDispatcherService } from '../../common/queue-dispatcher.service';
import { WORKFLOW_CONCURRENCY } from '@sentinel/shared';

@Processor(QUEUE_NAMES.PLANNER, { concurrency: WORKFLOW_CONCURRENCY })
export class PlannerProcessor extends WorkerHost {
  private readonly logger = new Logger(PlannerProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly agent: PlannerAgent,
    private readonly executions: AgentExecutionService,
    private readonly events: EventPublisherService,
    private readonly dispatcher: QueueDispatcherService,
  ) {
    super();
  }

  async process(job: Job<AgentJobPayload>) {
    this.logger.log(`Received job id=${job.id} queue=${QUEUE_NAMES.PLANNER} data=${JSON.stringify(job.data)}`);
    const { incidentId, workflowExecutionId } = job.data;
    const started = Date.now();
    const incident = await this.prisma.incident.findUniqueOrThrow({ where: { id: incidentId } });
    const exec = await this.executions.start(workflowExecutionId, AgentType.PLANNER, { title: incident.title });
    await this.events.publish({
      type: WorkflowEventType.AGENT_STARTED,
      incidentId,
      workflowExecutionId,
      timestamp: new Date().toISOString(),
      stage: IncidentStatus.PLANNING,
      message: 'Planner agent started',
    });
    try {
      const output = await this.agent.run({
        title: incident.title,
        description: incident.description ?? undefined,
        rawLogs: incident.rawLogs,
      });
      await this.executions.complete(exec.id, output, Date.now() - started);
      await this.executions.updateStage(workflowExecutionId, incidentId, IncidentStatus.CLASSIFICATION);
      await this.events.publish({
        type: WorkflowEventType.PLANNING_COMPLETED,
        incidentId,
        workflowExecutionId,
        timestamp: new Date().toISOString(),
        stage: IncidentStatus.CLASSIFICATION,
        message: 'Planning completed',
        metadata: { steps: output.steps.length },
      });
      await this.dispatcher.enqueueClassification(job.data);
    } catch (err) {
      await this.fail(job.data, exec.id, started, err);
      throw err;
    }
  }

  private async fail(payload: AgentJobPayload, execId: string, started: number, err: unknown) {
    const msg = err instanceof Error ? err.message : 'Planner failed';
    await this.executions.fail(execId, msg, Date.now() - started);
    await this.executions.updateStage(payload.workflowExecutionId, payload.incidentId, IncidentStatus.FAILED, { failed: true });
    await this.events.publish({
      type: WorkflowEventType.WORKFLOW_FAILED,
      incidentId: payload.incidentId,
      workflowExecutionId: payload.workflowExecutionId,
      timestamp: new Date().toISOString(),
      message: msg,
    });
  }
}
