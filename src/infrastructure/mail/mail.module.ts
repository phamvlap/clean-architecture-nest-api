import { Module } from '@nestjs/common';
import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';

@Module({
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
