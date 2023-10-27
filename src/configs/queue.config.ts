import { registerAs } from '@nestjs/config';
import { RMQ_EXCHANGE_TYPE } from 'src/core/queue/rmq/constants/rmq.enum.constant';

export default registerAs(
    'queue',
    (): Record<string, any> => ({
        rmq: {
            name: process.env.RMQ_NAME || 'rabbitmq',
            type: process.env.RMQ_EXCHANGE_TYPE || RMQ_EXCHANGE_TYPE.DIRECT,
            username: process.env.RMQ_USERNAME || 'admin',
            password: process.env.RMQ_PASSWORD || 'password',
            host: process.env.RMQ_HOST || 'localhost',
            port: Number(process.env.RMQ_PORT) || 5672,
            portUI: Number(process.env.RMQ_PORT_UI) || 15672,
            vhost: process.env.RMQ_VHOST || '/',
            reconnectTimeInSeconds:
                Number(process.env.RMQ_RECONNECT_TIME_IN_SECONDS) || 5,

            heartbeatIntervalInSeconds:
                Number(process.env.RMQ_HEARTBEAT_INTERVAL_IN_SECONDS) || 5,
            prefetchCount: Number(process.env.RMQ_PREFETCH_COUNT) || 0,

            isGlobalPrefetchCount:
                process.env.RMQ_IS_GLOBAL_PREFETCH_COUNT || 'false',
        },
    })
);
