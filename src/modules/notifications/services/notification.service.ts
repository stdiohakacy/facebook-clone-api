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
    ENUM_NOTIFICATION_TYPE,
} from '../constants/notification.enum.constant';
import { ENUM_NOTIFICATION_STATUS_CODE_ERROR } from '../constants/notification.status-code.constant';
import { PaginationOmitListDTO } from 'src/core/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/core/pagination/services/pagination.service';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notificationRepo: Repository<NotificationEntity>,
        private readonly userService: UserService,
        private readonly paginationService: PaginationService
    ) {}

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
}
