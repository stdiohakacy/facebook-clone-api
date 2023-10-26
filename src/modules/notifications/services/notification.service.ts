import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { Repository } from 'typeorm';
import { NotificationCreateDTO } from '../dtos/notification.create.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { instanceToPlain } from 'class-transformer';
import { ENUM_NOTIFICATION_STATUS } from '../constants/notification.enum.constant';
import { ENUM_NOTIFICATION_STATUS_CODE_ERROR } from '../constants/notification.status-code.constant';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notificationRepo: Repository<NotificationEntity>,
        private readonly userService: UserService
    ) {}

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
}
