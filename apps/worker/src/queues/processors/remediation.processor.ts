import { Processor, WorkerHost } from '@nestjs/bullmq';
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
import { RemediationAgent } from '../../agents/remediation/remediation.agent';
import { AgentExecutionService } from '../../common/agent-execution.service';
import { EventPublisherService } from '../../redis/event-publisher.service';
import { QueueDispatcherService } from '../../common/queue-dispatcher.service';
import { WORKFLOW_CONCURRENCY } from '@sentinel/shared';

@Processor(QUEUE_NAMES.REMEDIATION, { concurrency: WORKFLOW_CONCURRENCY })
export class RemediationProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly agent: RemediationAgent,
    private readonly executions: AgentExecutionService,
    private readonly events: EventPublisherService,
    private readonly dispatcher: QueueDispatcherService,
  ) { super(); }

  async process(job: Job<AgentJobPayload>) {
    const { incidentId, workflowExecutionId } = job.data;
    const started = Date.now();
    const incident = await this.prisma.incident.findUniqueOrThrow({ where: { id: incidentId } });
    const analysisExec = await this.prisma.agentExecution.findFirst({
      where: { workflowExecutionId, agentType: AgentType.ANALYSIS, status: 'COMPLETED' },
      orderBy: { startedAt: 'desc' },
    });
    const analysis = analysisExec?.output as AnalysisOutput;
    const exec = await this.executions.start(workflowExecutionId, AgentType.REMEDIATION);
    const output = await this.agent.run({ title: incident.title, analysis });
    await this.executions.complete(exec.id, output, Date.now() - started);
    await this.executions.updateStage(workflowExecutionId, incidentId, IncidentStatus.HUMAN_APPROVAL);
    await this.events.publish({
      type: WorkflowEventType.REMEDIATION_GENERATED,
      incidentId,
      workflowExecutionId,
      timestamp: new Date().toISOString(),
      stage: IncidentStatus.HUMAN_APPROVAL,
      message: 'Remediation generated — awaiting approval',
      metadata: { steps: output.steps.length },
    });
    // Auto-approve for orchestration pipeline; production would gate on external approval signal
    await this.executions.updateStage(workflowExecutionId, incidentId, IncidentStatus.REPORT_GENERATION);
    await this.dispatcher.enqueueReport(job.data);
  }
}
