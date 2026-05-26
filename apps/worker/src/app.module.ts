import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { BULLMQ_PREFIX, getBullMqConnection } from '@sentinel/shared';
import appConfig from './config/app.config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { CommonModule } from './common/common.module';
import { QueuesModule } from './queues/queues.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: getBullMqConnection(config.get<string>('redisUrl')),
        prefix: BULLMQ_PREFIX,
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    RedisModule,
    CommonModule,
    QueuesModule,
  ],
})
export class AppModule {}
