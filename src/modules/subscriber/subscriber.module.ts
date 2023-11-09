import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriberService } from './services/subscriber.service';
import { SubscriberEntity } from './entities/subscriber.entity';
@Module({
    imports: [TypeOrmModule.forFeature([SubscriberEntity])],
    providers: [SubscriberService],
    exports: [SubscriberService],
})
export class SubscriberModule {}
