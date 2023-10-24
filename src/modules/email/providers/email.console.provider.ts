import { Injectable, Logger } from '@nestjs/common';
import { AbstractEmailProvider } from './email.provider.abstract';

@Injectable()
export class EmailConsoleProvider extends AbstractEmailProvider {
    private readonly logger = new Logger(EmailConsoleProvider.name);

    async send(toEmails: string[], subject: string, htmlContent: string) {
        this.logger.log(htmlContent);
    }
}
