import { EmailContent, SendingSecretCodeEmailData } from '~/common/types';
import { Emails } from '~/content/emails';
import { HandlebarsService } from '~/infrastructure/handlebars/handlebars.service';
import { QueueService } from '~/infrastructure/queue/queue.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthQueue {
  constructor(
    private readonly _queueService: QueueService,
    private readonly _handlebarsService: HandlebarsService,
  ) {}

  async addSendSecretCodeJob(data: SendingSecretCodeEmailData) {
    const content = this._handlebarsService.compile(
      Emails.sendingSecretCode.content,
      { secretCode: data.secretCode },
    );

    const emailContent: EmailContent = {
      recipient: data.email,
      subject: Emails.sendingSecretCode.subject,
      content,
    };
    await this._queueService.addSendSecretCodeJob(emailContent);
  }
}
