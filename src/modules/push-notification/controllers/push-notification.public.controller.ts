import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'src/core/response/decorators/response.decorator';
import { PushNotificationSendDTO } from '../dtos/push-notification.dto';
import { PushNotificationPublicSendDoc } from '../docs/push-notification.public.doc';
import { NotificationService } from 'src/core/notification/services/notification.service';

@ApiTags('modules.public.pushNotification')
@Controller({ version: '1', path: '/pushNotification' })
export class PushNotificationPublicController {
    constructor(private readonly notificationService: NotificationService) {}

    @PushNotificationPublicSendDoc()
    @Response('pushNotification.send')
    @Post('/send')
    async send(@Body() dto: PushNotificationSendDTO) {
        const { token, title, body } = dto;
        await this.notificationService.send(token, title, body);
    }
}
