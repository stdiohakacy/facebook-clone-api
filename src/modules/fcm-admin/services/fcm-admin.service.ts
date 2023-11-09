import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { SubscriptionRequestDTO } from '../dtos/subscription.request.dto';
import { SubscriberService } from 'src/modules/subscriber/services/subscriber.service';
import { ENUM_SUBSCRIBER_STATUS_CODE_ERROR } from 'src/modules/subscriber/constants/subscriber.status-code.constant';
import { DataSource } from 'typeorm';
import admin from 'firebase-admin';
import { instanceToPlain } from 'class-transformer';
import { SingleRequestDTO } from '../dtos/single.request.dto';
import { NotificationService } from 'src/modules/notifications/services/notification.service';
import {
    ENUM_NOTIFICATION_PROGRESS,
    ENUM_NOTIFICATION_STATUS,
    ENUM_NOTIFICATION_TYPE,
} from 'src/modules/notifications/constants/notification.enum.constant';
import { MulticastRequestDTO } from '../dtos/multicast.request.dto';
import MulticastMessage = admin.messaging.MulticastMessage;
import { TopicRequestDTO } from '../dtos/topic.request.dto';

@Injectable()
export class FCMAdminService {
    constructor(
        private readonly subscriberService: SubscriberService,
        private readonly notificationService: NotificationService,
        private readonly dataSource: DataSource
    ) {}

    async clientSubscriptionToTopic(
        dto: SubscriptionRequestDTO
    ): Promise<Record<string, any>> {
        const { username, token, topic } = dto;
        const subscriber = await this.subscriberService.getByUsername(
            `${topic}-${username}`
        );

        if (subscriber) {
            throw new ConflictException({
                statusCode:
                    ENUM_SUBSCRIBER_STATUS_CODE_ERROR.SUBSCRIBER_ALREADY_EXIST_ERROR,
                message: 'subscriber.error.alreadyExist',
            });
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const response: admin.messaging.MessagingTopicManagementResponse =
                await admin.messaging().subscribeToTopic(token, topic);

            console.log(response);
            const subscriberCreated = await this.subscriberService.save(
                username,
                token,
                topic,
                true
            );
            await queryRunner.commitTransaction();
            return instanceToPlain(subscriberCreated);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(
                `Error subscribing ${username} to topic: ${topic}`
            );
        }
    }

    async adminToggleSubscriptionToTopic(dto: SubscriptionRequestDTO) {
        const { token, topic, subscribed } = dto;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            subscribed
                ? await admin.messaging().subscribeToTopic(token, topic)
                : await admin.messaging().unsubscribeFromTopic(token, topic);
            await this.subscriberService.update(token, subscribed);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(
                `Error ${
                    subscribed ? 'subscribing' : 'unsubscribing'
                } to topic: ${topic}`
            );
        } finally {
            await queryRunner.release();
        }
    }

    async sendPushNotificationToDevice(dto: SingleRequestDTO) {
        if (!dto?.token) {
            throw new BadRequestException({
                statusCode: 10000,
                message: 'Token must provide!',
            });
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const { title, content, token, topic, username } = dto;

        try {
            const notification = { title, content };
            await admin.messaging().sendToDevice(token, { notification });
            await this.notificationService.save(
                title,
                content,
                topic,
                username,
                ENUM_NOTIFICATION_STATUS.UNREAD,
                ENUM_NOTIFICATION_TYPE.SINGLE,
                ENUM_NOTIFICATION_PROGRESS.IN_PROGRESS
            );
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            try {
                await this.notificationService.save(
                    title,
                    content,
                    topic,
                    username,
                    ENUM_NOTIFICATION_STATUS.UNREAD,
                    ENUM_NOTIFICATION_TYPE.SINGLE,
                    ENUM_NOTIFICATION_PROGRESS.FAILED
                );
                await queryRunner.commitTransaction();
            } catch (error) {
                await queryRunner.rollbackTransaction();
            } finally {
                await queryRunner.release();
            }
            console.log(
                `Error sending push notification to username: ${username}`,
                error
            );
            throw new InternalServerErrorException(
                `Error sending push notification to username: ${username}`
            );
        }
    }

    async sendMulticastPushNotification(dto: MulticastRequestDTO) {
        const { subscribers, tokens } = dto;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const message: MulticastMessage = {
                notification: {
                    title: subscribers[0].title,
                    body: subscribers[0].content,
                },
                tokens,
            };
            await admin.messaging().sendMulticast(message);
            await this.saveMulticastNotifications(subscribers, true);
            await queryRunner.commitTransaction();
            return `Multicast push notification was sent`;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            try {
                await this.saveMulticastNotifications(subscribers, false);
                console.log('Error sending multicast push notification', error);
                await queryRunner.commitTransaction();
                throw new InternalServerErrorException(
                    `Error sending push notification`
                );
            } catch (error) {
                await queryRunner.rollbackTransaction();
                console.log(
                    `Error sending push notification to username`,
                    error
                );
                throw new InternalServerErrorException(
                    `Error sending push notification`
                );
            } finally {
                await queryRunner.release();
            }
        }
    }

    async sendPushNotificationToTopic(dto: TopicRequestDTO) {
        const { title, content, topic, username } = dto;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const notification = {
                title,
                body: content,
            };
            await admin.messaging().sendToTopic(topic, { notification });
            await this.notificationService.save(
                title,
                content,
                topic,
                username,
                ENUM_NOTIFICATION_STATUS.UNREAD,
                ENUM_NOTIFICATION_TYPE.TOPIC,
                ENUM_NOTIFICATION_PROGRESS.COMPLETED
            );
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            try {
                await this.notificationService.save(
                    title,
                    content,
                    topic,
                    username,
                    ENUM_NOTIFICATION_STATUS.UNREAD,
                    ENUM_NOTIFICATION_TYPE.TOPIC,
                    ENUM_NOTIFICATION_PROGRESS.FAILED
                );
                await queryRunner.commitTransaction();
            } catch (error) {
                await queryRunner.rollbackTransaction();
                throw new InternalServerErrorException(
                    `Error sending push notification to topic: ${topic}`
                );
            } finally {
                await queryRunner.release();
            }
        }
    }

    private async saveMulticastNotifications(
        subscribers: SingleRequestDTO[],
        success: boolean
    ) {
        await subscribers.forEach((subscriber) => {
            const { title, content, topic, username, notificationType } =
                subscriber;

            this.notificationService.save(
                title,
                content,
                topic,
                username,
                ENUM_NOTIFICATION_STATUS.UNREAD,
                notificationType,
                success
                    ? ENUM_NOTIFICATION_PROGRESS.COMPLETED
                    : ENUM_NOTIFICATION_PROGRESS.FAILED
            );
        });
    }
}
