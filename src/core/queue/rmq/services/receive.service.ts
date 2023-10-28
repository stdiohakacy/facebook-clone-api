import { Injectable } from '@nestjs/common';
import { TRMQResponse } from '../constants/rmq.constants';
import { RMQProvider, RMQSubscription } from '../decorators/rmq.decorators';
import { RmqService } from './rmq.service';
import {
    RMQ_ENUM_EXCHANGE_NAME,
    RMQ_ENUM_EXCHANGE_QUEUE_NAME,
    RMQ_ENUM_EXCHANGE_ROUTING_KEY,
} from '../constants/rmq.enum.constant';

@RMQProvider()
@Injectable()
export class RmqReceiveService {
    constructor(public readonly rmqService: RmqService) {}

    @RMQSubscription({
        exchange: RMQ_ENUM_EXCHANGE_NAME.REDIS_SYNC_POSTGRES,
        routingKey: RMQ_ENUM_EXCHANGE_ROUTING_KEY.REDIS_SYNC_POSTGRES,
        queue: RMQ_ENUM_EXCHANGE_QUEUE_NAME.REDIS_SYNC_POSTGRES,
    })
    protected async example(msg: unknown): Promise<TRMQResponse> {
        try {
            console.log(msg);

            return 'ack';
        } catch (error) {
            console.error(
                `RmqRecieveService: example - ${JSON.stringify(error)}`
            );

            return 'nack';
        }
    }
}
