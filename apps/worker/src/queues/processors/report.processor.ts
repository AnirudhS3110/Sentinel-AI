import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  AgentJobPayload,
  AgentType,
  AnalysisOutput,
  RemediationOutput,
  IncidentStatus,
  QUEUE_NAMES,
  WorkflowEventType,
} from '@sentinel/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { ReportGenerationAgent } from '../../agents/report-generation/report.agent';
import { AgentExecutionService } from '../../common/agent-execution.service';
import { EventPublisherService } from '../../redis/event-publisher.service';
import { WORKFLOW_CONCURRENCY } from '@sentinel/shared';

@Processor(QUEUE_NAMES.REPORT_GENERATION, { concurrency: WORKFLOW_CONCURRENCY })
export class ReportProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly agent: ReportGenerationAgent,
    private readonly executions: AgentExecutionService,
    private readonly events: EventPublisherService,
  ) { super(); }

  async process(job: Job<AgentJobPayload>) {
    const { incidentId, workflowExecutionId } = job.data;
    const started = Date.now();
    const incident = await this.prisma.incident.findUniqueOrThrow({ where: { id: incidentId } });
    const agents = await this.prisma.agentExecution.findMany({
      where: { workflowExecutionId },
      orderBy: { startedAt: 'asc' },
    });
    const analysis = agents.find((a) => a.agentType === AgentType.ANALYSIS)?.output as AnalysisOutput;
    const remediation = agents.find((a) => a.agentType === AgentType.REMEDIATION)?.output as RemediationOutput;
    const timeline = agents.map((a) => ({
      timestamp: (a.completedAt ?? a.startedAt).toISOString(),
      stage: a.agentType,
      message: `${a.agentType} ${a.status}`,
    }));
    const exec = await this.executions.start(workflowExecutionId, AgentType.REPORT_GENERATION);
    const output = await this.agent.run({
      title: incident.title,
      analysis,
      remediation,
      timeline,
    });
    await this.executions.complete(exec.id, output, Date.now() - started);
    await this.prisma.incidentReport.create({
      data: {
        incidentId,
        summary: output.summary,
        rootCause: output.rootCause,
        remediation: output.remediation,
        timeline: output.timeline,
      },
    });
    await this.executions.updateStage(workflowExecutionId, incidentId, IncidentStatus.RESOLVED, { completed: true });
    await this.events.publish({
      type: WorkflowEventType.REPORT_GENERATED,
      incidentId,
      workflowExecutionId,
      timestamp: new Date().toISOString(),
      stage: IncidentStatus.RESOLVED,
      message: 'Incident report generated',
    });
    await this.events.publish({
      type: WorkflowEventType.WORKFLOW_COMPLETED,
      incidentId,
      workflowExecutionId,
      timestamp: new Date().toISOString(),
      stage: IncidentStatus.RESOLVED,
      message: 'Workflow completed successfully',
    });
  }
}
