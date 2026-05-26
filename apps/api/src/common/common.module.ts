import { Global, Module } from '@nestjs/common';
import { EventPublisherClient } from './event-publisher.client';

@Global()
@Module({
  providers: [EventPublisherClient],
  exports: [EventPublisherClient],
})
export class CommonModule {}
