import { Injectable } from '@nestjs/common';
import { RMQProvider, RMQSubscription } from '../decorators/rmq.decorator';
import { RmqService } from './rmq.service';
import { TRMQResponse } from '../constants/rmq.constant';

@RMQProvider()
@Injectable()
export class RmqReceiveService {
    constructor(
        // private readonly logger: LoggerService,
        public readonly rmqService: RmqService
    ) {}

    @RMQSubscription({
        exchange: `example`,
        routingKey: 'example_routing_key',
        queue: `example_queue`,
    })
    protected async example(msg: unknown): Promise<TRMQResponse> {
        try {
            console.log(msg);

            return 'ack';
        } catch (error) {
            // this.logger.error(
            //     `RmqRecieveService: example - ${JSON.stringify(error)}`
            // );
            console.error(
                `RmqRecieveService: example - ${JSON.stringify(error)}`
            );

            return 'nack';
        }
    }
}
