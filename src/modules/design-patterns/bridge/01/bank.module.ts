import { Module } from '@nestjs/common';
import { BankService } from './services/bank.service';
@Module({
    providers: [BankService],
    exports: [BankService],
})
export class BankModule {}
