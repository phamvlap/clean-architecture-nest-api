import { EmailContent, SendingSecretCodeEmailData } from '~/common/types';
import { Emails } from '~/content/emails';
import { HandlebarsService } from '~/infrastructure/handlebars/handlebars.service';
import { MailService } from '~/infrastructure/mail/mail.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthQueue {
  constructor(
    private readonly _mailService: MailService,
    private readonly _handlebarService: HandlebarsService,
  ) {}

  async addSendSecretCodeJob(data: SendingSecretCodeEmailData) {
    const content = this._handlebarService.compile(
      Emails.sendingSecretCode.content,
      { secretCode: data.secretCode },
    );

    const emailContent: EmailContent = {
      recipient: data.email,
      subject: Emails.sendingSecretCode.subject,
      content,
    };
    await this._mailService.addSendSecretCodeJob(emailContent);
  }
}
