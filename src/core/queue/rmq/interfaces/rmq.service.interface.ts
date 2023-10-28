import { IRMQHandler } from './rmq.interface';

export interface IRMQService {
    send<T>(routingKey: string, message: T): Promise<void>;
    createQueue(handler: IRMQHandler): Promise<void>;
}
