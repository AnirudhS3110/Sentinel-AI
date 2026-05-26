import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkflowsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByIncident(user: User, incidentId: string) {
    const incident = await this.prisma.incident.findFirst({
      where: { id: incidentId, userId: user.id },
    });
    if (!incident) throw new NotFoundException('Incident not found');
    return this.prisma.workflowExecution.findMany({
      where: { incidentId },
      orderBy: { startedAt: 'desc' },
      include: { agentExecutions: { orderBy: { startedAt: 'asc' } } },
    });
  }

  async getTimeline(user: User, incidentId: string) {
    const workflows = await this.findByIncident(user, incidentId);
    const timeline = workflows.flatMap((wf) =>
      wf.agentExecutions.map((exec) => ({
        id: exec.id,
        agentType: exec.agentType,
        status: exec.status,
        startedAt: exec.startedAt,
        completedAt: exec.completedAt,
        durationMs: exec.durationMs,
        error: exec.error,
        output: exec.output,
      })),
    );
    return { incidentId, timeline };
  }
}
