import { RMQ_ENUM_EXCHANGE_TYPE } from '../constants/rmq.enum.constant';

export interface IRMQConnection {
    login: string;
    password: string;
    host: string;
    port: string;
    vhost: string;
}

export interface IRMQExchange {
    name: string;
    durable: boolean;
    type: RMQ_ENUM_EXCHANGE_TYPE;
    arguments?: {
        [key: string]: unknown;
    };
}

export interface IRMQModuleOptions {
    exchange: IRMQExchange;
    connection: IRMQConnection;
    reconnectTimeInSeconds?: number;
    heartbeatIntervalInSeconds?: number;
    prefetchCount?: number;
    isGlobalPrefetchCount?: boolean;
}

export interface IRouteOptions {
    exchange: string;
    routingKey: string;
    queue: string;
}
