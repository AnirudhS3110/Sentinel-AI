import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import * as Prisma from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { IncidentsService } from './incidents.service';

@Controller('incidents')
@UseGuards(AuthGuard)
export class IncidentsController {
  constructor(private readonly incidents: IncidentsService) {}

  @Post()
  create(@CurrentUser() user: Prisma.User, @Body() dto: CreateIncidentDto) {
    return this.incidents.create(user, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: Prisma.User,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.incidents.findAll(user, parseInt(page ?? '1', 10), parseInt(limit ?? '20', 10));
  }

  @Get(':id')
  findOne(@CurrentUser() user: Prisma.User, @Param('id') id: string) {
    return this.incidents.findOne(user, id);
  }
}
