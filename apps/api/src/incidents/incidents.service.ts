import { Injectable, NotFoundException } from '@nestjs/common';
import { IncidentStatus as DbStatus, User } from '@prisma/client';
import { IncidentStatus, WorkflowEventType } from '@sentinel/shared';
import { PrismaService } from '../prisma/prisma.service';
import { QueueProducerService } from '../queues/queue-producer.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { EventPublisherClient } from '../common/event-publisher.client';

@Injectable()
export class IncidentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queues: QueueProducerService,
    private readonly events: EventPublisherClient,
  ) {}

  async create(user: User, dto: CreateIncidentDto) {
    const incident = await this.prisma.incident.create({
      data: {
        userId: user.id,
        title: dto.title,
        description: dto.description,
        rawLogs: dto.rawLogs,
        status: DbStatus.INCIDENT_CREATED,
      },
    });
    const workflow = await this.prisma.workflowExecution.create({
      data: {
        incidentId: incident.id,
        initiatedById: user.id,
        currentStage: DbStatus.PLANNING,
      },
    });
    await this.prisma.incident.update({
      where: { id: incident.id },
      data: { status: DbStatus.PLANNING },
    });
    const payload = {
      incidentId: incident.id,
      workflowExecutionId: workflow.id,
      userId: user.id,
    };
    await this.events.publish({
      type: WorkflowEventType.INCIDENT_CREATED,
      incidentId: incident.id,
      workflowExecutionId: workflow.id,
      timestamp: new Date().toISOString(),
      stage: IncidentStatus.INCIDENT_CREATED,
      message: `Incident "${incident.title}" created`,
    });
    await this.events.publish({
      type: WorkflowEventType.WORKFLOW_STARTED,
      incidentId: incident.id,
      workflowExecutionId: workflow.id,
      timestamp: new Date().toISOString(),
      stage: IncidentStatus.PLANNING,
      message: 'Workflow started — planner queued',
    });
    await this.queues.enqueuePlanner(payload);
    return { incident, workflow };
  }

  async findAll(user: User, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.incident.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { workflowExecutions: { orderBy: { startedAt: 'desc' }, take: 1 } },
      }),
      this.prisma.incident.count({ where: { userId: user.id } }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(user: User, id: string) {
    const incident = await this.prisma.incident.findFirst({
      where: { id, userId: user.id },
      include: {
        workflowExecutions: { orderBy: { startedAt: 'desc' }, include: { agentExecutions: true } },
        reports: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!incident) throw new NotFoundException('Incident not found');
    return incident;
  }
}
