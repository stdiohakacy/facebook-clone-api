import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { Repository } from 'typeorm';
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
@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notificationRepo: Repository<NotificationEntity>,
        @InjectRepository(NotificationTokenEntity)
        private readonly notificationTokenRepo: Repository<NotificationTokenEntity>,
        private readonly userService: UserService,
        private readonly paginationService: PaginationService,
        private readonly configService: ConfigService
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
