import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CHANNELS, WorkflowEventPayload, WorkflowEventMessage } from '@sentinel/shared';

@Injectable()
export class EventPublisherClient implements OnModuleDestroy {
  private publisher?: Redis;

  constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('redisUrl');
    if (url) this.publisher = new Redis(url, { maxRetriesPerRequest: null });
  }

  async publish(event: WorkflowEventPayload) {
    if (!this.publisher) return;
    const message: WorkflowEventMessage = { event };
    await this.publisher.publish(REDIS_CHANNELS.WORKFLOW_EVENTS, JSON.stringify(message));
  }

  async onModuleDestroy() {
    await this.publisher?.quit();
  }
}
