import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { DataSource, Repository } from 'typeorm';
import { NotificationCreateDTO } from '../dtos/notification.create.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { instanceToPlain } from 'class-transformer';
import {
    ENUM_NOTIFICATION_PROGRESS,
    ENUM_NOTIFICATION_STATUS,
    ENUM_NOTIFICATION_TOKEN_STATUS,
    ENUM_NOTIFICATION_TYPE,
} from '../constants/notification.enum.constant';
import { ENUM_NOTIFICATION_STATUS_CODE_ERROR } from '../constants/notification.status-code.constant';
import { PaginationOmitListDTO } from 'src/core/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/core/pagination/services/pagination.service';
import firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { NotificationTokenEntity } from '../entities/notification-token.entity';
import { IResult } from 'ua-parser-js';
import { NotificationSubscriptionRequestDTO } from '../dtos/notification.subscription.request.dto';
import { SubscriberService } from 'src/modules/subscriber/services/subscriber.service';
import { NotificationMulticastRequestDTO } from '../dtos/notification.multicast.request.dto';
import MulticastMessage = firebase.messaging.MulticastMessage;
import { NotificationSingleRequestDTO } from '../dtos/notification.single.request.dto';
import { NotificationTopicRequestDTO } from '../dtos/notification.topic.request.dto';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notificationRepo: Repository<NotificationEntity>,
        @InjectRepository(NotificationTokenEntity)
        private readonly notificationTokenRepo: Repository<NotificationTokenEntity>,
        private readonly userService: UserService,
        private readonly paginationService: PaginationService,
        private readonly configService: ConfigService,
        private readonly subscriberService: SubscriberService,
        private readonly dataSource: DataSource
    ) {
        firebase.initializeApp({
            credential: firebase.credential.cert({
                projectId: this.configService.get<string>(
                    'notification.fcm.projectId'
                ),
                privateKey: String(
                    this.configService.get<string>(
                        'notification.fcm.privateKey'
                    )
                ),
                clientEmail: this.configService.get<string>(
                    'notification.fcm.clientEmail'
                ),
            }),
        });
    }

    async findPaging(fromUserId: string, pagination: PaginationOmitListDTO) {
        const { _limit, _offset, _order } = pagination;
        const comments = await this.notificationRepo.find({
            skip: _offset,
            take: _limit,
            where: { fromUserId },
            order: _order,
        });

        const total = comments.length;
        const totalPage = this.paginationService.totalPage(total, _limit);
        return {
            _pagination: { total, totalPage },
            data: comments,
        };
    }

    async create(dto: NotificationCreateDTO) {
        const { toUserId } = dto;
        await this.userService.getById(toUserId);
        const notificationCreated = await this.notificationRepo.save(
            this.notificationRepo.create({
                ...dto,
                notificationStatus: ENUM_NOTIFICATION_STATUS.UNREAD,
            })
        );

        return instanceToPlain({ data: notificationCreated });
    }

    async read(id: string) {
        const notification = await this.notificationRepo.findOne({
            where: { id },
        });

        if (!notification) {
            throw new NotFoundException({
                statusCode:
                    ENUM_NOTIFICATION_STATUS_CODE_ERROR.NOTIFICATION_NOT_FOUND_ERROR,
                message: 'notification.error.notFound',
            });
        }

        await this.notificationRepo.save(notification.read());
    }

    async save(
        title: string,
        content: string,
        topic: string,
        username: string,
        notificationStatus: ENUM_NOTIFICATION_STATUS,
        notificationType: ENUM_NOTIFICATION_TYPE,
        notificationProgress: ENUM_NOTIFICATION_PROGRESS
    ) {
        const notificationCreated = await this.notificationRepo.save(
            this.notificationRepo.create({
                title,
                content,
                topic,
                username,
                notificationStatus,
                notificationType,
                notificationProgress,
            })
        );

        return notificationCreated;
    }

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

    async clientSubscriptionToTopic(dto: NotificationSubscriptionRequestDTO) {
        const { username, token, topic } = dto;
        const subscriber = await this.subscriberService.getByUsername(
            `${topic}-${username}`
        );
        if (subscriber) {
            return `${username} is already subscribed`;
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await firebase.messaging().subscribeToTopic(token, topic);

            await this.subscriberService.save(username, token, topic, true);
            await queryRunner.commitTransaction();
            return `${username} was successfully subscribed to topic: ${topic}`;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(
                `Error subscribing ${username} to topic: ${topic}`
            );
        } finally {
            await queryRunner.release();
        }
    }

    async toggleSubscriptionToTopic(
        dto: NotificationSubscriptionRequestDTO
    ): Promise<string> {
        const { token, topic, subscribed } = dto;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            subscribed
                ? await firebase.messaging().subscribeToTopic(token, topic)
                : await firebase.messaging().unsubscribeFromTopic(token, topic);
            await this.subscriberService.update(token, subscribed);
            await queryRunner.commitTransaction();
            return `Usernames were successfully ${
                subscribed ? 'subscribed' : 'unsubscribed'
            }`;
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

    async send(user: UserEntity, title: string, body: string) {
        const notificationToken = await this.notificationTokenRepo.findOne({
            where: {
                userId: user.id,
                notificationTokenStatus: ENUM_NOTIFICATION_TOKEN_STATUS.ACTIVE,
            },
        });

        if (!notificationToken) {
            throw new NotFoundException({
                statusCode:
                    ENUM_NOTIFICATION_STATUS_CODE_ERROR.NOTIFICATION_TOKEN_NOT_FOUND_ERROR,
                message: 'notification.error.notFound',
            });
        }

        // await this.notificationRepo.create({ topic: "", username: "", title })

        await firebase
            .messaging()
            .send({
                notification: { title, body },
                token: notificationToken.token,
            })
            .catch((error: any) => console.error(`Error!!!!!`, error));
    }

    async sendMulticastPush(
        dto: NotificationMulticastRequestDTO
    ): Promise<boolean> {
        const { subscribers, tokens } = dto;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const message: MulticastMessage = {
                notification: {
                    title: subscribers[0].title,
                    body: subscribers[0].body,
                },
                tokens,
            };
            await firebase.messaging().sendMulticast(message);
            await this.saveMulticastNotifications(subscribers, true);
            await queryRunner.commitTransaction();

            return true;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            try {
                await this.saveMulticastNotifications(subscribers, false);
                console.error(
                    'Error sending multicast push notification',
                    error
                );
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

    async sendPushNotificationToTopic(dto: NotificationTopicRequestDTO) {
        const { title, body, topic } = dto;
        // const { title, body, notificationType, topic, username } = dto;
        // const queryRunner = this.dataSource.createQueryRunner();
        // await queryRunner.connect();
        // await queryRunner.startTransaction();
        try {
            const notification = {
                title,
                body,
            };
            try {
                const data = firebase.messaging();
                console.log(data);
                await firebase.messaging().sendToTopic(topic, { notification });
            } catch (error) {
                console.error(error);
            }

            // await this.notificationRepo.save(
            //     this.notificationRepo.create({
            //         title,
            //         content: body,
            //         topic,
            //         username,
            //         notificationType,
            //         notificationProgress: ENUM_NOTIFICATION_PROGRESS.COMPLETED,
            //     })
            // );
            // await queryRunner.commitTransaction();
            return `Push notification was sent to topic: ${topic}`;
        } catch (error) {
            console.error(error);
            // await queryRunner.rollbackTransaction();
            // try {
            //     await this.notificationRepo.save(
            //         this.notificationRepo.create({
            //             title,
            //             content: body,
            //             topic,
            //             username,
            //             notificationType,
            //             notificationProgress: ENUM_NOTIFICATION_PROGRESS.FAILED,
            //         })
            //     );
            //     await queryRunner.commitTransaction();
            //     return `Error sending push notification to topic: ${topic}`;
            // } catch (error) {
            //     await queryRunner.rollbackTransaction();
            //     throw new InternalServerErrorException(
            //         `Error sending push notification to topic: ${topic}`
            //     );
            // } finally {
            //     await queryRunner.release();
            // }
        }
    }

    private async saveMulticastNotifications(
        subscribers: NotificationSingleRequestDTO[],
        success: boolean
    ) {
        await subscribers.forEach(async (subscriber) => {
            const { title, body, topic, username, notificationType } =
                subscriber;

            const notification = this.notificationRepo.create({
                title,
                content: body,
                topic,
                username,
                notificationType,
                notificationProgress: success
                    ? ENUM_NOTIFICATION_PROGRESS.COMPLETED
                    : ENUM_NOTIFICATION_PROGRESS.FAILED,
            });
            await this.notificationRepo.save(notification);
        });
    }
}
