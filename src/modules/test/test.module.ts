import { Module } from '@nestjs/common';
import { TestService } from './services/test.service';
import { RmqService } from 'src/core/queue/rmq/services/rmq.service';
import { RmqExplorer } from 'src/core/queue/rmq/explorers/rmq.explorer';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
@Module({
    imports: [DiscoveryModule, MetadataScanner],
    providers: [TestService, RmqService, RmqExplorer],
    exports: [TestService],
})
export class TestModule {}
