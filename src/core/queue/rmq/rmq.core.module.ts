import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { RMQ_MODULE_OPTIONS } from './constants/rmq.constants';
import { RmqExplorer } from './explorers/rmq.explorer';
import { RmqService } from './services/rmq.service';
import { RmqReceiveService } from './services/receive.service';
import { ConfigService } from '@nestjs/config';
import { RMQ_ENUM_EXCHANGE_TYPE } from './constants/rmq.enum.constant';
import { RedisCoreModule } from 'src/core/cache/redis/redis.core.module';
import { RedisService } from 'src/core/cache/redis/services/redis.service';

@Module({
    imports: [DiscoveryModule, MetadataScanner, RedisCoreModule],
    providers: [
        {
            provide: RMQ_MODULE_OPTIONS,

            useFactory: (configService: ConfigService) => {
                const exchangeName =
                    configService.get('queue.rmq.exchange') ||
                    'redis-sync-postgres-exchange';

                const exchangeType =
                    configService.get('queue.rmq.type') ||
                    RMQ_ENUM_EXCHANGE_TYPE.DIRECT;

                const username =
                    configService.get('queue.rmq.username') || 'admin';
                const password =
                    configService.get('queue.rmq.password') || '123456';
                const host = configService.get('queue.rmq.host') || 'localhost';
                const port = configService.get('queue.rmq.port') || 5672;
                const vhost = configService.get('queue.rmq.vhost') || 'vhost';

                return {
                    exchange: {
                        name: exchangeName,
                        durable: true,
                        type: exchangeType,
                    },
                    connection: {
                        login: username,
                        password,
                        host,
                        port,
                        vhost,
                    },
                };
            },
            inject: [ConfigService],
        },
        RmqExplorer,
        RmqService,
        RmqReceiveService,
        RedisService,
    ],
    exports: [RmqService],
})
export class RmqCoreModule {}
