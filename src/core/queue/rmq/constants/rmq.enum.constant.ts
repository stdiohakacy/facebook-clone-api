export enum RMQ_ENUM_EXCHANGE_TYPE {
    TOPIC = 'topic',
    DIRECT = 'direct',
    X_DELAYED_MESSAGE = 'x-delayed-message',
}

export enum RMQ_ENUM_EXCHANGE_NAME {
    REDIS_SYNC_POSTGRES = 'redis-sync-postgres-exchange',
}

export enum RMQ_ENUM_EXCHANGE_ROUTING_KEY {
    REDIS_SYNC_POSTGRES = 'redis-sync-postgres-routing-key',
}

export enum RMQ_ENUM_EXCHANGE_QUEUE_NAME {
    REDIS_SYNC_POSTGRES = 'redis-sync-postgres-queue',
}
