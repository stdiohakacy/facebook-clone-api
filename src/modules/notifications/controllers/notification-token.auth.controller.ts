import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationTokenService } from '../services/notification-token.service';
import { Response } from 'src/core/response/decorators/response.decorator';
import {
    GetUser,
    UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from 'src/core/auth/decorators/auth.jwt.decorator';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { RequestUserAgent } from 'src/core/request/decorators/request.decorator';
import { IResult } from 'ua-parser-js';
import { NotificationTokenAcceptPushDTO } from '../dtos/notification-token.accept-push.dto';
import {
    NotificationTokenAuthAcceptPushDoc,
    NotificationTokenAuthDisablePushDoc,
} from '../docs/notification-token.auth.doc';

@ApiTags('modules.auth.notificationToken')
@Controller({ version: '1', path: '/notification-tokens' })
export class NotificationTokenAuthController {
    constructor(
        private readonly notificationTokenService: NotificationTokenService
    ) {}

    @NotificationTokenAuthAcceptPushDoc()
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
        return await this.notificationTokenService.acceptPushNotification(
            userAuth?.id || '1e8b2712-a9e4-4060-8804-5535bd535db4',
            userAgent,
            token
        );
    }

    @NotificationTokenAuthDisablePushDoc()
    @Response('notification.disablePush')
    @UserProtected()
    @AuthJwtAccessProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/disable')
    async disablePushNotification(
        @GetUser() userAuth: UserEntity,
        @RequestUserAgent() userAgent: IResult
    ) {
        return await this.notificationTokenService.disablePushNotification(
            userAuth?.id || '1e8b2712-a9e4-4060-8804-5535bd535db4',
            userAgent
        );
    }
}
