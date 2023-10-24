import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SESEmailProvider } from './email.ses.provider';
import { EmailConsoleProvider } from './email.console.provider';
import { ENUM_EMAIL_PROVIDER_TYPE } from '../constants/email.enum.constant';
import { ENUM_EMAIL_STATUS_CODE_ERROR } from '../constants/email.status-code.constant';

@Injectable()
export class EmailProviderFactory {
    constructor(private readonly configService: ConfigService) {}

    initProvider() {
        const providerType = this.configService.get<string>('mail.provider');
        switch (providerType) {
            case ENUM_EMAIL_PROVIDER_TYPE.SES:
                return new SESEmailProvider(this.configService);
            case ENUM_EMAIL_PROVIDER_TYPE.CONSOLE:
                return new EmailConsoleProvider();
            default:
                throw new NotFoundException({
                    statusCode:
                        ENUM_EMAIL_STATUS_CODE_ERROR.EMAIL_NOT_FOUND_ERROR,
                    message: 'mail.error.notFound',
                });
        }
    }
}
