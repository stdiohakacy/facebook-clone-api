import { IAccount } from '../interfaces/account.interface';

export abstract class Bank {
    protected readonly account: IAccount;

    constructor(account: IAccount) {
        this.account = account;
    }

    public abstract openAccount();
}
