import { Module } from '@nestjs/common';
import { FCMAdminService } from './services/fcm-admin.service';
import { SubscriberModule } from '../subscriber/subscriber.module';
import { NotificationModule } from '../notifications/notification.module';
@Module({
    imports: [SubscriberModule, NotificationModule],
    providers: [FCMAdminService],
    exports: [FCMAdminService],
})
export class FcmAdminModule {}
