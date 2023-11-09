import { Body, Controller, Post } from '@nestjs/common';
import { FCMAdminService } from '../services/fcm-admin.service';
import {
    FcmAdminAuthMulticastPushNotificationDoc,
    FcmAdminAuthPushNotificationDoc,
    FcmAdminAuthPushNotificationToTopicDoc,
    FcmAdminAuthSubscriptionToTopicDoc,
    FcmAdminAuthToggleSubscriptionDoc,
} from '../docs/fcm-admin.auth.doc';
import { Response } from 'src/core/response/decorators/response.decorator';
import { UserProtected } from 'src/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from 'src/core/auth/decorators/auth.jwt.decorator';
import { SubscriptionRequestDTO } from '../dtos/subscription.request.dto';
import { SingleRequestDTO } from '../dtos/single.request.dto';
import { MulticastRequestDTO } from '../dtos/multicast.request.dto';
import { TopicRequestDTO } from '../dtos/topic.request.dto';

@Controller('fcm')
export class FcmAdminAuthController {
    constructor(private readonly fcmAdminService: FCMAdminService) {}

    @FcmAdminAuthSubscriptionToTopicDoc()
    @Response('fcm.subscriptionTopic')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('/subscribe')
    async create(@Body() dto: SubscriptionRequestDTO) {
        await this.fcmAdminService.clientSubscriptionToTopic(dto);
    }

    @FcmAdminAuthToggleSubscriptionDoc()
    @Response('fcm.toggleSubscription')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('/admin-toggle-subscription')
    async toggleSubscription(@Body() dto: SubscriptionRequestDTO) {
        await this.fcmAdminService.adminToggleSubscriptionToTopic(dto);
    }

    @FcmAdminAuthPushNotificationDoc()
    @Response('fcm.pushNotification')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('/token')
    async sendPushNotificationToDevice(@Body() dto: SingleRequestDTO) {
        await this.fcmAdminService.sendPushNotificationToDevice(dto);
    }

    @FcmAdminAuthMulticastPushNotificationDoc()
    @Response('fcm.multicastPushNotification')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('/multicast')
    async sendMulticastPushNotification(@Body() dto: MulticastRequestDTO) {
        await this.fcmAdminService.sendMulticastPushNotification(dto);
    }

    @FcmAdminAuthPushNotificationToTopicDoc()
    @Response('fcm.pushNotificationToTopic')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('/topic')
    async sendPushNotificationToTopic(@Body() dto: TopicRequestDTO) {
        await this.fcmAdminService.sendPushNotificationToTopic(dto);
    }
}
