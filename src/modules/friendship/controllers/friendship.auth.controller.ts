import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthJwtAccessProtected } from 'src/core/auth/decorators/auth.jwt.decorator';
import {
    Response,
    ResponsePaging,
} from 'src/core/response/decorators/response.decorator';
import { IResponse } from 'src/core/response/interfaces/response.interface';
import {
    GetUser,
    UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { FriendshipService } from '../services/friendship.service';
import { FriendshipRequestDTO } from '../dtos/friendship.request.dto';
import {
    FriendshipAuthAcceptRequestDoc,
    FriendshipAuthListDoc,
    FriendshipAuthRejectRequestDoc,
    FriendshipAuthRequestDoc,
} from '../docs/friendship.auth.doc';
import { PaginationListDTO } from 'src/core/pagination/dtos/pagination.list.dto';
import { PaginationQuery } from 'src/core/pagination/decorators/pagination.decorator';
import {
    FRIENDSHIP_DEFAULT_AVAILABLE_ORDER_BY,
    FRIENDSHIP_DEFAULT_AVAILABLE_SEARCH,
    FRIENDSHIP_DEFAULT_ORDER_BY,
    FRIENDSHIP_DEFAULT_ORDER_DIRECTION,
    FRIENDSHIP_DEFAULT_PER_PAGE,
} from '../constants/friendship.list.constant';
import { FriendshipListSerialization } from '../serializations/friendship.list.serialization';

@ApiTags('modules.auth.friendship')
@Controller({ version: '1', path: '/friendship' })
export class FriendshipAuthController {
    constructor(private readonly friendshipService: FriendshipService) {}

    @FriendshipAuthListDoc()
    @ResponsePaging('friendship.list', {
        serialization: FriendshipListSerialization,
    })
    @UserProtected()
    @AuthJwtAccessProtected()
    @Get('/list')
    async list(
        @GetUser() user: UserEntity,
        @PaginationQuery(
            FRIENDSHIP_DEFAULT_PER_PAGE,
            FRIENDSHIP_DEFAULT_ORDER_BY,
            FRIENDSHIP_DEFAULT_ORDER_DIRECTION,
            FRIENDSHIP_DEFAULT_AVAILABLE_SEARCH,
            FRIENDSHIP_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDTO
    ) {
        return await this.friendshipService.findPaging(user.id, {
            _search,
            _limit,
            _offset,
            _order,
        });
    }

    @FriendshipAuthRequestDoc()
    @Response('friendship.request')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('/request')
    async request(
        @Body() dto: FriendshipRequestDTO,
        @GetUser() user: UserEntity
    ): Promise<IResponse> {
        return await this.friendshipService.request(user, dto);
    }

    @FriendshipAuthAcceptRequestDoc()
    @Response('friendship.acceptRequest')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Patch('/:id/request/accept')
    async acceptRequest(@Param('id') id: string) {
        await this.friendshipService.acceptRequest(id);
    }

    @FriendshipAuthRejectRequestDoc()
    @Response('friendship.rejectRequest')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Patch('/:id/request/reject')
    async rejectRequest(@Param('id') id: string) {
        await this.friendshipService.rejectRequest(id);
    }

    @FriendshipAuthRejectRequestDoc()
    @Response('friendship.revokeRequest')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Patch('/:id/request/revoke')
    async revokeRequest(@Param('id') id: string) {
        await this.friendshipService.revokeRequest(id);
    }
}
