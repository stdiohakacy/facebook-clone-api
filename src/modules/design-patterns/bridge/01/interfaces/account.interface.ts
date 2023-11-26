export interface IAccount {
    openAccount();
}

export class CheckingAccount implements IAccount {
    openAccount() {
        console.log(`Checking account ...`);
    }
}

export class SavingAccount implements IAccount {
    openAccount() {
        console.log(`Saving account ...`);
    }
}
