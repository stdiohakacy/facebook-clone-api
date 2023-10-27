import { Module } from '@nestjs/common';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { RmqExplorer } from './explorers/rmq.explorer';
import { RmqService } from './services/rmq.service';

@Module({
    imports: [ConfigModule, DiscoveryModule, MetadataScanner],
    providers: [RmqExplorer, RmqService],
    exports: [RmqExplorer, RmqService],
})
export class RmqCoreModule {}
