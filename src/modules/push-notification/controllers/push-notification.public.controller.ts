import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'src/core/response/decorators/response.decorator';
import { PushNotificationSendDTO } from '../dtos/push-notification.dto';
import { PushNotificationPublicSendDoc } from '../docs/push-notification.public.doc';
import {
    GetUser,
    UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from 'src/core/auth/decorators/auth.jwt.decorator';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { NotificationService } from 'src/modules/notifications/services/notification.service';

@ApiTags('modules.public.pushNotification')
@Controller({ version: '1', path: '/pushNotification' })
export class PushNotificationPublicController {
    constructor(private readonly notificationService: NotificationService) {}

    @PushNotificationPublicSendDoc()
    @UserProtected()
    @AuthJwtAccessProtected()
    @Response('pushNotification.send')
    @Post('/send')
    async send(
        @GetUser() userAuth: UserEntity,
        @Body() dto: PushNotificationSendDTO
    ) {
        const { title, body } = dto;
        return await this.notificationService.send(userAuth, title, body);
    }
}
