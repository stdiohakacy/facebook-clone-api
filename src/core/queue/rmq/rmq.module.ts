import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { RMQ_MODULE_OPTIONS } from './rmq.constants';
import { RmqExplorer } from './rmq.explorer';
import { RmqService } from './rmq.service';
import { RmqReceiveService } from './services/receive.service';

// const rabbit_settings = config.get<IRabbitMQSettings>('RABBITMQ_SETTINGS');

@Module({
    imports: [DiscoveryModule, MetadataScanner],
    providers: [
        {
            provide: RMQ_MODULE_OPTIONS,
            useValue: {
                exchange: {
                    name: 'example',
                    durable: true,
                    type: 'direct',
                },
                connection: {
                    login: 'admin',
                    password: '123456',
                    host: 'localhost',
                    port: 5672,
                    // vhost: rabbit_settings.vhost,
                },
            },
        },
        RmqExplorer,
        RmqService,
        RmqReceiveService,
    ],
    exports: [RmqService],
})
export class RmqCoreModule {}
