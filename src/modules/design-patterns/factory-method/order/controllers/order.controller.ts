import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { OrderCreateDoc } from '../docs/order.doc';
import { OrderCreateDTO } from '../dtos/order.create.dto';

@ApiTags('modules.auth.order')
@Controller({ version: '1', path: '/order' })
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @OrderCreateDoc()
    @Post('/')
    async create(@Body() dto: OrderCreateDTO) {
        const { type } = dto;
        const order = this.orderService.createOrder(type);
        return order.calculateTotal();
    }
}
