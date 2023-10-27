import { registerAs } from '@nestjs/config';

export default registerAs(
    'queue',
    (): Record<string, any> => ({
        rmq: {
            exchange: process.env.RMQ_EXCHANGE_NAME || 'example',
            type: process.env.RMQ_EXCHANGE_TYPE || 'direct',
            username: process.env.RMQ_USERNAME || 'admin',
            password: process.env.RMQ_PASSWORD,
            vhost: process.env.RMQ_VHOST,
            host: process.env.RMQ_HOST,
            port: Number(process.env.RMQ_PORT),
            portUI: Number(process.env.RMQ_PORT_UI),

            reconnectTimeInSeconds: Number(
                process.env.RMQ_RECONNECT_TIME_IN_SECONDS
            ),

            heartbeatIntervalInSeconds: Number(
                process.env.RMQ_HEARTBEAT_INTERVAL_IN_SECONDS
            ),
            prefetchCount: Number(process.env.RMQ_PREFETCH_COUNT),

            isGlobalPrefetchCount: process.env.RMQ_IS_GLOBAL_PREFETCH_COUNT,
        },
    })
);
