import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByIncident(user: User, incidentId: string) {
    const incident = await this.prisma.incident.findFirst({
      where: { id: incidentId, userId: user.id },
    });
    if (!incident) throw new NotFoundException('Incident not found');
    return this.prisma.incidentReport.findMany({
      where: { incidentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findLatest(user: User, incidentId: string) {
    const reports = await this.findByIncident(user, incidentId);
    if (!reports.length) throw new NotFoundException('Report not found');
    return reports[0];
  }
}
