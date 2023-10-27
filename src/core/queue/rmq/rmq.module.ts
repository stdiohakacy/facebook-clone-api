import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { RMQ_MODULE_OPTIONS } from './constants/rmq.constants';
import { RmqExplorer } from './explorers/rmq.explorer';
import { RmqService } from './services/rmq.service';
import { RmqReceiveService } from './services/receive.service';

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
                    vhost: 'vhost',
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
