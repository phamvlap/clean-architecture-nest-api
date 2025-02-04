import { Job } from 'bullmq';
import { OAuth2Client } from 'google-auth-library';
import * as nodemailer from 'nodemailer';
import {
  getCurrentEnvFilePath,
  readEnvironmentVariablesConfig,
} from '~/common/config/utils';
import {
  QueueConsts,
  QueueJobConsts,
  TransportProviders,
} from '~/common/constants';
import { EmailContent } from '~/common/types';
import { Processor, WorkerHost } from '@nestjs/bullmq';

@Processor(QueueConsts.AUTH_QUEUE)
export class MailProcessor extends WorkerHost {
  async process(job: Job<any, any, string>) {
    const envFilePath = getCurrentEnvFilePath();
    const config = readEnvironmentVariablesConfig(envFilePath);

    const oAuth2Client = new OAuth2Client(
      config.GOOGLE_OAUTH_CLIENT_ID,
      config.GOOGLE_OAUTH_CLIENT_SECRET,
    );

    oAuth2Client.setCredentials({
      refresh_token: config.GOOGLE_OAUTH_REFRESH_TOKEN,
    });

    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token;
    const senderEmail = config.SENDER_EMAIL;

    const transporter = nodemailer.createTransport({
      service: TransportProviders.GMAIL,
      auth: {
        type: 'OAuth2',
        user: senderEmail,
        clientId: config.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: config.GOOGLE_OAUTH_CLIENT_SECRET,
        refreshToken: config.GOOGLE_OAUTH_REFRESH_TOKEN,
        accessToken: accessToken?.toString(),
      },
    });

    switch (job.name) {
      case QueueJobConsts.SEND_SECRET_CODE:
        try {
          const {
            recipient: to,
            subject,
            content: html,
          } = job.data as EmailContent;

          transporter.sendMail({
            from: senderEmail,
            to,
            subject,
            html,
          });
        } catch (error) {
          console.log({ error });
        }
        break;
    }
  }
}
