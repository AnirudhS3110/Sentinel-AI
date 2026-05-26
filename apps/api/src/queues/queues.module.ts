import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BULLMQ_PREFIX, QUEUE_NAMES } from '@sentinel/shared';
import { QueueProducerService } from './queue-producer.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAMES.PLANNER,
      prefix: BULLMQ_PREFIX,
    }),
  ],
  providers: [QueueProducerService],
  exports: [QueueProducerService, BullModule],
})
export class QueuesModule {}
