import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
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
    NotificationAuthCreateDoc,
    NotificationAuthListDoc,
    NotificationAuthReadDoc,
    NotificationAuthSendDoc,
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
import { PushNotificationSendDTO } from 'src/modules/push-notification/dtos/push-notification.dto';

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

    @NotificationAuthSendDoc()
    @Response('notification.send')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('/send')
    async send(
        @GetUser() userAuth: UserEntity,
        @Body() dto: PushNotificationSendDTO
    ) {
        const { title, body } = dto;
        return await this.notificationService.send(userAuth, title, body);
    }
}
