import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { RMQ_MODULE_OPTIONS } from './constants/rmq.constants';
import { RmqExplorer } from './explorers/rmq.explorer';
import { RmqService } from './services/rmq.service';
import { RmqReceiveService } from './services/receive.service';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [DiscoveryModule, MetadataScanner],
    providers: [
        {
            provide: RMQ_MODULE_OPTIONS,

            useFactory: (configService: ConfigService) => ({
                exchange: {
                    name: configService.get('queue.rmq.exchange') || 'example',
                    durable: true,
                    type: configService.get('queue.rmq.type') || 'direct',
                },
                connection: {
                    login: configService.get('queue.rmq.username') || 'admin',
                    password:
                        configService.get('queue.rmq.password') || '123456',
                    host: configService.get('queue.rmq.host') || 'localhost',
                    port: configService.get('queue.rmq.port') || 5672,
                    vhost: configService.get('queue.rmq.vhost') || 'vhost',
                },
            }),
            inject: [ConfigService],
        },
        RmqExplorer,
        RmqService,
        RmqReceiveService,
    ],
    exports: [RmqService],
})
export class RmqCoreModule {}
