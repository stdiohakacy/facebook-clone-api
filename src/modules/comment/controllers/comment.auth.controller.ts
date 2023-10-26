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
import { CommentService } from '../services/comment.service';
import {
    Response,
    ResponsePaging,
} from 'src/core/response/decorators/response.decorator';
import {
    GetUser,
    UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from 'src/core/auth/decorators/auth.jwt.decorator';
import { CommentCreateDTO } from '../dtos/comment.create.dto';
import {
    CommentAuthCreateDoc,
    CommentAuthDeleteDoc,
    CommentAuthListDoc,
    CommentAuthUpdateDoc,
} from '../docs/comment.auth.doc';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CommentUpdateDTO } from '../dtos/comment.update.dto';
import { CommentListSerialization } from '../serializations/comment.list.serialization';
import { PaginationQuery } from 'src/core/pagination/decorators/pagination.decorator';
import {
    COMMENT_DEFAULT_AVAILABLE_ORDER_BY,
    COMMENT_DEFAULT_AVAILABLE_SEARCH,
    COMMENT_DEFAULT_ORDER_BY,
    COMMENT_DEFAULT_ORDER_DIRECTION,
    COMMENT_DEFAULT_PER_PAGE,
} from '../constants/comment.list.constant';
import { PaginationListDTO } from 'src/core/pagination/dtos/pagination.list.dto';
import { IResponsePaging } from 'src/core/response/interfaces/response.interface';

@ApiTags('modules.auth.comment')
@Controller({ version: '1', path: '/comment' })
export class CommentAuthController {
    constructor(private readonly commentService: CommentService) {}

    @CommentAuthListDoc()
    @ResponsePaging('comment.list', { serialization: CommentListSerialization })
    @UserProtected()
    @AuthJwtAccessProtected()
    @Get('/post/:id/list')
    async list(
        @Param('id') id: string,
        @PaginationQuery(
            COMMENT_DEFAULT_PER_PAGE,
            COMMENT_DEFAULT_ORDER_BY,
            COMMENT_DEFAULT_ORDER_DIRECTION,
            COMMENT_DEFAULT_AVAILABLE_SEARCH,
            COMMENT_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDTO
    ) {
        return await this.commentService.findPaging(id, {
            _search,
            _limit,
            _offset,
            _order,
        });
    }

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

    @CommentAuthDeleteDoc()
    @Response('comment.delete')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Delete('/:id')
    async delete(@Param('id') id: string) {
        return await this.commentService.delete(id);
    }
}
