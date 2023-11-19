import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationService } from './services/notification.service';
import { UserModule } from '../user/user.module';
import { NotificationTokenEntity } from './entities/notification-token.entity';
import { SubscriberModule } from '../subscriber/subscriber.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([NotificationEntity, NotificationTokenEntity]),
        UserModule,
        SubscriberModule,
    ],
    providers: [NotificationService],
    exports: [NotificationService],
})
export class NotificationModule {}
