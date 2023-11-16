import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationService } from './services/notification.service';
import { UserModule } from '../user/user.module';
import { NotificationTokenEntity } from './entities/notification-token.entity';
import { NotificationTokenService } from './services/notification-token.service';

const services = [NotificationService, NotificationTokenService];
@Module({
    imports: [
        TypeOrmModule.forFeature([NotificationEntity, NotificationTokenEntity]),
        UserModule,
    ],
    providers: [...services],
    exports: [...services],
})
export class NotificationModule {}
