import { EmailContent } from '~/common/types';
import { QueueService } from '~/infrastructure/queue/queue.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly _queueService: QueueService) {}

  async addSendSecretCodeJob(emailContent: EmailContent): Promise<void> {
    await this._queueService.addSendSecretCodeJob(emailContent);
  }
}
