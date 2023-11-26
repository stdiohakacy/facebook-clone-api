import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    constructor() {}

    async sendEmail(to: string, subject: string, body: string) {
        console.log(`Mail send to ${to} - ${subject} - ${body}`);
    }
}
