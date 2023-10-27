import { IRMQHandler } from '../constants/rmq.constants';

export interface IRMQService {
    send<T>(routingKey: string, message: T): Promise<void>;
    createQueue(handler: IRMQHandler): Promise<void>;
}
