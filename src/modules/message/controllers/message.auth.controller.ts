import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessageService } from '../services/message.service';
import {
    Response,
    ResponsePaging,
} from 'src/core/response/decorators/response.decorator';
import {
    GetUser,
    UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from 'src/core/auth/decorators/auth.jwt.decorator';
import { PaginationQuery } from 'src/core/pagination/decorators/pagination.decorator';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { PaginationListDTO } from 'src/core/pagination/dtos/pagination.list.dto';
import {
    MessageAuthCreateDoc,
    MessageAuthListDoc,
} from '../docs/message.auth.doc';
import { MessageListSerialization } from '../serializations/message.list.serialization';
import {
    MESSAGE_DEFAULT_AVAILABLE_ORDER_BY,
    MESSAGE_DEFAULT_AVAILABLE_SEARCH,
    MESSAGE_DEFAULT_ORDER_BY,
    MESSAGE_DEFAULT_ORDER_DIRECTION,
    MESSAGE_DEFAULT_PER_PAGE,
} from '../constants/message.list.constant';
import { Throttle } from '@nestjs/throttler';
import { MessageCreateDTO } from '../dto/message.create.dto';

@ApiTags('modules.auth.message')
@Controller({ version: '1', path: '/message' })
export class MessageAuthController {
    constructor(private readonly messageService: MessageService) {}

    @MessageAuthListDoc()
    @ResponsePaging('message.list', { serialization: MessageListSerialization })
    @UserProtected()
    @AuthJwtAccessProtected()
    @Get('/list/:friendshipId/friendship')
    async list(
        @Param('friendshipId') friendshipId: string,
        @PaginationQuery(
            MESSAGE_DEFAULT_PER_PAGE,
            MESSAGE_DEFAULT_ORDER_BY,
            MESSAGE_DEFAULT_ORDER_DIRECTION,
            MESSAGE_DEFAULT_AVAILABLE_SEARCH,
            MESSAGE_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDTO
    ) {
        return await this.messageService.findPaging(friendshipId, {
            _search,
            _limit,
            _offset,
            _order,
        });
    }

    @MessageAuthCreateDoc()
    @Throttle({ default: { limit: 5, ttl: 10 } })
    @Response('message.create')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('/')
    async create(
        @GetUser() user: UserEntity,
        @Body() dto: MessageCreateDTO
        // @AuthUser() user: User,
        // @UploadedFiles() { attachments }: { attachments: Attachment[] },
        // @Param('id', ParseIntPipe) id: number,
        // @Body()
        // { content }: CreateMessageDto
    ) {
        dto.createdBy = user.id;
        return await this.messageService.create(dto);
    }
}
