import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderFactory } from './factories/order.factory';
@Module({
    imports: [],
    providers: [OrderService, OrderFactory],
    exports: [OrderService, OrderFactory],
})
export class OrderModule {}
