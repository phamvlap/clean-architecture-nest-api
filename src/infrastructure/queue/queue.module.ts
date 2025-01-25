import { QueueConsts } from '~/common/constants';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => ({
        connection: {
          host: process.env.REDIS_HOST as string,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      }),
    }),
    BullModule.registerQueueAsync({
      name: QueueConsts.AUTH_QUEUE,
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
