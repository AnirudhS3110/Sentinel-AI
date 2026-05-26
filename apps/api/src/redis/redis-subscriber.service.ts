import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CHANNELS, parseWorkflowEventMessage } from '@sentinel/shared';
import { IncidentsGateway } from '../websocket/incidents.gateway';

@Injectable()
export class RedisSubscriberService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisSubscriberService.name);
  private subscriber?: Redis;

  constructor(
    private readonly config: ConfigService,
    private readonly gateway: IncidentsGateway,
  ) {}

  onModuleInit() {
    const url = this.config.get<string>('redisUrl');
    if (!url) {
      this.logger.warn('REDIS_URL not set — realtime events disabled');
      return;
    }
    this.subscriber = new Redis(url, { maxRetriesPerRequest: null });
    this.subscriber.subscribe(REDIS_CHANNELS.WORKFLOW_EVENTS, (err) => {
      if (err) this.logger.error('Redis subscribe failed', err);
      else this.logger.log(`Subscribed to ${REDIS_CHANNELS.WORKFLOW_EVENTS}`);
    });
    this.subscriber.on('message', (_channel, message) => {
      const parsed = parseWorkflowEventMessage(message);
      if (!parsed) return;
      this.gateway.broadcastToIncident(parsed.event.incidentId, parsed.event);
    });
  }

  async onModuleDestroy() {
    await this.subscriber?.quit();
  }
}
