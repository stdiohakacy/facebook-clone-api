import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
    constructor() {}

    async processPayment(orderId: string, amount: number) {
        console.log(`Process payment at order ${orderId} - ${amount}`);
    }
}
