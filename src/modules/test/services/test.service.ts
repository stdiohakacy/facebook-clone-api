import { Injectable } from '@nestjs/common';
import { RmqService } from 'src/core/queue/rmq/services/rmq.service';

@Injectable()
export class TestService {
    constructor(private readonly rmqService: RmqService) {}
    test() {}
}
