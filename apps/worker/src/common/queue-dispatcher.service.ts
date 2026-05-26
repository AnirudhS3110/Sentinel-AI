import { Injectable, Logger } from '@nestjs/common';
import { getQueueToken } from '@nestjs/bullmq';
import { ModuleRef } from '@nestjs/core';
import { Queue } from 'bullmq';
import { AgentJobPayload, DEFAULT_QUEUE_OPTS, QUEUE_NAMES } from '@sentinel/shared';

@Injectable()
export class QueueDispatcherService {
  private readonly logger = new Logger(QueueDispatcherService.name);

  constructor(private readonly moduleRef: ModuleRef) {}

  async enqueue(queueName: string, payload: AgentJobPayload) {
    try {
      const queue = this.moduleRef.get<Queue>(getQueueToken(queueName), { strict: false });
      const job = await queue.add('run', payload, DEFAULT_QUEUE_OPTS);
      this.logger.log(`Enqueued ${queueName} job id=${job.id} incidentId=${payload.incidentId}`);
      return job;
    } catch (err) {
      this.logger.error(`Failed to enqueue ${queueName} incidentId=${payload.incidentId}`, err);
      throw err;
    }
  }

  enqueueClassification(p: AgentJobPayload) { return this.enqueue(QUEUE_NAMES.CLASSIFICATION, p); }
  enqueueAnalysis(p: AgentJobPayload) { return this.enqueue(QUEUE_NAMES.ANALYSIS, p); }
  enqueueValidation(p: AgentJobPayload) { return this.enqueue(QUEUE_NAMES.VALIDATION, p); }
  enqueueRemediation(p: AgentJobPayload) { return this.enqueue(QUEUE_NAMES.REMEDIATION, p); }
  enqueueReport(p: AgentJobPayload) { return this.enqueue(QUEUE_NAMES.REPORT_GENERATION, p); }
}
