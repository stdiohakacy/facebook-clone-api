import { Injectable } from '@nestjs/common';
import { OrderFactory } from '../factories/order.factory';
import { ENUM_ORDER_TYPE } from '../constants/order.enum.constant';

@Injectable()
export class OrderService {
    constructor(private readonly orderFactory: OrderFactory) {}

    createOrder(type: ENUM_ORDER_TYPE) {
        return this.orderFactory.createOrder(type);
    }
}
