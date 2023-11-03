import { Module } from '@nestjs/common';
import { TwilioModule } from './twilio/twilio.module';

@Module({
    providers: [],
    imports: [TwilioModule],
    exports: [TwilioModule],
})
export class SMSCoreModule {}
