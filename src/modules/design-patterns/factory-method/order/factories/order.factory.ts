import { Injectable } from '@nestjs/common';
import { ENUM_ORDER_TYPE } from '../constants/order.enum.constant';
import {
    ExpressOrder,
    IOrder,
    StandardOrder,
} from '../interfaces/order.interface';

@Injectable()
export class OrderFactory {
    createOrder(type: ENUM_ORDER_TYPE): IOrder {
        switch (type) {
            case ENUM_ORDER_TYPE.EXPRESS:
                return new ExpressOrder();
            case ENUM_ORDER_TYPE.STANDARD:
                return new StandardOrder();
            default:
                throw new Error('Invalid order type');
        }
    }
}
