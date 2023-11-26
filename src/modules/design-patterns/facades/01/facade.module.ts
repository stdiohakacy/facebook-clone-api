import { Module } from '@nestjs/common';
import { FacadeService } from './services/facade.service';
import { UserService } from './services/user.service';
import { EmailService } from './services/email.service';
import { PaymentService } from './services/payment.service';
@Module({
    providers: [FacadeService, UserService, EmailService, PaymentService],
    exports: [FacadeService],
})
export class FacadeModule {}
