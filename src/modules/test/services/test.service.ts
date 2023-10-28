import { Injectable } from '@nestjs/common';
import { RMQ_ENUM_EXCHANGE_ROUTING_KEY } from 'src/core/queue/rmq/constants/rmq.enum.constant';
import { RmqService } from 'src/core/queue/rmq/services/rmq.service';

@Injectable()
export class TestService {
    constructor(private readonly rmqService: RmqService) {}
    async test() {
        this.rmqService.send(
            RMQ_ENUM_EXCHANGE_ROUTING_KEY.REDIS_SYNC_POSTGRES,
            { message: 'Ok ne!' }
        );
    }
}
