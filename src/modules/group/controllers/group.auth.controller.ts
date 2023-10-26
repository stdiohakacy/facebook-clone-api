import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthJwtAccessProtected } from 'src/core/auth/decorators/auth.jwt.decorator';
import { Response } from 'src/core/response/decorators/response.decorator';
import { IResponse } from 'src/core/response/interfaces/response.interface';
import {
    GetUser,
    UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { GroupService } from '../services/group.service';
import { GroupCreateDTO } from '../dtos/group.create.dto';
import {
    GroupAuthCreateDoc,
    GroupAuthDeleteDoc,
    GroupAuthGetDoc,
    GroupAuthUpdateDoc,
    GroupMembershipAuthAddMemberDoc,
    GroupMembershipAuthJoinDoc,
    GroupMembershipAuthRemoveMemberDoc,
} from '../docs/group.auth.doc';
import { GroupUpdateDTO } from '../dtos/group.update.dto';
import { GroupMembershipAuthJoinDTO } from '../dtos/group-membership.join.dto';
import { GroupMembershipAddMemberDTO } from '../dtos/group-membership.add-member.dto';
import { GroupMembershipRemoveMemberDTO } from '../dtos/group-membership.remove-member.dto';

@ApiTags('modules.auth.group')
@Controller({ version: '1', path: '/group' })
export class GroupAuthController {
    constructor(private readonly groupService: GroupService) {}

    @GroupAuthCreateDoc()
    @Response('group.create')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('/')
    async create(
        @GetUser() user: UserEntity,
        @Body() dto: GroupCreateDTO
    ): Promise<IResponse> {
        dto.createdBy = user?.id || '';
        return await this.groupService.create(dto);
    }

    @GroupAuthGetDoc()
    @Response('group.get')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Get('/:id')
    async get(@Param('id') id: string): Promise<IResponse> {
        return await this.groupService.getById(id);
    }

    @GroupAuthUpdateDoc()
    @Response('group.update')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Put('/:id')
    async update(
        @GetUser() userAuth: UserEntity,
        @Param('id') id: string,
        @Body() dto: GroupUpdateDTO
    ) {
        dto.updatedBy = userAuth?.id || '';
        return await this.groupService.update(id, dto);
    }

    @GroupAuthDeleteDoc()
    @Response('group.delete')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Delete('/:id')
    async delete(@Param('id') id: string) {
        return await this.groupService.delete(id);
    }

    @GroupMembershipAuthJoinDoc()
    @Response('group.join')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('/:id/membership')
    async join(
        @GetUser() userAuth: UserEntity,
        @Param('id') id: string,
        @Body() dto: GroupMembershipAuthJoinDTO
    ) {
        dto.createdBy = userAuth?.id || '';
        dto.memberIds.push(userAuth.id);
        return await this.groupService.join(id, dto);
    }

    @GroupMembershipAuthAddMemberDoc()
    @Response('group.addMember')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('/:id/members')
    async addMember(
        @GetUser() user: UserEntity,
        @Param('id') id: string,
        @Body() dto: GroupMembershipAddMemberDTO
    ) {
        dto.createdBy = user?.id || '';
        return await this.groupService.addMember(id, dto);
    }

    @GroupMembershipAuthRemoveMemberDoc()
    @Response('group.removeMember')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Delete('/:groupId/members/:memberId')
    async removeMember(
        @Param('groupId') groupId: string,
        @Param('memberId') memberId: string,
        @Body() dto: GroupMembershipRemoveMemberDTO
    ) {
        dto.userId = memberId;
        dto.groupId = groupId;
        return await this.groupService.removeMember(dto);
    }
}
