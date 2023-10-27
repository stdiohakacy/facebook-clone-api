import { registerAs } from '@nestjs/config';

export default registerAs(
    'queue',
    (): Record<string, any> => ({
        rmq: {
            name: process.env.RMQ_NAME,
            type: process.env.RMQ_EXCHANGE_TYPE,
            username: process.env.RMQ_USERNAME,
            password: process.env.RMQ_PASSWORD,
            host: process.env.RMQ_HOST,
            port: Number(process.env.RMQ_PORT),
            portUI: Number(process.env.RMQ_PORT_UI),
            vhost: process.env.RMQ_VHOST,
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
