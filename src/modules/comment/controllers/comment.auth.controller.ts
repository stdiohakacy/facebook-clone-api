import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from '../services/comment.service';
import { Response } from 'src/core/response/decorators/response.decorator';
import {
    GetUser,
    UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from 'src/core/auth/decorators/auth.jwt.decorator';
import { CommentCreateDTO } from '../dtos/comment.create.dto';
import {
    CommentAuthCreateDoc,
    CommentAuthUpdateDoc,
} from '../docs/comment.auth.doc';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CommentUpdateDTO } from '../dtos/comment.update.dto';

@ApiTags('modules.auth.comment')
@Controller({ version: '1', path: '/comment' })
export class CommentAuthController {
    constructor(private readonly commentService: CommentService) {}

    @CommentAuthCreateDoc()
    @Response('comment.create')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('/post/:id')
    async create(
        @GetUser() user: UserEntity,
        @Param('id') id: string,
        @Body() dto: CommentCreateDTO
    ) {
        dto.postId = id;
        dto.userId = user?.id || '';
        return await this.commentService.create(dto);
    }

    @CommentAuthUpdateDoc()
    @Response('comment.update')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Put('/:id')
    async update(
        @GetUser() user: UserEntity,
        @Param('id') id: string,
        @Body() dto: CommentUpdateDTO
    ) {
        dto.updatedBy = user?.id || '';
        return await this.commentService.update(id, dto);
    }
}
