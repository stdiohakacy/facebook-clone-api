import { SES, SendEmailRequest } from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AbstractEmailProvider } from './email.provider.abstract';

@Injectable()
export class SESEmailProvider extends AbstractEmailProvider {
    private readonly sesClient: SES;

    constructor(private configService: ConfigService) {
        super();
        this.sesClient = new SES({
            apiVersion: 'latest',
            region: this.configService.get<string>('aws.credential.region'),
        });
    }

    async send(toEmails: string[], subject: string, htmlContent: string) {
        const fromAddress: string = this.configService.get<string>(
            'aws.ses.fromAddress'
        );

        const sesParams: SendEmailRequest = {
            Source: fromAddress,
            Destination: { ToAddresses: toEmails },
            Message: {
                Subject: {
                    Data: subject,
                },
                Body: {
                    Html: {
                        Data: htmlContent,
                    },
                },
            },
        };

        return await this.sesClient.sendEmail(sesParams);
    }
}
