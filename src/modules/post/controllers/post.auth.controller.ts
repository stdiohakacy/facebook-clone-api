import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
} from '@nestjs/common';
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
import { PostService } from '../services/post.service';
import { PostCreateDTO } from '../dtos/post.create.dto';
import {
    PostAuthCreateDoc,
    PostAuthDeleteDoc,
    PostAuthGetDoc,
    PostAuthListDoc,
    PostAuthUpdateDoc,
} from '../docs/post.auth.doc';
import { PostUpdateDTO } from '../dtos/post.update.dto';
import { PaginationQuery } from 'src/core/pagination/decorators/pagination.decorator';
import { PaginationListDTO } from 'src/core/pagination/dtos/pagination.list.dto';
import { PostListSerialization } from '../serializations/post.list.serialization';
import {
    POST_DEFAULT_AVAILABLE_ORDER_BY,
    POST_DEFAULT_AVAILABLE_SEARCH,
    POST_DEFAULT_ORDER_BY,
    POST_DEFAULT_ORDER_DIRECTION,
    POST_DEFAULT_PER_PAGE,
} from '../constants/post.list.constant';

@ApiTags('modules.auth.post')
@Controller({ version: '1', path: '/post' })
export class PostAuthController {
    constructor(private readonly postService: PostService) {}

    @PostAuthListDoc()
    @ResponsePaging('post.list', { serialization: PostListSerialization })
    @UserProtected()
    @AuthJwtAccessProtected()
    @Get('/list')
    async list(
        @GetUser() user: UserEntity,
        @PaginationQuery(
            POST_DEFAULT_PER_PAGE,
            POST_DEFAULT_ORDER_BY,
            POST_DEFAULT_ORDER_DIRECTION,
            POST_DEFAULT_AVAILABLE_SEARCH,
            POST_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDTO
    ) {
        return await this.postService.findPaging(user.id, {
            _search,
            _limit,
            _offset,
            _order,
        });
    }

    @PostAuthCreateDoc()
    @Response('post.create')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('/')
    async create(
        @GetUser() user: UserEntity,
        @Body() dto: PostCreateDTO
    ): Promise<IResponse> {
        dto.userId = user.id;
        return await this.postService.create(dto);
    }

    @PostAuthGetDoc()
    @UserProtected()
    @AuthJwtAccessProtected()
    @Get('/:id')
    async get(@Param('id') id: string): Promise<IResponse> {
        return await this.postService.getById(id);
    }

    @PostAuthUpdateDoc()
    @Response('post.update')
    @UserProtected()
    @AuthJwtAccessProtected()
    @HttpCode(HttpStatus.OK)
    @Put('/:id')
    async update(
        @Param('id') id: string,
        @Body() dto: PostUpdateDTO
    ): Promise<IResponse> {
        return await this.postService.update(id, dto);
    }

    @PostAuthDeleteDoc()
    @Response('post.delete')
    @UserProtected()
    @AuthJwtAccessProtected()
    @HttpCode(HttpStatus.OK)
    @Delete('/:id')
    async delete(@Param('id') id: string) {
        return await this.postService.delete(id);
    }
}
