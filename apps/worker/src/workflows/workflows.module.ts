import { Module } from '@nestjs/common';
import { WorkflowRouterService } from './workflow-router.service';

@Module({
  providers: [WorkflowRouterService],
  exports: [WorkflowRouterService],
})
export class WorkflowsModule {}
