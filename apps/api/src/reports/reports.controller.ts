import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import * as Prisma from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ReportsService } from './reports.service';

@Controller('incidents/:incidentId/reports')
@UseGuards(AuthGuard)
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get()
  findAll(@CurrentUser() user: Prisma.User, @Param('incidentId') incidentId: string) {
    return this.reports.findByIncident(user, incidentId);
  }

  @Get('latest')
  findLatest(@CurrentUser() user: Prisma.User, @Param('incidentId') incidentId: string) {
    return this.reports.findLatest(user, incidentId);
  }
}
