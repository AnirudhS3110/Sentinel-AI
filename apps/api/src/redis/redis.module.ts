import { Module } from '@nestjs/common';
import { RedisSubscriberService } from './redis-subscriber.service';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [WebsocketModule],
  providers: [RedisSubscriberService],
})
export class RedisModule {}
