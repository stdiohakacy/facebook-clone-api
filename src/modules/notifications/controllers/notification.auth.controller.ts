import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from '../services/notification.service';
import {
    Response,
    ResponsePaging,
} from 'src/core/response/decorators/response.decorator';
import {
    GetUser,
    UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from 'src/core/auth/decorators/auth.jwt.decorator';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { IResponse } from 'src/core/response/interfaces/response.interface';
import { NotificationCreateDTO } from '../dtos/notification.create.dto';
import {
    NotificationAuthAcceptPushDoc,
    NotificationAuthCreateDoc,
    NotificationAuthDisablePushDoc,
    NotificationAuthListDoc,
    NotificationAuthReadDoc,
    NotificationAuthSendDoc,
    NotificationAuthSendMulticastPushDoc,
    NotificationAuthSendTopicPushDoc,
    NotificationAuthSubscribeDoc,
    NotificationAuthToggleDoc,
} from '../docs/notification.auth.doc';
import { NotificationListSerialization } from '../serializations/notification.list.serialization';
import { PaginationQuery } from 'src/core/pagination/decorators/pagination.decorator';
import {
    NOTIFICATION_DEFAULT_AVAILABLE_ORDER_BY,
    NOTIFICATION_DEFAULT_AVAILABLE_SEARCH,
    NOTIFICATION_DEFAULT_ORDER_BY,
    NOTIFICATION_DEFAULT_ORDER_DIRECTION,
    NOTIFICATION_DEFAULT_PER_PAGE,
} from '../constants/notification.list.constant';
import { PaginationListDTO } from 'src/core/pagination/dtos/pagination.list.dto';
import { RequestUserAgent } from 'src/core/request/decorators/request.decorator';
import { IResult } from 'ua-parser-js';
import { NotificationTokenAcceptPushDTO } from '../dtos/notification-token.accept-push.dto';
import { NotificationSubscriptionRequestDTO } from '../dtos/notification.subscription.request.dto';
import { NotificationMulticastRequestDTO } from '../dtos/notification.multicast.request.dto';
import { NotificationTopicRequestDTO } from '../dtos/notification.topic.request.dto';
import { NotificationSingleRequestDTO } from '../dtos/notification.single.request.dto';

@ApiTags('modules.auth.notification')
@Controller({ version: '1', path: '/notification' })
export class NotificationAuthController {
    constructor(private readonly notificationService: NotificationService) {}

    @NotificationAuthListDoc()
    @ResponsePaging('notification.list', {
        serialization: NotificationListSerialization,
    })
    @UserProtected()
    @AuthJwtAccessProtected()
    @Get('/list')
    async list(
        @GetUser() user: UserEntity,
        @PaginationQuery(
            NOTIFICATION_DEFAULT_PER_PAGE,
            NOTIFICATION_DEFAULT_ORDER_BY,
            NOTIFICATION_DEFAULT_ORDER_DIRECTION,
            NOTIFICATION_DEFAULT_AVAILABLE_SEARCH,
            NOTIFICATION_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDTO
    ) {
        return await this.notificationService.findPaging(user.id, {
            _search,
            _limit,
            _offset,
            _order,
        });
    }

    @NotificationAuthCreateDoc()
    @Response('notification.create')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('/')
    async create(
        @GetUser() user: UserEntity,
        @Body() dto: NotificationCreateDTO
    ): Promise<IResponse> {
        dto.fromUserId = user?.id || '';
        return await this.notificationService.create(dto);
    }

    @NotificationAuthReadDoc()
    @Response('notification.read')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Patch('/:id')
    async read(@Param('id') id: string) {
        return await this.notificationService.read(id);
    }

    @NotificationAuthAcceptPushDoc()
    @Response('notification.acceptPush')
    @UserProtected()
    @AuthJwtAccessProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/accept')
    async acceptPushNotification(
        @GetUser() userAuth: UserEntity,
        @RequestUserAgent() userAgent: IResult,
        @Body() dto: NotificationTokenAcceptPushDTO
    ) {
        const { token } = dto;
        return await this.notificationService.acceptPushNotification(
            userAuth?.id || '1e8b2712-a9e4-4060-8804-5535bd535db4',
            userAgent,
            token
        );
    }

    @NotificationAuthDisablePushDoc()
    @Response('notification.disablePush')
    @UserProtected()
    @AuthJwtAccessProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/disable')
    async disablePushNotification(
        @GetUser() userAuth: UserEntity,
        @RequestUserAgent() userAgent: IResult
    ) {
        return await this.notificationService.disablePushNotification(
            userAuth?.id || '1e8b2712-a9e4-4060-8804-5535bd535db4',
            userAgent
        );
    }

    @NotificationAuthSubscribeDoc()
    @Response('notification.subscribe')
    // @UserProtected()
    // @AuthJwtAccessProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/subscribe')
    @HttpCode(200)
    async clientSubscriptionToTopic(
        @Body() dto: NotificationSubscriptionRequestDTO
    ) {
        return await this.notificationService.clientSubscriptionToTopic(dto);
    }

    @NotificationAuthToggleDoc()
    @Response('notification.toggle')
    @UserProtected()
    @AuthJwtAccessProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/toggle')
    @HttpCode(200)
    async toggleSubscriptionToTopic(
        @Body() dto: NotificationSubscriptionRequestDTO
    ) {
        return await this.notificationService.toggleSubscriptionToTopic(dto);
    }

    @NotificationAuthSendDoc()
    @Response('notification.send')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('/send')
    async send(
        @GetUser() userAuth: UserEntity,
        @Body() dto: NotificationSingleRequestDTO
    ) {
        const { title, body } = dto;
        return await this.notificationService.send(userAuth, title, body);
    }

    @NotificationAuthSendMulticastPushDoc()
    @Response('notification.sendMulticastPush')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('/send-multicast-push')
    async sendMulticastPush(@Body() dto: NotificationMulticastRequestDTO) {
        return await this.notificationService.sendMulticastPush(dto);
    }

    @NotificationAuthSendTopicPushDoc()
    @Response('notification.sendTopicPush')
    // @UserProtected()
    // @AuthJwtAccessProtected()
    @Post('/send-topic-push')
    async sendTopicPush(@Body() dto: NotificationTopicRequestDTO) {
        return await this.notificationService.sendPushNotificationToTopic(dto);
    }
}
