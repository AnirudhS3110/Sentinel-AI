import { Global, Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { AgentExecutionService } from './agent-execution.service';
import { QueueDispatcherService } from './queue-dispatcher.service';

@Global()
@Module({
  providers: [LlmService, AgentExecutionService, QueueDispatcherService],
  exports: [LlmService, AgentExecutionService, QueueDispatcherService],
})
export class CommonModule {}
