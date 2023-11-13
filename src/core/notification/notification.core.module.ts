import { NotificationEntity } from 'src/modules/notifications/entities/notification.entity';
import { Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([NotificationEntity])],
    providers: [NotificationService],
    exports: [NotificationService],
})
export class NotificationCoreModule {}
