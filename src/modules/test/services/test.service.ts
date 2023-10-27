import { Injectable } from '@nestjs/common';
import { RmqService } from 'src/core/queue/rmq/rmq.service';

@Injectable()
export class TestService {
    constructor(private readonly rmqService: RmqService) {}
    async test() {
        this.rmqService.send('example_routing_key', { message: 'Ok ne!' });
    }
}
