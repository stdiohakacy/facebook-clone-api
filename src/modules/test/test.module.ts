import { Module } from '@nestjs/common';
import { TestService } from './services/test.service';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
@Module({
    imports: [DiscoveryModule, MetadataScanner],
    providers: [TestService],
    exports: [TestService],
})
export class TestModule {}
