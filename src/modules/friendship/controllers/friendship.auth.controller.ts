import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthJwtAccessProtected } from 'src/core/auth/decorators/auth.jwt.decorator';
import { Response } from 'src/core/response/decorators/response.decorator';
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
    FriendshipAuthRejectRequestDoc,
    FriendshipAuthRequestDoc,
} from '../docs/friendship.auth.doc';

@ApiTags('modules.auth.friendship')
@Controller({ version: '1', path: '/friendship' })
export class FriendshipAuthController {
    constructor(private readonly friendshipService: FriendshipService) {}

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
