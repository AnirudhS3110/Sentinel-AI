import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { BULLMQ_PREFIX, getBullMqConnection } from '@sentinel/shared';
import appConfig from './config/app.config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { QueuesModule } from './queues/queues.module';
import { WebsocketModule } from './websocket/websocket.module';
import { RedisModule } from './redis/redis.module';
import { IncidentsModule } from './incidents/incidents.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { ReportsModule } from './reports/reports.module';

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
    AuthModule,
    CommonModule,
    QueuesModule,
    WebsocketModule,
    RedisModule,
    IncidentsModule,
    WorkflowsModule,
    ReportsModule,
  ],
})
export class AppModule {}
