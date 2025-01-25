import { Job } from 'bullmq';
import { OAuth2Client } from 'google-auth-library';
import * as nodemailer from 'nodemailer';
import { QueueConsts, QueueJobConsts } from '~/common/constants';
import { EmailContent } from '~/common/types';
import { Processor, WorkerHost } from '@nestjs/bullmq';

@Processor(QueueConsts.AUTH_QUEUE)
export class MailProcessor extends WorkerHost {
  async process(job: Job<any, any, string>) {
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    );

    oAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    });

    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token;
    const adminEmail = process.env.ADMIN_EMAIL;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: adminEmail,
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
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
            from: adminEmail,
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
