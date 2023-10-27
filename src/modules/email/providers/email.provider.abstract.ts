import Mustache from 'mustache';
import { ENUM_MAIL_TEMPLATE_KEY } from '../constants/email.enum.constant';
import { EMAIL_TEMPLATE } from '../constants/email.constant';
import { cloneDeep } from 'lodash';
import { IMailContent } from '../interfaces/email.interface';

export abstract class AbstractEmailProvider {
    getContentEmail<T>(key: ENUM_MAIL_TEMPLATE_KEY, params: T): string {
        const templateContent = <IMailContent>cloneDeep(EMAIL_TEMPLATE[key]);
        if (!templateContent) return '';
        return Mustache.render(templateContent.content, params);
    }
    send(toEmails: string[], subject: string, htmlContent: string) {
        console.log({
            toEmails,
            subject,
            htmlContent,
        });
    }
}
