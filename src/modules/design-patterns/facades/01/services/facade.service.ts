import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { PaymentService } from './payment.service';
import { EmailService } from './email.service';

@Injectable()
export class FacadeService {
    constructor(
        private readonly userService: UserService,
        private readonly paymentService: PaymentService,
        private readonly emailService: EmailService
    ) {}

    async getUserAndProcessPayment(
        userId: string,
        orderId: string,
        amount: number,
        email: string
    ) {
        const user = await this.userService.getUserById(userId);
        await this.paymentService.processPayment(orderId, amount);
        await this.emailService.sendEmail(
            email,
            'Payment Confirmation',
            'Your payment has been processed successfully.'
        );
        return user;
    }
}
