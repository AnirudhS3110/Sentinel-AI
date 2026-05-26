import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { AgentJobPayload, DEFAULT_QUEUE_OPTS, QUEUE_NAMES } from '@sentinel/shared';

@Injectable()
export class QueueProducerService {
  private readonly logger = new Logger(QueueProducerService.name);

  constructor(@InjectQueue(QUEUE_NAMES.PLANNER) private readonly plannerQueue: Queue) {}

  async enqueuePlanner(payload: AgentJobPayload) {
    try {
      const job = await this.plannerQueue.add('run', payload, DEFAULT_QUEUE_OPTS);
      this.logger.log(
        `Enqueued planner job id=${job.id} queue=${QUEUE_NAMES.PLANNER} incidentId=${payload.incidentId}`,
      );
      return job;
    } catch (err) {
      this.logger.error(`Failed to enqueue planner job incidentId=${payload.incidentId}`, err);
      throw err;
    }
  }
}
