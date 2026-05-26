import { Injectable } from '@nestjs/common';
import { AgentExecutionStatus, AgentType, IncidentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AgentExecutionService {
  constructor(private readonly prisma: PrismaService) {}

  async start(workflowExecutionId: string, agentType: AgentType, input?: Prisma.InputJsonValue) {
    return this.prisma.agentExecution.create({
      data: {
        workflowExecutionId,
        agentType,
        status: AgentExecutionStatus.RUNNING,
        input: input ?? undefined,
      },
    });
  }

  async complete(id: string, output: Prisma.InputJsonValue, durationMs: number) {
    return this.prisma.agentExecution.update({
      where: { id },
      data: {
        status: AgentExecutionStatus.COMPLETED,
        output,
        durationMs,
        completedAt: new Date(),
      },
    });
  }

  async fail(id: string, error: string, durationMs: number) {
    return this.prisma.agentExecution.update({
      where: { id },
      data: {
        status: AgentExecutionStatus.FAILED,
        error,
        durationMs,
        completedAt: new Date(),
      },
    });
  }

  async updateStage(workflowExecutionId: string, incidentId: string, stage: IncidentStatus, extra?: {
    retryCount?: number;
    completed?: boolean;
    failed?: boolean;
  }) {
    await this.prisma.workflowExecution.update({
      where: { id: workflowExecutionId },
      data: {
        currentStage: stage,
        retryCount: extra?.retryCount,
        completedAt: extra?.completed ? new Date() : undefined,
      },
    });
    await this.prisma.incident.update({
      where: { id: incidentId },
      data: { status: stage },
    });
  }
}
