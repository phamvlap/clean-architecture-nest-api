import { QueueConsts, QueueJobConsts } from '~/common/constants';
import { EmailContent } from '~/common/types';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QueueConsts.AUTH_QUEUE) private readonly _authQueue: Queue,
  ) {}

  async addSendSecretCodeJob(emailContent: EmailContent): Promise<void> {
    await this._authQueue.add(QueueJobConsts.SEND_SECRET_CODE, emailContent);
  }
}
