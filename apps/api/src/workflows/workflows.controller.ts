import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import * as Prisma from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { WorkflowsService } from './workflows.service';

@Controller('incidents/:incidentId/workflows')
@UseGuards(AuthGuard)
export class WorkflowsController {
  constructor(private readonly workflows: WorkflowsService) {}

  @Get()
  findAll(@CurrentUser() user: Prisma.User, @Param('incidentId') incidentId: string) {
    return this.workflows.findByIncident(user, incidentId);
  }

  @Get('timeline')
  getTimeline(@CurrentUser() user: Prisma.User, @Param('incidentId') incidentId: string) {
    return this.workflows.getTimeline(user, incidentId);
  }
}
