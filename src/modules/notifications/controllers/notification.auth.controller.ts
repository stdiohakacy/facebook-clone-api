import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from '../services/notification.service';
import { Response } from 'src/core/response/decorators/response.decorator';
import {
    GetUser,
    UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from 'src/core/auth/decorators/auth.jwt.decorator';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { IResponse } from 'src/core/response/interfaces/response.interface';
import { NotificationCreateDTO } from '../dtos/notification.create.dto';
import { NotificationAuthCreateDoc } from '../docs/notification.auth.doc';

@ApiTags('modules.auth.notification')
@Controller({ version: '1', path: '/notification' })
export class NotificationAuthController {
    constructor(private readonly notificationService: NotificationService) {}

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
}
