import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { Repository } from 'typeorm';
import { NotificationCreateDTO } from '../dtos/notification.create.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { instanceToPlain } from 'class-transformer';
import { ENUM_NOTIFICATION_STATUS } from '../constants/notification.enum.constant';

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
}
