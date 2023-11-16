import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationTokenEntity } from '../entities/notification-token.entity';
import { Repository } from 'typeorm';
import { ENUM_NOTIFICATION_TOKEN_STATUS } from '../constants/notification-token.enum.constant';
import { IResult } from 'ua-parser-js';

@Injectable()
export class NotificationTokenService {
    constructor(
        @InjectRepository(NotificationTokenEntity)
        private readonly notificationTokenRepo: Repository<NotificationTokenEntity>
    ) {}

    async acceptPushNotification(
        userId: string,
        deviceType: IResult,
        token: string
    ) {
        await this.notificationTokenRepo.update(
            { userId },
            { notificationTokenStatus: ENUM_NOTIFICATION_TOKEN_STATUS.INACTIVE }
        );

        const notificationToken = this.notificationTokenRepo.create({
            userId,
            deviceType,
            token,
            notificationTokenStatus: ENUM_NOTIFICATION_TOKEN_STATUS.ACTIVE,
        });

        const notificationTokenCreated =
            await this.notificationTokenRepo.save(notificationToken);

        return notificationTokenCreated;
    }

    async disablePushNotification(userId: string, deviceType: IResult) {
        await this.notificationTokenRepo.update(
            { userId, deviceType },
            { notificationTokenStatus: ENUM_NOTIFICATION_TOKEN_STATUS.INACTIVE }
        );
    }
}
