export interface IOrder {
    calculateTotal(): number;
}

export class StandardOrder implements IOrder {
    calculateTotal(): number {
        return 100;
    }
}

export class ExpressOrder implements IOrder {
    calculateTotal(): number {
        return 200;
    }
}
