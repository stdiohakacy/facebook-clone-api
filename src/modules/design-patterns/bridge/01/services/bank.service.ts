import { Injectable } from '@nestjs/common';
import { VietcomBank } from '../entities/vietcombank.entity';
import { CheckingAccount } from '../interfaces/account.interface';
import { TPBank } from '../entities/tpbank.entity';

@Injectable()
export class BankService {
    constructor() {}

    create() {
        const vietcomBank = new VietcomBank(new CheckingAccount());
        vietcomBank.openAccount();

        const tpBank = new TPBank(new CheckingAccount());
        tpBank.openAccount();
    }
}
