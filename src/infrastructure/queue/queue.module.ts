import {
  getCurrentEnvFilePath,
  readEnvironmentVariablesConfig,
} from '~/common/config/utils';
import { QueueConsts } from '~/common/constants';
import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './queue.module-definition';
import { QueueService } from './queue.service';

@Module({})
export class QueueModule extends ConfigurableModuleClass {
  static register(): DynamicModule {
    const envFilePath = getCurrentEnvFilePath();
    const config = readEnvironmentVariablesConfig(envFilePath);

    return {
      module: QueueModule,
      imports: [
        BullModule.forRootAsync({
          useFactory: () => ({
            connection: {
              host: config.REDIS_HOST,
              port: config.REDIS_PORT,
            },
          }),
        }),
        BullModule.registerQueueAsync({
          name: QueueConsts.AUTH_QUEUE,
        }),
      ],
      providers: [QueueService],
      exports: [QueueService],
    };
  }
}
