import { QueueModuleOptions } from '~/common/interfaces';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<QueueModuleOptions>()
    .setClassMethodName('register')
    .build();
