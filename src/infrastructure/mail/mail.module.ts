import { QueueModule } from '~/infrastructure/queue/queue.module';
import { Module } from '@nestjs/common';
import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';

@Module({
  imports: [QueueModule],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
