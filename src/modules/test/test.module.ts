import { Module } from '@nestjs/common';
import { TestService } from './services/test.service';
import {} from '@nestjs/core';
import { RmqCoreModule } from 'src/core/queue/rmq/rmq.core.module';
@Module({
    imports: [RmqCoreModule],
    providers: [TestService],
    exports: [TestService],
})
export class TestModule {}
