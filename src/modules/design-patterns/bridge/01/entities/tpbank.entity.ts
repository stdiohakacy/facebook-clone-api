import { Bank } from '../abstracts/bank.abstract';
import { IAccount } from '../interfaces/account.interface';

export class TPBank extends Bank {
    constructor(account: IAccount) {
        super(account);
    }

    openAccount() {
        console.log(`Open your account at TPBank is a`);
        this.account.openAccount();
    }
}
