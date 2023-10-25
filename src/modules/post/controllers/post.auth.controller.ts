import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
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
import { PostService } from '../services/post.service';
import { PostCreateDTO } from '../dtos/post.create.dto';
import {
    PostAuthCreateDoc,
    PostAuthDeleteDoc,
    PostAuthGetDoc,
    PostAuthUpdateDoc,
} from '../docs/post.auth.doc';
import { PostUpdateDTO } from '../dtos/post.update.dto';

@ApiTags('modules.auth.post')
@Controller({ version: '1', path: '/post' })
export class PostAuthController {
    constructor(private readonly postService: PostService) {}

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
