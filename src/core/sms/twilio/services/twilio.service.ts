import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification';
import { ITwilioService } from '../interfaces/twilio.service.interface';
import { VerificationCheckInstance } from 'twilio/lib/rest/verify/v2/service/verificationCheck';
import { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message';

@Injectable()
export default class TwilioService implements ITwilioService {
    private readonly client: Twilio;
    private serviceSid = '';
    private senderPhoneNumber;

    constructor(private readonly configService: ConfigService) {
        const accountSid = this.configService.get<string>(
            'integration.sms.twilio.accountSid'
        );
        const authToken = this.configService.get<string>(
            'integration.sms.twilio.authToken'
        );
        this.serviceSid = this.configService.get<string>(
            'integration.sms.twilio.verificationServiceSid'
        );
        this.senderPhoneNumber = this.configService.get<string>(
            'integration.sms.twilio.senderPhoneNumber'
        );

        this.client = new Twilio(accountSid, authToken);
    }

    async sendMessage(
        receiverPhoneNumber: string | string[],
        contentMessage: string
    ) {
        const receiverPhoneNumbers: string[] = Array.isArray(
            receiverPhoneNumber
        )
            ? receiverPhoneNumber
            : [receiverPhoneNumber];
        return await Promise.all(
            receiverPhoneNumbers.map(
                async (phoneNumber) =>
                    await this.client.messages.create({
                        body: contentMessage,
                        from: this.senderPhoneNumber,
                        to: phoneNumber,
                    } as MessageListInstanceCreateOptions)
            )
        );
    }

    async initPhoneNumberVerification(
        phone: string
    ): Promise<VerificationInstance> {
        return await this.client.verify.v2
            .services(this.serviceSid)
            .verifications.create({ to: phone, channel: 'sms' });
    }

    async confirmPhoneNumber(
        phoneNumber: string,
        verificationCode: string
    ): Promise<void> {
        const serviceSid = this.configService.get(
            'integration.sms.twilio.verificationServiceSid'
        );
        try {
            const verifyCheck: VerificationCheckInstance =
                await this.client.verify.v2
                    .services(serviceSid)
                    .verificationChecks.create({
                        to: phoneNumber,
                        code: verificationCode,
                    });

            if (!verifyCheck.valid || verifyCheck.status !== 'approved') {
                throw new BadRequestException('Wrong code provided');
            }
        } catch (error) {
            console.error(error);
        }
    }
}
