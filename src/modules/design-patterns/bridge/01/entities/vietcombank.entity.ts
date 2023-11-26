import { Bank } from '../abstracts/bank.abstract';
import { IAccount } from '../interfaces/account.interface';

export class VietcomBank extends Bank {
    constructor(account: IAccount) {
        super(account);
    }

    openAccount() {
        console.log(`Open your account at VietcomBank is a`);
        this.account.openAccount();
    }
}
